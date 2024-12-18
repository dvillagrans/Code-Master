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

        # Agregar claims personalizados al token
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role  # Asegúrate de que tu modelo tenga este campo
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Agregar datos adicionales a la respuesta
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['role'] = self.user.role
        return data

# Serializer para la creación y manejo de usuarios
class CustomUserSerializer(serializers.ModelSerializer):
    confirmPassword = serializers.CharField(write_only=True)  # Cambiado de confirm_password a confirmPassword
    terms = serializers.BooleanField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'confirmPassword', 'name', 'last_name', 'terms')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        print("Validating data:", data)  # Debug log
        
        password = data.get('password')
        confirmPassword = data.get('confirmPassword')  # Cambiado aquí también

        if not password:
            raise serializers.ValidationError({'password': 'Password is required'})
        
        if not confirmPassword:  # Y aquí
            raise serializers.ValidationError({'confirmPassword': 'Please confirm your password'})

        if password != confirmPassword:  # Y aquí
            raise serializers.ValidationError({'confirmPassword': 'Passwords do not match'})

        if not data.get('terms', False):
            raise serializers.ValidationError({'terms': 'Debe aceptar los términos y condiciones'})

        return data

    def create(self, validated_data):
        print("Creating user with data:", validated_data)  # Debug log
        
        # Remover campos adicionales
        confirmPassword = validated_data.pop('confirmPassword', None)  # Cambiado aquí
        terms = validated_data.pop('terms', None)
        
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            last_name=validated_data.get('last_name', ''),
            terms=terms
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