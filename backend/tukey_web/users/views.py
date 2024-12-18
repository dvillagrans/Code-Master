from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from .models import CustomUser
from .serializers import CustomUserSerializer, CustomTokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Avg, Sum, Count
from django.shortcuts import render
from users.models import CustomUser
from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Max, Min
import json
from solutions.models import Solution
from solutions.serializers import SolutionSerializer
from .firebase import auth  # Asegúrate de tener tu configuración de Firebase

# Importar el decorador aquí
from users.decorators import admin_required

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    if request.method == "POST":
        token = request.data.get("firebase_token")
        
        if not token:
            return JsonResponse({'error': 'Firebase token is required'}, status=400)
        
        try:
            # Verificar el token de Firebase
            decoded_token = auth.verify_id_token(token)
            firebase_uid = decoded_token['uid']
            email = decoded_token.get('email')
            username = email.split('@')[0]  # Generar un username si no está definido
            
            # Buscar o crear el usuario en Django
            user, created = CustomUser.objects.get_or_create(
                firebase_uid=firebase_uid,
                defaults={
                    "username": username,
                    "email": email,
                }
            )
            
            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            response = JsonResponse({'message': 'Login successful'})
            
            # Configurar las cookies
            response.set_cookie(
                'access_token',
                str(refresh.access_token),
                httponly=True,
                secure=False,  # Cambiar a True en producción con HTTPS
                samesite='Lax'
            )
            response.set_cookie(
                'refresh_token',
                str(refresh),
                httponly=True,
                secure=False,  # Cambiar a True en producción con HTTPS
                samesite='Lax'
            )
            return response
        except Exception as e:
            return JsonResponse({'error': f'Firebase token verification failed: {str(e)}'}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)


# Vista protegida para el perfil de usuario
class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]  # Usa JWT con cookies
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        recent_solutions = Solution.objects.filter(user=user).order_by('-created_at')[:10]
        recent_solutions_data = SolutionSerializer(recent_solutions, many=True).data

        data = {
            "name": user.name,
            "last_name": user.last_name,
            "nivel": user.nivel,
            "ranking": user.ranking,
            "puntos_experiencia": user.puntos_experiencia,
            "racha": user.racha,
            "ejercicios_completados": user.ejercicios_completados,
            "accuracy": user.tasa_exito,
            "avatar": user.avatar.url if user.avatar else None,
            "recentSolutions": recent_solutions_data,
            "ejercicios_resueltos_ultimos_siete_dias": user.ejercicios_resueltos_ultimos_siete_dias,
        }
        return Response(data)


# Personalización del token para incluir más campos del usuario
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# Vista para registrar usuarios
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("Registration request data:", request.data)  # Debug log
        
        serializer = CustomUserSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            
            response_data = {
                "success": True,
                "message": "Usuario registrado exitosamente",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "name": user.name,
                    "last_name": user.last_name,
                    "role": user.role
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }
            
            response = Response(response_data, status=status.HTTP_201_CREATED)
            
            # Set cookies
            response.set_cookie(
                'access_token',
                str(refresh.access_token),
                max_age=3600,
                httponly=True,
                samesite='Lax'
            )
            response.set_cookie(
                'refresh_token',
                str(refresh),
                max_age=604800,
                httponly=True,
                samesite='Lax'
            )
            
            return response
            
        except Exception as e:
            print(f"Registration error: {str(e)}")  # Debug log
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


# Vista de conjunto de usuarios (CRUD)
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]  # Protege las vistas con autenticación


# Vista para cambiar la contraseña del usuario
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({"error": "Contraseña actual incorrecta"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user=user)
        except ValidationError as e:
            return Response({"error": e.messages}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Contraseña actualizada correctamente"})


# Vista para obtener el usuario actual
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)


def dashboard(request):
    """
    Vista para mostrar las estadísticas generales de los usuarios.
    """
    total_usuarios = CustomUser.objects.count()
    usuarios_activos = CustomUser.objects.filter(ejercicios_completados__gt=0).count()
    promedio_ejercicios = CustomUser.objects.aggregate(promedio=Avg('ejercicios_completados'))['promedio'] or 0
    promedio_racha = CustomUser.objects.aggregate(promedio=Avg('racha'))['promedio'] or 0
    distribucion_niveles = CustomUser.objects.values('nivel').annotate(count=Count('nivel'))
    distribucion_experiencia = CustomUser.objects.aggregate(
        max_experiencia=Max('puntos_experiencia'),
        min_experiencia=Min('puntos_experiencia'),
        promedio=Avg('puntos_experiencia')
    )

    context = {
        'total_usuarios': total_usuarios,
        'usuarios_activos': usuarios_activos,
        'promedio_ejercicios': promedio_ejercicios,
        'promedio_racha': promedio_racha,
        'distribucion_niveles': distribucion_niveles,
        'distribucion_experiencia': distribucion_experiencia,
        'ranking': CustomUser.objects.order_by('-puntos_experiencia')[:10]  # Cambiado de ranking_score a puntos_experiencia
    }
    return render(request, 'dashboard.html', context)

def set_cookie(response, name, value, max_age=None):
    response.set_cookie(
        name,
        value,
        httponly=True,
        secure=True,  # Usa HTTPS en producción
        samesite='Lax',
        max_age=max_age
    )

class UserRankingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = CustomUser.objects.all().order_by('-puntos_experiencia')  # Ordenar por puntos_experiencia en orden descendente
        ranking = [
            {
                "username": user.username,
                "points": user.puntos_experiencia,
                "nivel": user.nivel,
                "ejercicios_completados": user.ejercicios_completados,
                "avatar": user.avatar.url if user.avatar else None,
            }
            for user in users[:10]
        ]
        return Response({"users": ranking})

class FirebaseAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"error": "Token not provided"}, status=400)

        try:
            # Verificar el ID Token con Firebase Admin
            decoded_token = auth.verify_id_token(token)
            firebase_uid = decoded_token["uid"]
            email = decoded_token.get("email")
            username = email.split('@')[0] if email else f"user_{firebase_uid}"

            # Buscar al usuario por correo
            user = CustomUser.objects.filter(email=email).first()

            if user:
                if not user.firebase_uid:
                    user.firebase_uid = firebase_uid
                    user.save()
                created = False
            else:
                user = CustomUser.objects.create(
                    firebase_uid=firebase_uid,
                    email=email,
                    username=username
                )
                created = True

            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Crear la respuesta con los tokens en cookies
            response = JsonResponse({
                "status": "success",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "created": created,
            })

            # Configurar cookies para access_token y refresh_token
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=False,  # Cambiar a True en producción con HTTPS
                samesite="Lax",
                max_age=3600  # 1 hora
            )
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=False,  # Cambiar a True en producción con HTTPS
                samesite="Lax",
                max_age=7 * 24 * 3600  # 7 días
            )

            return response

        except ValueError as e:
            return Response({"error": "Invalid token"}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
            return Response({"error": str(e)}, status=500)

class AdminOnlyView(APIView):
    permission_classes = [IsAuthenticated]
    
    @admin_required
    def get(self, request):
        return Response({"message": "Welcome, admin!"})

@api_view(['POST'])
@permission_classes([AllowAny])
def check_username(request):
    username = request.data.get('username')
    if not username:
        return Response(
            {'error': 'Username is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    exists = CustomUser.objects.filter(username=username).exists()
    return Response(
        {'exists': exists},
        status=status.HTTP_200_OK
    )

