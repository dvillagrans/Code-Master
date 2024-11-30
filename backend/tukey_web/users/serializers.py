from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed


# Serializer para personalizar el token
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Agregar campos personalizados al token
        token['email'] = user.email
        token['nivel'] = user.nivel
        token['puntos_experiencia'] = user.puntos_experiencia
        return token

    def validate(self, attrs):
        # Sobrescribir para usar email en lugar de username
        email = attrs.get("username")  # SimpleJWT usa 'username' por defecto
        password = attrs.get("password")

        # Autenticar al usuario con email
        user = authenticate(email=email, password=password)
        if not user:
            raise AuthenticationFailed("No se encontraron credenciales válidas.")

        # Verificar si el usuario está activo
        if not user.is_active:
            raise AuthenticationFailed("Esta cuenta está deshabilitada.")

        # Generar el token
        token = super().validate(attrs)
        token['email'] = user.email
        token['nivel'] = user.nivel
        token['puntos_experiencia'] = user.puntos_experiencia

        return token



# Serializer para la creación y manejo de usuarios
class CustomUserSerializer(serializers.ModelSerializer):
    confirmPassword = serializers.CharField(write_only=True)
    terms = serializers.BooleanField(required=True)

    class Meta:
        model = CustomUser
        fields = ['name', 'last_name', 'email', 'username', 'password', 'confirmPassword', 'terms']
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