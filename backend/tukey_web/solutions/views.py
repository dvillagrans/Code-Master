from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.core.exceptions import ValidationError
from .models import Solution, Problem
from .tasks import evaluate_solution
import base64
import binascii
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Solution
from .serializers import SolutionSerializer
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Solution


class SubmitSolutionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            user = request.user

            # Validar los campos necesarios
            problem_id = data.get('problem_id')
            language = data.get('language')
            encoded_code = data.get('code')

            if not problem_id or not language or not encoded_code:
                raise ValidationError({
                    'problem_id': 'This field is required.' if not problem_id else None,
                    'language': 'This field is required.' if not language else None,
                    'code': 'This field is required.' if not encoded_code else None,
                })

            # Decodificar el código
            try:
                decoded_code = base64.b64decode(encoded_code).decode('utf-8')
            except (binascii.Error, UnicodeDecodeError) as e:
                return Response(
                    {'error': 'Invalid Base64 encoding for code.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Verificar que el problema existe
            try:
                problem = Problem.objects.get(id=problem_id)
            except Problem.DoesNotExist:
                return Response(
                    {'error': 'The specified problem does not exist.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Crear la solución con estado "Pending"
            solution = Solution.objects.create(
                user=user,
                problem=problem,
                language=language,
                code=decoded_code,
                status="Pending"
            )

            # Disparar el task de Celery
            evaluate_solution.delay(solution.id)

            # Retornar respuesta al cliente
            return Response(
                {
                    'message': 'Solution submitted successfully.',
                    'solution_id': solution.id,
                    'status': solution.status
                },
                status=status.HTTP_201_CREATED
            )

        except ValidationError as e:
            return Response(
                {'error': e.message_dict},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'An unexpected error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class RecentSolutionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        recent_solutions = Solution.objects.filter(user=user).order_by('-created_at')[:10]
        serializer = SolutionSerializer(recent_solutions, many=True)
        return Response(serializer.data)

@login_required
def recent_exercises(request):
    user = request.user
    # Obtén las últimas 5 soluciones del usuario
    recent_solutions = Solution.objects.filter(user=user).order_by('-created_at')[:5]
    exercises = [
        {
            "id": solution.id,
            "name": solution.problem.title,  # Asegúrate de que 'problem' tiene un campo 'title'
            "difficulty": solution.problem.difficulty,  # Cambia esto si necesitas otro atributo
            "date": solution.created_at.strftime('%Y-%m-%d %H:%M'),
            "status": solution.status,
        }
        for solution in recent_solutions
    ]
    return JsonResponse({"recent_exercises": exercises})

class SolutionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, solution_id):
        try:
            # Verifica que la solución exista y pertenezca al usuario autenticado
            solution = Solution.objects.get(id=solution_id, user=request.user)

            # Devuelve los detalles de la solución
            return Response({
                "solution_id": solution.id,
                "status": solution.status,
                "output": solution.output,
                "execution_time": solution.time,
                "peak_memory": solution.memory,
                "created_at": solution.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                "updated_at": solution.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
            }, status=status.HTTP_200_OK)

        except Solution.DoesNotExist:
            return Response(
                {"error": "Solution not found or does not belong to the authenticated user."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

