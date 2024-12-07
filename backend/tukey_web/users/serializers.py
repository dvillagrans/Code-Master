from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Agregar campos personalizados al token
        token['email'] = user.email
        token['username'] = user.username
        token['nivel'] = user.nivel
        token['puntos_experiencia'] = user.puntos_experiencia
        return token

    def validate(self, attrs):
        login = attrs.get("username")  # Cambiar el nombre del campo en el formulario
        password = attrs.get("password")

        # Intentar autenticar por correo o nombre de usuario
        user = authenticate(username=login, password=password)
        if not user:
            user = authenticate(email=login, password=password)  # Intentar por correo
            if not user:
                raise AuthenticationFailed("Credenciales inválidas. Verifica tu usuario o correo y contraseña.")

        # Verificar si el usuario está activo
        if not user.is_active:
            raise AuthenticationFailed("Esta cuenta está deshabilitada.")

        # Generar el token
        token = super().validate(attrs)
        token['email'] = user.email
        token['username'] = user.username
        token['nivel'] = user.nivel
        token['puntos_experiencia'] = user.puntos_experiencia

        return token



# Serializer para la creación y manejo de usuarios
class CustomUserSerializer(serializers.ModelSerializer):
    confirmPassword = serializers.CharField(write_only=True)
    terms = serializers.BooleanField(required=True)

    class Meta:
        model = CustomUser
        fields = [
            'name',
            'last_name',
            'email', 
            'username', 
            'password', 
            'confirmPassword', 
            'terms',
            'id',  # ID del usuario
            'name',  # Nombre
            'last_name',  # Apellido
            'email',  # Correo electrónico
            'username',  # Nombre de usuario
            'nivel',  # Nivel del usuario
            'puntos_experiencia',  # Puntos de experiencia
            'racha',  # Racha actual
            'ejercicios_completados',  # Ejercicios completados
            'avatar'  # Campo para la foto/avatar del usuario
            'ranking' # Ranking del usuario
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        # Validar que las contraseñas coincidan
        if data['password'] != data.pop('confirmPassword'):
            raise serializers.ValidationError({"confirmPassword": "Las contraseñas no coinciden."})
        
        # Validar que se acepten los términos
        if not data.get('terms'):
            raise serializers.ValidationError({"terms": "Debes aceptar los términos y condiciones."})
        
        return data

    def create(self, validated_data):
        # Eliminar campos que no están en el modelo
        validated_data.pop('terms')
        
        # Crear usuario con contraseña hasheada
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            last_name=validated_data['last_name']
        )
        return user
    
# Serializer para actualizar el perfil de usuario
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['name', 'last_name', 'email', 'username', 'nivel', 'puntos_experiencia']
        extra_kwargs = {
            'username': {'read_only': True},
            'nivel': {'read_only': True},
            'puntos_experiencia': {'read_only': True}
        }
        
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance