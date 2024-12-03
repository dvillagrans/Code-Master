from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.core.exceptions import ValidationError
from .models import Solution, Problem
from .tasks import evaluate_solution
import base64
import binascii


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
