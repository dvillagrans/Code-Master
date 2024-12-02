import subprocess
import os
import logging
from celery import shared_task
from .models import Solution, TestCase  # Asegúrate de que TestCase esté importado

# Configurar logging
logger = logging.getLogger(__name__)

@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=5
)
def evaluate_solution(self, solution_id):
    logger.info(f"Starting evaluation for solution {solution_id}")
    
    try:
        # Recuperar la solución desde la base de datos
        solution = Solution.objects.get(id=solution_id)
        logger.info(f"Solution retrieved: {solution}")

        if not solution.code.strip():
            logger.warning("Empty code submitted")
            solution.status = "Wrong Answer"
            solution.output = "Code cannot be empty."
            solution.save()
            return

        # Recuperar los casos de prueba asociados al problema
        testcases = TestCase.objects.filter(problem=solution.problem)
        if not testcases.exists():
            logger.error(f"No test cases found for problem {solution.problem.id}")
            solution.status = "Error"
            solution.output = "No test cases available for evaluation."
            solution.save()
            return

        results = []  # Almacenar resultados individuales de cada caso de prueba

        # Crear un archivo temporal para almacenar el código
        code_file_path = f"solution_{solution_id}.py"
        try:
            with open(code_file_path, "w") as code_file:
                code_file.write(solution.code)
            logger.info(f"Temporary code file created: {code_file_path}")
        except Exception as file_exc:
            logger.error(f"Failed to create temporary file: {file_exc}")
            solution.status = "Error"
            solution.output = "Failed to create temporary file for code execution."
            solution.save()
            return

        # Evaluar cada caso de prueba
        for testcase in testcases:
            try:
                # Ejecutar el archivo con la entrada del caso de prueba
                result = subprocess.run(
                    ["python", code_file_path],
                    input=testcase.input.encode(),
                    capture_output=True,
                    text=True,
                    timeout=5
                )

                # Registrar información de salida
                logger.info(f"Test case {testcase.id} completed with return code: {result.returncode}")
                logger.info(f"stdout: {result.stdout}")
                logger.error(f"stderr: {result.stderr}")

                # Comparar salida
                if result.returncode == 0:
                    if result.stdout.strip() == testcase.expected_output.strip():
                        results.append({'testcase_id': testcase.id, 'status': 'Passed'})
                    else:
                        results.append({'testcase_id': testcase.id, 'status': 'Failed', 'output': result.stdout})
                else:
                    stderr_message = result.stderr.lower()
                    if "recursionerror" in stderr_message:
                        results.append({'testcase_id': testcase.id, 'status': 'Runtime Error', 'output': 'Recursion depth exceeded.'})
                    elif "syntaxerror" in stderr_message:
                        results.append({'testcase_id': testcase.id, 'status': 'Compilation Error', 'output': result.stderr})
                    elif "memory" in stderr_message:
                        results.append({'testcase_id': testcase.id, 'status': 'Memory Limit Exceeded', 'output': 'Memory usage exceeded.'})
                    else:
                        results.append({'testcase_id': testcase.id, 'status': 'Failed', 'output': result.stderr})

            except subprocess.TimeoutExpired:
                logger.warning(f"Test case {testcase.id} timed out.")
                results.append({'testcase_id': testcase.id, 'status': 'Time Limit Exceeded', 'output': 'Execution time exceeded the limit.'})
            except Exception as test_exc:
                logger.error(f"Unexpected error during test case {testcase.id}: {test_exc}")
                results.append({'testcase_id': testcase.id, 'status': 'Error', 'output': str(test_exc)})

        # Determinar el estado general
        if all(result['status'] == 'Passed' for result in results):
            solution.status = "Accepted"
        else:
            solution.status = "Wrong Answer"
        
        # Guardar resultados y estado
        solution.output = results
        solution.save()
        logger.info(f"Solution status saved: {solution.status}")

    except Solution.DoesNotExist:
        logger.error(f"Solution with ID {solution_id} does not exist.")
        self.retry(exc=Exception(f"Solution {solution_id} not found"))

    except Exception as exc:
        logger.error(f"Unexpected error: {str(exc)}")
        solution.status = "Error"
        solution.output = f"An unexpected error occurred: {str(exc)}"
        solution.save()
        raise self.retry(exc=exc)

    finally:
        # Limpieza del archivo temporal
        try:
            if os.path.exists(code_file_path):
                os.remove(code_file_path)
                logger.info("Temporary code file removed")
        except Exception as cleanup_exc:
            logger.error(f"Failed to clean up temporary file for solution {solution_id}: {cleanup_exc}")
