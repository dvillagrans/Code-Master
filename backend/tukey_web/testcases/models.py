from django.db import models
from problems.models import Problem


class TestCase(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='testcases')
    input = models.TextField()  # JSON or text
    expected_output = models.TextField()
    visibility = models.BooleanField(default=False)  # True for public, False for private
    
    def __str__(self):
        return f'Test Case for {self.problem.title}'
     