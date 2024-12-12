from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from .models import CustomUser
from .serializers import CustomUserSerializer, CustomTokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from django.db.models import Avg, Sum, Count
from django.shortcuts import render
from users.models import CustomUser
from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Max, Min
from django.http import JsonResponse
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
import json
from rest_framework import status
from .models import CustomUser
from .serializers import CustomUserSerializer
from solutions.models import Solution
from solutions.serializers import SolutionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser

@csrf_exempt  # Si no usas CSRF en el frontend, añade esta excepción
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)

            # Crear la respuesta
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
        return JsonResponse({'error': 'Invalid credentials'}, status=400)
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
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            response = Response({
                "message": "Usuario registrado exitosamente",
                "user_id": user.id,
                "username": user.username,
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token)
                }
            }, status=status.HTTP_201_CREATED)

            # Configurar cookies
            set_cookie(response, 'access_token', str(refresh.access_token), max_age=3600)
            set_cookie(response, 'refresh_token', str(refresh), max_age=604800)

            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        users = CustomUser.objects.all().order_by('-ranking_score')
        ranking = [
            {
                "username": user.username,
                "name": user.name,
                "ranking_score": user.ranking,
                "nivel": user.nivel,
                "racha": user.racha,
                "ejercicios_completados": user.ejercicios_completados,
                "avatar": user.avatar.url if user.avatar else None,
            }
            for user in users
        ]
        return Response(ranking)
    
