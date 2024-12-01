from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now

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
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=128, default="")
    terms = models.BooleanField(default=False)  # Consentimiento de términos
    
    # Estadísticas y progresión del usuario
    ejercicios_completados = models.IntegerField(default=0)  # Total de ejercicios completados
    tasa_exito = models.FloatField(default=0.0)  # Porcentaje de éxito
    racha = models.IntegerField(default=0)  # Racha actual
    tiempo_total = models.IntegerField(default=0)  # Tiempo total en minutos
    ejercicios_resueltos_ultimos_siete_dias = models.JSONField(default=list)  # Ejercicios resueltos en la última semana
    nivel = models.CharField(max_length=20, default="Básico")  # Nivel del usuario basado en experiencia
    puntos_experiencia = models.IntegerField(default=0)  # Puntos de experiencia acumulados

    def __str__(self):
        return self.username

    # Métodos para actualizar estadísticas
    def actualizar_estadisticas(self):
        """
        Actualiza las estadísticas del usuario basadas en sus soluciones.
        """
        from solutions.models import Solution
        total_intentos = Solution.objects.filter(user=self).count()
        soluciones_aceptadas = Solution.objects.filter(user=self, status='Accepted').count()

        self.ejercicios_completados = soluciones_aceptadas
        self.tasa_exito = (soluciones_aceptadas / total_intentos) * 100 if total_intentos > 0 else 0.0
        self.save()

    def registrar_ejercicio_resuelto(self, fecha=None):
        """
        Actualiza el historial de ejercicios resueltos en los últimos 7 días.
        """
        if fecha is None:
            fecha = now().date()

        # Agrega el ejercicio resuelto al historial
        ejercicios = self.ejercicios_resueltos_ultimos_siete_dias
        for registro in ejercicios:
            if registro['date'] == fecha.isoformat():
                registro['count'] += 1
                break
        else:
            ejercicios.append({"date": fecha.isoformat(), "count": 1})

        # Filtrar solo los últimos 7 días
        ejercicios = [registro for registro in ejercicios if (now().date() - fecha).days <= 7]
        self.ejercicios_resueltos_ultimos_siete_dias = ejercicios
        self.save()
