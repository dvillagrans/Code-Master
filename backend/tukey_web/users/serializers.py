from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'name', 'last_name', 'terms',
                 'ejercicios_completados', 'tasa_exito', 'racha', 'tiempo_total',
                 'ejercicios_resueltos_ultimos_siete_dias', 'nivel', 'puntos_experiencia')
        extra_kwargs = {
            'email': {'required': True}
        }
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)


    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class CustomUserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True)  # Campo para confirmar contraseña

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'name', 'last_name', 'terms',
                  'ejercicios_completados', 'tasa_exito', 'racha', 'tiempo_total',
                  'ejercicios_resueltos_ultimos_siete_dias', 'nivel', 'puntos_experiencia',
                  'password', 'password2')  # Incluye password y password2
        extra_kwargs = {
            'password': {'write_only': True},  # Password no se muestra en las respuestas
            'email': {'required': True}       # Email obligatorio
        }

    def validate(self, attrs):
        # Valida que las contraseñas coincidan
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})

        # Valida la fortaleza de la contraseña usando las reglas de Django
        validate_password(attrs['password'])

        return attrs

    def create(self, validated_data):
        # Remueve password2 antes de crear el usuario
        validated_data.pop('password2')

        # Crea un usuario con el método create_user (gestiona correctamente la contraseña)
        user = CustomUser.objects.create_user(**validated_data)
        return user