from django.db import models
from problems.models import Problem

class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class ProblemTag(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.tag.name} -> {self.problem.title}"
