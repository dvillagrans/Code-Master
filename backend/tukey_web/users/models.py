from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('moderator', 'Moderator'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    
    name = models.CharField(max_length=50, default="")
    last_name = models.CharField(max_length=50, default="")
    email = models.EmailField(unique=True, default="")
    password = models.CharField(max_length=128, default="")
    terms = models.BooleanField(default=False)  # Consentimiento de términos
    ejercicios_completados = models.IntegerField(default=0)  # Total de ejercicios completados
    tasa_exito = models.FloatField(default=0.0)  # Porcentaje de éxito
    racha = models.IntegerField(default=0)  # Racha actual
    tiempo_total = models.IntegerField(default=0)  # Tiempo total en minutos
    ejercicios_resueltos_ultimos_siete_dias = models.JSONField(default=list)  # Ejercicios resueltos en la última semana
    nivel = models.CharField(max_length=20, default="Básico")  # Nivel del usuario basado en experiencia
    puntos_experiencia = models.IntegerField(default=0)  # Puntos de experiencia acumulados

    def __str__(self):
        return self.username