import importlib.util
import sys
import os
import json
import logging
from celery import shared_task
from .models import Solution, TestCase
import ast

logger = logging.getLogger(__name__)

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

def execute_solution(solution_code, input_data):
    """
    Ejecuta dinámicamente la solución con los datos de entrada
    """
    # Crear directorio temporal
    temp_dir = f'/tmp/solution_execution'
    os.makedirs(temp_dir, exist_ok=True)
    
    # Ruta del archivo de solución
    solution_path = os.path.join(temp_dir, 'solution.py')
    
    try:
        # Añadir encabezado de codificación
        solution_code = "# -*- coding: utf-8 -*-\n" + solution_code
        
        # Validar codificación UTF-8
        solution_code.encode('utf-8')

        # Escribir código de solución
        with open(solution_path, 'w', encoding='utf-8') as f:
            f.write(solution_code)
        
        # Importar módulo dinámicamente
        spec = importlib.util.spec_from_file_location("solution", solution_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        
        # Encontrar función principal (asume que es la primera función definida)
        solution_func = None
        for name, func in module.__dict__.items():
            if callable(func) and name != '__builtins__':
                solution_func = func
                break
        
        if not solution_func:
            raise ValueError("No se encontró función en la solución")
        
        # Ejecutar función con datos de entrada
        if not isinstance(input_data, list):
            input_data = [input_data]
        
        result = solution_func(*input_data)
        return result
    
    except Exception as e:
        raise RuntimeError(f"Error en ejecución: {str(e)}")
    finally:
        # Limpiar archivo temporal
        try:
            os.remove(solution_path)
        except Exception:
            pass


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=5
)
def evaluate_solution(self, solution_id):
    try:
        solution = Solution.objects.get(id=solution_id)
        
        if not solution.code.strip():
            solution.status = "Wrong Answer"
            solution.output = "Código vacío"
            solution.save()
            return
        
        testcases = TestCase.objects.filter(problem=solution.problem)
        if not testcases.exists():
            solution.status = "Error"
            solution.output = "Sin casos de prueba"
            solution.save()
            return
        
        results = []
        
        for testcase in testcases:
            try:
                # Parseo flexible de inputs
                input_data = parse_input(testcase.input)
                
                # Manejar casos con múltiples argumentos o un solo argumento
                if not isinstance(input_data, list):
                    input_data = [input_data]
                
                result = execute_solution(solution.code, input_data)
                
                passed = str(result).strip() == testcase.expected_output.strip()
                
                results.append({
                    'testcase_id': testcase.id,
                    'status': 'Passed' if passed else 'Failed',
                    'output': str(result),
                    'expected': testcase.expected_output
                })
            
            except Exception as e:
                results.append({
                    'testcase_id': testcase.id,
                    'status': 'Error',
                    'output': str(e)
                })
        
        solution.status = 'Accepted' if all(r['status'] == 'Passed' for r in results) else 'Wrong Answer'
        solution.output = json.dumps(results)
        solution.save()
        
        return solution.status
    
    except Exception as exc:
        solution.status = 'Error'
        solution.output = str(exc)
        solution.save()
        raise