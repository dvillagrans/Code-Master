from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Solution
from problems.models import Problem
from rest_framework.exceptions import ValidationError

class SubmitSolutionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        user = request.user

        # Validar que el campo problem_id está presente
        problem_id = data.get('problem_id')
        if not problem_id:
            raise ValidationError({'problem_id': 'This field is required.'})

        # Validar que el campo language está presente
        language = data.get('language')
        if not language:
            raise ValidationError({'language': 'This field is required.'})

        # Validar que el campo code está presente
        code = data.get('code')
        if not code:
            raise ValidationError({'code': 'This field is required.'})

        # Validar que el problema existe
        try:
            problem = Problem.objects.get(id=problem_id)
        except Problem.DoesNotExist:
            raise ValidationError({'problem_id': 'The problem does not exist.'})

        # Crear la solución con estado "Pending"
        solution = Solution.objects.create(
            user=user,
            problem=problem,
            language=language,
            code=code,
            status="Pending"
        )

        # Llamar a la tarea de evaluación
        solution.trigger_evaluation()

        # Retornar respuesta al cliente
        return Response(
            {
                'message': 'Solution submitted successfully.',
                'solution_id': solution.id,
                'status': solution.status
            },
            status=status.HTTP_201_CREATED
        )
