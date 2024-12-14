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
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from typing import Union
import inspect  # Para validar la firma de la función

logger = logging.getLogger(__name__)

# Configuración de límites
TIME_LIMIT_SECONDS = 2  # Tiempo límite en segundos
MEMORY_LIMIT_MB = 50    # Límite de memoria en MB

def parse_input(input_str):
    """
    Parsea entradas flexiblemente
    Soporta JSON, literales de Python, y cadenas simples
    """
    print(f"Input recibido: {input_str}")
    print(f"Tipo de input: {type(input_str)}")
    
    # Si input_str es una lista, conviértelo a JSON
    if isinstance(input_str, list):
        input_str = json.dumps(input_str)
    
    input_str = str(input_str).strip()
    
    print(f"Input después de strip: '{input_str}'")
    
    try:
        # Primero intenta parsear como JSON
        return json.loads(input_str)
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        # Si falla, intenta como literal de Python
        try:
            return ast.literal_eval(input_str)
        except (SyntaxError, ValueError) as e:   
            print(f"Literal Eval Error: {e}")
            # Si falla, intenta separar por comas
            try:
                return [x.strip() for x in input_str.split(',')]
            except Exception as e:
                print(f"Final parsing Error: {e}")
                raise ValueError(f"No se pudo parsear la entrada: {input_str}")
            
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

def are_floats_equal(expected, actual, tolerance=1e-6):
    """
    Compara dos listas de números flotantes permitiendo una tolerancia.
    """
    if len(expected) != len(actual):
        return False
    return all(abs(e - a) <= tolerance for e, a in zip(expected, actual))

def execute_solution(solution_code: str, input_data: Union[dict, list, tuple]):
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
        spec.loader.exec_module(module)

        # Configurar límites de tiempo y memoria
        limit_memory()
        limit_time()

        # Iniciar medición de tiempo y memoria
        tracemalloc.start()
        start_time = time.perf_counter()

        # Encontrar función principal
        solution_func = None
        for name, func in module.__dict__.items():
            if callable(func) and name != '__builtins__':
                solution_func = func
                break

        if not solution_func:
            raise ValueError("No se encontró función en la solución")

        # Validar la firma de la función
        signature = inspect.signature(solution_func)
        func_params = list(signature.parameters.keys())

        # Ajustar el formato de input_data según sea necesario
        if isinstance(input_data, (list, tuple)):
            # Si es una lista con un solo elemento que es otra lista/tupla
            if len(input_data) == 1 and isinstance(input_data[0], (list, tuple)):
                input_args = input_data[0]
            else:
                # Si es una lista simple, pásala como un único argumento
                input_args = [input_data]
        elif isinstance(input_data, dict):
            if set(func_params) != set(input_data.keys()):
                raise ValueError(
                    f"La función debe aceptar exactamente los parámetros: {', '.join(input_data.keys())}. "
                    f"Actualmente acepta: {', '.join(func_params)}"
                )
            input_args = [input_data[param] for param in func_params]
        else:
            # Si es un valor simple, conviértelo en una lista de un elemento
            input_args = [input_data]

        # Ejecutar la función con los argumentos procesados
        result = solution_func(*input_args)

        # Detener medición de tiempo y memoria
        end_time = time.perf_counter()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        execution_time = end_time - start_time
        peak_memory = peak / (1024 * 1024)

        if execution_time > TIME_LIMIT_SECONDS:
            raise TimeoutError("Time Limit Exceeded")

        # Asegurar que el resultado sea serializable
        if isinstance(result, (int, float)):
            result = [result]  # Convertir número simple a lista
        elif isinstance(result, tuple):
            result = list(result)  # Convertir tupla a lista

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
        except Exception as cleanup_error:
            logger.error(f"Error limpiando el archivo temporal: {cleanup_error}")
            
            
def notify_solution(solution_id, status, output):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"solution_{solution_id}",
        {
            "type": "send_solution_update",
            "status": status,
            "output": output,
        }
    )

def notify_user(user_id, status, output):
    # Lógica para enviar una notificación al usuario
    print(f"Notifying user {user_id} with status {status} and output: {output}")

def send_feedback(solution_id, testcase_index, total_testcases, status, message):
    """Función para enviar actualizaciones de progreso."""
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"solution_{solution_id}",  # Grupo del WebSocket
        {
            "type": "send_solution_update",
            "status": status,
            "message": f"Test case {testcase_index}/{total_testcases}: {message}",
        },
    )

async def execute_test_case(channel_layer, solution_id, test_case, test_number, total_tests):
    try:
        # Tu lógica de ejecución actual...
        
        # Formatear el resultado usando el método del modelo TestCase
        test_result = test_case.format_test_result(
            actual_output=output,
            execution_time=execution_time,
            peak_memory=peak_memory
        )

        # Enviar resultado detallado
        await channel_layer.group_send(
            f"solution_{solution_id}",
            {
                "type": "send_solution_update",
                "status": "Running",
                "message": f"Test case {test_number}/{total_tests}: {'Passed' if test_result['status'] == 'Passed' else 'Failed'}",
                "test_case_result": {
                    "test_case_number": test_number,
                    "total_test_cases": total_tests,
                    **test_result
                }
            }
        )

        # Si es el último test, enviar resultado final
        if test_number == total_tests:
            await channel_layer.group_send(
                f"solution_{solution_id}",
                {
                    "type": "send_solution_update",
                    "status": "Completed",
                    "message": "Solution Accepted" if all_tests_passed else "Solution Failed",
                    "test_case_result": {
                        "final_status": "Accepted" if all_tests_passed else "Failed",
                        "total_execution_time": total_time,
                        "max_memory_used": max_memory
                    }
                }
            )

    except Exception as e:
        # Enviar error
        await channel_layer.group_send(
            f"solution_{solution_id}",
            {
                "type": "send_solution_update",
                "status": "Error",
                "message": str(e),
                "test_case_result": {
                    "status": "Error",
                    "error_message": str(e)
                }
            }
        )

@shared_task(bind=True, max_retries=3, default_retry_delay=5)
def evaluate_solution(self, solution_id):
    try:
        from solutions.models import Solution
        solution = Solution.objects.select_related("user", "problem").get(id=solution_id)

        if not solution.code.strip():
            solution.status = "Compilation Error"
            solution.output = "Código vacío"
            solution.save()
            solution.user.actualizar_estadisticas()

            # Notificar al usuario
            notify_solution(solution.id, solution.status, solution.output)
            return

        testcases = solution.problem.testcases.all()
        if not testcases.exists():
            solution.status = "Error"
            solution.output = "Sin casos de prueba"
            solution.save()
            solution.user.actualizar_estadisticas()

            # Notificar al usuario
            notify_user(solution.user.id, solution.status, solution.output)
            return

        total_testcases = len(testcases)
        results = []
        total_time = 0
        total_memory = 0

        for i, testcase in enumerate(testcases):
            try:
                input_data = parse_input(testcase.input)
                execution = execute_solution(solution.code, input_data)
                result = execution["result"]
                execution_time = execution["execution_time"]
                peak_memory = execution["peak_memory"]

                total_time += execution_time or 0
                total_memory = max(total_memory, peak_memory or 0)

                # Asegurar que expected_output sea una lista de números
                try:
                    if isinstance(testcase.expected_output, str):
                        expected_output = json.loads(testcase.expected_output)
                    else:
                        expected_output = testcase.expected_output

                    if isinstance(expected_output, (int, float)):
                        expected_output = [expected_output]
                    elif isinstance(expected_output, tuple):
                        expected_output = list(expected_output)

                    # Asegurar que result también sea una lista
                    if isinstance(result, (int, float)):
                        result = [result]
                    elif isinstance(result, tuple):
                        result = list(result)

                    # Comparar con tolerancia
                    passed = are_floats_equal(expected_output, result)

                    results.append({
                        'testcase_id': testcase.id,
                        'status': 'Passed' if passed else 'Failed',
                        'output': json.dumps(result),
                        'expected': json.dumps(expected_output),
                        'execution_time': execution_time,
                        'peak_memory': peak_memory
                    })
                except json.JSONDecodeError as je:
                    results.append({
                        'testcase_id': testcase.id,
                        'status': 'Error',
                        'output': f'Error en formato de salida: {str(je)}',
                        'execution_time': None,
                        'peak_memory': None
                    })

                send_feedback(
                    solution_id,
                    i + 1,
                    total_testcases,
                    "Running",
                    f"Test case {i + 1}/{total_testcases}: {'Passed' if passed else 'Failed'}"
                )
            except Exception as e:
                results.append({
                    'testcase_id': testcase.id,
                    'status': 'Error',
                    'output': str(e),
                    'execution_time': None,
                    'peak_memory': None
                })
                send_feedback(
                    solution_id,
                    i + 1,
                    total_testcases,
                    "Error",
                    f"Test case {i + 1}/{total_testcases}: Error: {str(e)}"
                )

        # Determinar el estado final
        solution.status = 'Accepted' if all(r['status'] == 'Passed' for r in results) else 'Wrong Answer'
        solution.output = json.dumps(results)
        solution.time = total_time
        solution.memory = total_memory
        solution.save()

        # Actualizar estadísticas del usuario
        solution.user.actualizar_estadisticas()
        send_feedback(
            solution_id,
            total_testcases,
            total_testcases,
            "Completed",
            f"Solution {solution.status}"
        )

        # Otorgar experiencia y actualizar racha si la solución es aceptada
        if solution.status == 'Accepted':
            dificultad = solution.problem.difficulty
            experiencia = solution.user.otorgar_experiencia(dificultad)
            solution.user.actualizar_racha()

            logger.info(
                f"Se otorgaron {experiencia} puntos de experiencia a {solution.user.username} "
                f"por resolver un problema {dificultad}."
            )

        # Notificar al usuario
        notify_user(solution.user.id, solution.status, solution.output)

        return solution.status

    except Exception as exc:
        # Manejo de errores generales
        solution.status = "Error"
        solution.output = str(exc)
        solution.save()
        solution.user.actualizar_estadisticas()

        # Notificar al usuario sobre el error
        notify_user(solution.user.id, "Error", str(exc))
        raise
