import importlib.util
import os
import json
import logging
import time
import tracemalloc
import signal  # Necesario para manejar el límite de tiempo
from celery import shared_task
from .models import Solution, TestCase
import ast
import platform
import psutil
import threading

logger = logging.getLogger(__name__)

# Configuración de límites
TIME_LIMIT_SECONDS = 2  # Tiempo límite en segundos
MEMORY_LIMIT_MB = 50    # Límite de memoria en MB

def parse_input(input_str):
    """
    Parsea entradas flexiblemente
    Soporta JSON, literales de Python, y cadenas simples
    """
    input_str = input_str.strip()
    
    # Intentar parseo JSON
    try:
        return json.loads(input_str)
    except json.JSONDecodeError:
        # Intentar eval de literales de Python
        try:
            return ast.literal_eval(input_str)
        except (SyntaxError, ValueError):   
            # Si falla, devolver como está o como lista
            try:
                # Intentar separar por comas
                return [x.strip() for x in input_str.split(',')]
            except:
                return input_str

def limit_memory():
    """
    Configura el límite de memoria dependiendo del sistema operativo.
    """
    if platform.system() == "Windows":
        # En Windows no se puede usar `resource` directamente
        logger.warning("Limitación de memoria no soportada directamente en Windows. Puedes monitorear manualmente.")
    else:
        # En Unix (Linux/macOS), usar `resource` para establecer límites
        import resource
        soft, hard = MEMORY_LIMIT_MB * 1024 * 1024, MEMORY_LIMIT_MB * 1024 * 1024
        resource.setrlimit(resource.RLIMIT_AS, (soft, hard))

def timeout_monitor(pid, time_limit):
    """Monitorea el tiempo de ejecución y verifica si el proceso excede el límite."""
    start_time = time.time()  # Registrar el tiempo de inicio
    process = psutil.Process(pid)  # Obtener el proceso actual

    while True:
        elapsed_time = time.time() - start_time  # Calcular el tiempo transcurrido
        if elapsed_time > time_limit:  # Verificar si el tiempo límite ha sido excedido
            try:
                if process.is_running():
                    print(f"Límite de tiempo excedido: {time_limit} segundos. El proceso sigue corriendo.")
                    # Aquí puedes decidir si terminas el proceso o simplemente registras un mensaje.
                    break  # Sal del monitoreo, pero no termines el proceso.
            except psutil.NoSuchProcess:
                print("El proceso principal ya ha terminado.")
                break
        time.sleep(0.1)  # Revisar cada 100ms

def limit_time():
    """Inicia un hilo para monitorear el tiempo límite."""
    pid = os.getpid()
    monitor_thread = threading.Thread(target=timeout_monitor, args=(pid, TIME_LIMIT_SECONDS))
    monitor_thread.daemon = True  # Finaliza el hilo cuando el programa principal termina
    monitor_thread.start()

def execute_solution(solution_code, input_data):
    """
    Ejecuta dinámicamente la solución con límites de tiempo y memoria.
    """
    temp_dir = f'/tmp/solution_execution'
    os.makedirs(temp_dir, exist_ok=True)
    solution_path = os.path.join(temp_dir, 'solution.py')

    try:
        # Escribir código de solución
        solution_code = "# -*- coding: utf-8 -*-\n" + solution_code
        with open(solution_path, 'w', encoding='utf-8') as f:
            f.write(solution_code)
        
        # Importar módulo dinámicamente
        spec = importlib.util.spec_from_file_location("solution", solution_path)
        module = importlib.util.module_from_spec(spec)
        
        # Configurar límites de tiempo y memoria
        limit_memory()
        limit_time()  # Llama al hilo para monitorear el tiempo

        # Iniciar medición de tiempo y memoria
        tracemalloc.start()
        start_time = time.perf_counter()

        spec.loader.exec_module(module)

        # Encontrar función principal
        solution_func = None
        for name, func in module.__dict__.items():
            if callable(func) and name != '__builtins__':
                solution_func = func
                break

        if not solution_func:
            raise ValueError("No se encontró función en la solución")

        if not isinstance(input_data, list):
            input_data = [input_data]

        # Ejecutar función
        result = solution_func(*input_data)
        
        # Detener medición de tiempo y memoria
        end_time = time.perf_counter()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        execution_time = end_time - start_time
        peak_memory = peak / (1024 * 1024)  # Convertir a MB

        # Verificar límites
        if execution_time > TIME_LIMIT_SECONDS:
            raise TimeoutError("Time Limit Exceeded")

        return {
            "result": result,
            "execution_time": execution_time,
            "peak_memory": peak_memory
        }

    except TimeoutError:
        return {"result": "Time Limit Exceeded", "execution_time": None, "peak_memory": None}
    except MemoryError:
        return {"result": "Memory Limit Exceeded", "execution_time": None, "peak_memory": None}
    except Exception as e:
        return {"result": f"Runtime Error: {str(e)}", "execution_time": None, "peak_memory": None}
    finally:
        try:
            os.remove(solution_path)
        except Exception:
            pass

@shared_task(bind=True, max_retries=3, default_retry_delay=5)
def evaluate_solution(self, solution_id):
    try:
        from solutions.models import Solution
        solution = Solution.objects.select_related("user", "problem").get(id=solution_id)  # Cargar solución con usuario y problema

        if not solution.code.strip():
            solution.status = "Compilation Error"
            solution.output = "Código vacío"
            solution.save()
            solution.user.actualizar_estadisticas()
            return

        testcases = solution.problem.testcases.all()
        if not testcases.exists():
            solution.status = "Error"
            solution.output = "Sin casos de prueba"
            solution.save()
            solution.user.actualizar_estadisticas()
            return

        results = []
        total_time = 0
        total_memory = 0

        for testcase in testcases:
            try:
                input_data = parse_input(testcase.input)
                execution = execute_solution(solution.code, input_data)
                result = execution["result"]
                execution_time = execution["execution_time"]
                peak_memory = execution["peak_memory"]

                total_time += execution_time or 0
                total_memory = max(total_memory, peak_memory or 0)

                passed = str(result).strip() == testcase.expected_output.strip()
                results.append({
                    'testcase_id': testcase.id,
                    'status': 'Passed' if passed else 'Failed',
                    'output': str(result),
                    'expected': testcase.expected_output,
                    'execution_time': execution_time,
                    'peak_memory': peak_memory
                })

            except Exception as e:
                results.append({
                    'testcase_id': testcase.id,
                    'status': 'Error',
                    'output': str(e),
                    'execution_time': None,
                    'peak_memory': None
                })

        solution.status = 'Accepted' if all(r['status'] == 'Passed' for r in results) else 'Wrong Answer'
        solution.output = json.dumps(results)
        solution.time = total_time
        solution.memory = total_memory
        solution.save()

        # Actualizar estadísticas del usuario
        solution.user.actualizar_estadisticas()

        # Otorgar experiencia y actualizar racha si la solución es aceptada
        if solution.status == 'Accepted':
            dificultad = solution.problem.difficulty  # Obtener la dificultad del problema
            experiencia = solution.user.otorgar_experiencia(dificultad)  # Otorgar experiencia basada en la dificultad
            solution.user.actualizar_racha()

            logger.info(f"Se otorgaron {experiencia} puntos de experiencia a {solution.user.username} por resolver un problema {dificultad}.")

        return solution.status

    except Exception as exc:
        solution.status = "Error"
        solution.output = str(exc)
        solution.save()
        solution.user.actualizar_estadisticas()
        raise
