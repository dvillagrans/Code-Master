from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now
import json
from datetime import timedelta

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
    last_exercise_date = models.DateField(null=True, blank=True)  # Última fecha en que completó un ejercicio
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
        
    def actualizar_racha(self):
        """
        Actualiza la racha diaria del usuario.
        Si se completa un ejercicio hoy y fue consecutivo al día anterior, aumenta la racha.
        Si no fue consecutivo, la racha se reinicia.
        """
        today = now().date()

        if self.last_exercise_date:
            # Si ya hay una fecha previa, verificar si es consecutiva
            if self.last_exercise_date == today - timedelta(days=1):
                self.racha += 1  # Día consecutivo, aumentar la racha
            elif self.last_exercise_date < today - timedelta(days=1):
                self.racha = 1  # No consecutivo, reiniciar la racha
        else:
            # Si no hay una fecha previa, iniciar la racha
            self.racha = 1

        # Actualizar la última fecha de ejercicio
        self.last_exercise_date = today
        self.save()

    def otorgar_experiencia(self, dificultad, execution_time=None, peak_memory=None):
        """
        Otorga puntos de experiencia al usuario basados en la dificultad del ejercicio,
        tiempo de ejecución y memoria usada.
        """
        experiencia_por_dificultad = {
            'Easy': 10,
            'Medium': 20,
            'Hard': 30
        }
    
        puntos = experiencia_por_dificultad.get(dificultad, 0)
    
        # Bonus por tiempo rápido y bajo uso de memoria
        if execution_time and execution_time < 1.0:  # Menos de 1 segundo
            puntos += 5
        if peak_memory and peak_memory < 10.0:  # Menos de 10 MB
            puntos += 5
    
        self.puntos_experiencia += puntos
        self.save()
    
        return puntos
