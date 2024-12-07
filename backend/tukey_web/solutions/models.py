from django.db import models
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
    
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='solutions')
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='solutions')
    language = models.CharField(max_length=50)
    code = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    output = models.TextField(blank=True, null=True)
    time = models.FloatField(blank=True, null=True, default=0.0)
    memory = models.FloatField(blank=True, null=True, default=0.0)
    
    def trigger_evaluation(self):
        from .tasks import evaluate_solution
        evaluate_solution.delay(self.id)

    def __str__(self):
        return f"Solution {self.id} by {self.user.username} for {self.problem.title}"


class SolutionTestCaseResult(models.Model):
    solution = models.ForeignKey(Solution, on_delete=models.CASCADE, related_name='test_case_results')
    testcase = models.ForeignKey(TestCase, on_delete=models.CASCADE)
    status = models.CharField(max_length=30, choices=Solution.STATUS_CHOICES)
    output = models.TextField(blank=True, null=True)
    expected_output = models.TextField()
    time = models.FloatField(blank=True, null=True, default=0.0)
    memory = models.FloatField(blank=True, null=True, default=0.0)

    def __str__(self):
        return f"TestCase {self.testcase.id} for Solution {self.solution.id}"
