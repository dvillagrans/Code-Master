from rest_framework import serializers
from .models import Solution

class SolutionSerializer(serializers.ModelSerializer):
    problem_title = serializers.CharField(source='problem.title', read_only=True)

    class Meta:
        model = Solution
        fields = ['id', 'problem_title', 'language', 'status', 'created_at', 'time', 'memory']
