from django.db import models
from problems.models import Problem

class TestCase(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='test_cases')
    input = models.TextField()
    output = models.TextField()
    is_public = models.BooleanField(default=False)  # Si es visible para los usuarios

    def __str__(self):
        return f"TestCase for {self.problem.title}"

