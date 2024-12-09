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


    
    def __str__(self):
        return f'Test Case for {self.problem.title}'