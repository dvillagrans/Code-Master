from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Count, Q
from django.utils.timezone import now
from datetime import timedelta


def user_avatar_upload_path(instance, filename):
    """
    Define el directorio donde se guardará el avatar del usuario.
    """
    return f"avatars/user_{instance.id}/{filename}"


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('moderator', 'Moderator'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')

    # Información básica
    name = models.CharField(max_length=50, default="")
    last_name = models.CharField(max_length=50, default="")
    email = models.EmailField(unique=True, default="")
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=128, default="")
    terms = models.BooleanField(default=False)

    # Avatar personalizado
    avatar = models.ImageField(
        upload_to=user_avatar_upload_path,
        null=True,
        blank=True,
        default="avatars/default_avatar.png"
    )

    # Estadísticas del usuario
    ejercicios_completados = models.IntegerField(default=0)  # Ejercicios aceptados
    tasa_exito = models.FloatField(default=0.0)  # Porcentaje de éxito
    last_exercise_date = models.DateField(null=True, blank=True)  # Último ejercicio resuelto
    racha = models.IntegerField(default=0)  # Días consecutivos resolviendo problemas
    tiempo_total = models.IntegerField(default=0)  # Tiempo total en segundos
    ejercicios_resueltos_ultimos_siete_dias = models.JSONField(default=list)  # Historial de los últimos 7 días
    nivel = models.CharField(max_length=20, default="Básico")  # Nivel del usuario
    puntos_experiencia = models.IntegerField(default=0)  # Puntos acumulados
    ranking = models.IntegerField(default=0)  # Ranking global del usuario

    def __str__(self):
        return self.username

    def actualizar_estadisticas(self):
        """
        Actualiza las estadísticas del usuario basadas en sus soluciones.
        """
        from solutions.models import Solution  # Importación local para evitar circularidad

        stats = Solution.objects.filter(user=self).aggregate(
            total_intentos=Count('id'),
            soluciones_aceptadas=Count('id', filter=Q(status='Accepted'))
        )

        self.ejercicios_completados = stats['soluciones_aceptadas'] or 0
        self.tasa_exito = (
            round((stats['soluciones_aceptadas'] / stats['total_intentos']) * 100, 2)
            if stats['total_intentos'] > 0 else 0.0
        )
        self.save()

    def registrar_ejercicio_resuelto(self, fecha=None, tiempo_ejercicio=0):
        if fecha is None:
            fecha = now().date()

        self.tiempo_total += tiempo_ejercicio

        # Busca el registro del día en el historial
        ejercicio_dia = next((registro for registro in self.ejercicios_resueltos_ultimos_siete_dias if registro['date'] == fecha.isoformat()), None)

        if ejercicio_dia:
            # Incrementa el contador si ya existe un registro para ese día
            ejercicio_dia['count'] += 1
        else:
            # Agrega un nuevo registro si no existe
            self.ejercicios_resueltos_ultimos_siete_dias.append({"date": fecha.isoformat(), "count": 1})

        # Mantiene solo los últimos 7 días
        self.ejercicios_resueltos_ultimos_siete_dias = self.ejercicios_resueltos_ultimos_siete_dias[-7:]

        self.last_exercise_date = fecha
        self.save()

        self.calcular_racha()

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

    def _calcular_nivel(self):
        """
        Calcula el nivel del usuario basado en los puntos de experiencia.
        """
        if self.puntos_experiencia < 100:
            return "Básico"
        elif self.puntos_experiencia < 500:
            return "Intermedio"
        else:
            return "Avanzado"
        
        
        
