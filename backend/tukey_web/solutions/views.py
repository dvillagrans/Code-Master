from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Solution
from problems.models import Problem
from django.core.exceptions import ValidationError
import base64
import binascii

class SubmitSolutionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            print("Datos recibidos:", data)
            user = request.user

            # Validar que el campo problem_id está presente
            problem_id = data.get('problem_id')
            if not problem_id:
                raise ValidationError({'problem_id': 'This field is required.'})

            # Validar que el campo language está presente
            language = data.get('language')
            if not language:
                raise ValidationError({'language': 'This field is required.'})

            # Validar que el campo code está presente y decodificarlo
            encoded_code = data.get('code')
            if not encoded_code:
                raise ValidationError({'code': 'This field is required.'})

            try:
                decoded_code = base64.b64decode(encoded_code).decode('utf-8')
                print("Decoded Code:", decoded_code)
            except (binascii.Error, UnicodeDecodeError) as e:
                print("Base64 Decoding Error:", e)
                return Response(
                    {'error': 'Invalid Base64 encoding for code.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Validar que el problema existe
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
