import subprocess
import os
import logging
from celery import shared_task
from .models import Solution

# Configurar logging
logger = logging.getLogger(__name__)

@shared_task(
    bind=True,  # Permite acceso al contexto de la tarea
    max_retries=3,  # Número de reintentos en caso de fallo
    default_retry_delay=5  # Tiempo entre reintentos
)
def evaluate_solution(self, solution_id):
    logger.info(f"Starting evaluation for solution {solution_id}")
    
    try:
        # Recuperar la solución desde la base de datos
        solution = Solution.objects.get(id=solution_id)
        logger.info(f"Solution retrieved: {solution}")

        # Validar que el código no esté vacío
        if not solution.code.strip():
            logger.warning("Empty code submitted")
            solution.status = "Wrong Answer"
            solution.output = "Code cannot be empty."
            solution.save()
            return

        # Crear un archivo temporal para almacenar el código del usuario
        code_file_path = f"solution_{solution_id}.py"
        with open(code_file_path, "w") as code_file:
            code_file.write(solution.code)
        
        logger.info(f"Temporary code file created: {code_file_path}")

        # Ejecutar el archivo con configuraciones de seguridad
        result = subprocess.run(
            ["python", code_file_path],
            capture_output=True,
            text=True,
            timeout=5,
            # Configuraciones de seguridad adicionales
            stdin=subprocess.PIPE,
            env={}  # Entorno limpio
        )
        
        logger.info(f"Subprocess execution completed. Return code: {result.returncode}")

        # Procesar el resultado de la ejecución
        if result.returncode == 0:
            solution.status = "Accepted"
            solution.output = result.stdout
            logger.info("Solution accepted")
        else:
            solution.status = "Wrong Answer"
            solution.output = result.stderr
            logger.warning("Solution failed")

        # Guardar cambios en la base de datos
        solution.save()
        logger.info(f"Solution status saved: {solution.status}")

    except Solution.DoesNotExist:
        logger.error(f"Solution with ID {solution_id} does not exist.")
        self.retry(exc=Exception(f"Solution {solution_id} not found"))
    
    except subprocess.TimeoutExpired:
        logger.warning("Execution timeout")
        solution.status = "Timeout"
        solution.output = "Execution time exceeded the limit."
        solution.save()
    
    except Exception as exc:
        logger.error(f"Unexpected error: {str(exc)}")
        solution.status = "Error"
        solution.output = f"An unexpected error occurred: {str(exc)}"
        solution.save()
        
        # Reintento para tareas con errores
        raise self.retry(exc=exc)
    
    finally:
        # Limpieza del archivo temporal
        if os.path.exists(code_file_path):
            os.remove(code_file_path)
            logger.info("Temporary code file removed")