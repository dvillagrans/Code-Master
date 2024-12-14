import ast
import json
from django.db import models
from problems.models import Problem

class TestCase(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='testcases')
    input = models.TextField()  # Stored as string representation
    expected_output = models.TextField()
    visibility = models.BooleanField(default=False)  # True for public, False for private

    def save(self, *args, **kwargs):
        def normalize_value(value):
            try:
                # Intentar parsear como literal de Python
                parsed = ast.literal_eval(value)
                # Convertir a JSON
                return json.dumps(parsed)
            except (ValueError, SyntaxError):
                try:
                    # Si no es un literal, intentar parsear como JSON
                    parsed = json.loads(value)
                    return json.dumps(parsed)
                except json.JSONDecodeError:
                    # Si no se puede parsear, asumir que ya es un valor que json.dumps() puede manejar
                    return json.dumps(value)

        # Normalizar input y expected_output
        try:
            self.input = normalize_value(self.input)
            self.expected_output = normalize_value(self.expected_output)
        except Exception as e:
            raise ValueError(f"Invalid input or expected_output: {str(e)}")

        super().save(*args, **kwargs)

    def get_input(self):
        # Método para obtener el input como objeto Python
        input_data = ast.literal_eval(self.input)
        if isinstance(input_data, tuple):
            return list(input_data)
        return json.loads(self.input)

    
    def get_expected_output(self):
        # Método para obtener el expected_output como objeto Python
        return json.loads(self.expected_output)

    def get_formatted_input(self):
        """Retorna el input formateado para mostrar en el frontend"""
        try:
            input_data = self.get_input()
            if isinstance(input_data, (list, tuple)):
                return "\n".join(str(x) for x in input_data)
            elif isinstance(input_data, dict):
                return json.dumps(input_data, indent=2)
            return str(input_data)
        except Exception as e:
            return f"Error formatting input: {str(e)}"

    def get_formatted_output(self):
        """Retorna el output formateado para mostrar en el frontend"""
        try:
            output_data = self.get_expected_output()
            if isinstance(output_data, (list, tuple)):
                return "\n".join(str(x) for x in output_data)
            elif isinstance(output_data, dict):
                return json.dumps(output_data, indent=2)
            return str(output_data)
        except Exception as e:
            return f"Error formatting output: {str(e)}"

    def format_test_result(self, actual_output, execution_time=0, peak_memory=0):
        """
        Formatea el resultado de la prueba para enviar al frontend
        """
        try:
            expected = self.get_formatted_output()
            # Intentar formatear el output actual de la misma manera que el esperado
            if isinstance(actual_output, (list, tuple)):
                formatted_output = "\n".join(str(x) for x in actual_output)
            elif isinstance(actual_output, dict):
                formatted_output = json.dumps(actual_output, indent=2)
            else:
                formatted_output = str(actual_output)

            return {
                "input": self.get_formatted_input(),
                "expected": expected,
                "output": formatted_output,
                "execution_time": execution_time,
                "peak_memory": peak_memory,
                "status": "Passed" if str(formatted_output).strip() == str(expected).strip() else "Failed",
                "error_message": "" if str(formatted_output).strip() == str(expected).strip() else 
                    "La salida no coincide con el resultado esperado"
            }
        except Exception as e:
            return {
                "input": self.get_formatted_input(),
                "expected": self.get_formatted_output(),
                "output": str(actual_output),
                "execution_time": execution_time,
                "peak_memory": peak_memory,
                "status": "Failed",
                "error_message": f"Error al procesar el resultado: {str(e)}"
            }

    def validate_output(self, actual_output):
        """
        Valida si la salida actual coincide con la esperada
        """
        try:
            expected = self.get_expected_output()
            if isinstance(expected, (list, tuple)):
                expected = list(expected)
            if isinstance(actual_output, (list, tuple)):
                actual_output = list(actual_output)
            
            # Convertir ambos a strings para comparación
            expected_str = str(expected).strip()
            actual_str = str(actual_output).strip()
            
            return expected_str == actual_str
        except Exception as e:
            return False

    def __str__(self):
        return f'Test Case for {self.problem.title}'