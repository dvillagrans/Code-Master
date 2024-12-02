from django.db import models
from users.models import CustomUser
from problems.models import Problem
from testcases.models import TestCase

class Solution(models.Model):
    STATUS_CHOICES = [
        ('Accepted', 'Accepted'),
        ('Wrong Answer', 'Wrong Answer'),
        ('Pending', 'Pending'),
        ('Compilation Error', 'Compilation Error'),
        ('Runtime Error', 'Runtime Error'),
        ('Memory Limit Exceeded', 'Memory Limit Exceeded'),
        ('Time Limit Exceeded', 'Time Limit Exceeded'),
        ('Evaluation Failed', 'Evaluation Failed'),
    ]
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    problem = models.ForeignKey('problems.Problem', on_delete=models.CASCADE)
    language = models.CharField(max_length=50)
    code = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    output = models.TextField(blank=True, null=True)
    time = models.FloatField(blank=True, null=True)
    memory = models.FloatField(blank=True, null=True)

    def trigger_evaluation(self):
        from .tasks import evaluate_solution
        evaluate_solution.delay(self.id)

    
