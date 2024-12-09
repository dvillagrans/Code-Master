from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Problem


class ProblemListView(APIView):
    permission_classes = [IsAuthenticated]  # Requiere autenticación

    def get(self, request):
        problems = Problem.objects.all()
        data = [
            {
                "id": problem.id,
                "title": problem.title,
                "description": problem.description,
                "difficulty": problem.difficulty,
                "category": problem.category.name if problem.category else None,
                "tags": [tag.name for tag in problem.tags.all()],
                "completed": problem.is_completed_by_user(request.user),
            }
            for problem in problems
        ]
        return Response({"problems": data}, status=status.HTTP_200_OK)

class ProblemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            problem = Problem.objects.get(id=id)
            examples = [
                {
                    "input": example.input_data,
                    "output": example.output_data,
                    "explanation": example.explanation,
                }
                for example in problem.examples.all()
            ]
            data = {
                "id": problem.id,
                "title": problem.title,
                "description": problem.description,
                "difficulty": problem.difficulty,
                "category": problem.category.name if problem.category else None,
                "tags": [tag.name for tag in problem.tags.all()],
                "examples": examples,
                "formula": problem.formula,
            }
            return Response(data, status=status.HTTP_200_OK)
        except Problem.DoesNotExist:
            return Response({"error": "Problem not found"}, status=status.HTTP_404_NOT_FOUND)
