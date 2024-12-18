from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Count, Q
from django.utils.timezone import now
from datetime import timedelta
import json
from datetime import datetime

def user_avatar_upload_path(instance, filename):
    """
    Define el directorio donde se guardará el avatar del usuario.
    """
    return f"avatars/user_{instance.id}/{filename}"


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    firebase_uid = models.CharField(max_length=128, unique=True, null=True, blank=True)

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
    ejercicios_resueltos_ultimos_siete_dias = models.JSONField(default=dict)  # Cambiar default=list a default=dict
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
        
        # Actualizar nivel y ranking
        self.nivel = self._calcular_nivel()
        self.actualizar_ranking()
        
        # Actualizar racha diaria
        self.actualizar_racha()
        
        # Registrar ejercicio resuelto con la fecha actual
        fecha_actual = now().date()
        self.registrar_ejercicio_resuelto(fecha=fecha_actual)
        
        self.save()

    def registrar_ejercicio_resuelto(self, fecha=None, tiempo_ejercicio=0):
        if fecha is None:
            fecha = now().date()

        # Asegurar que tenemos un diccionario válido
        if not isinstance(self.ejercicios_resueltos_ultimos_siete_dias, dict):
            self.ejercicios_resueltos_ultimos_siete_dias = {}

        # Validar tiempo
        tiempo_ejercicio = max(0, tiempo_ejercicio)
        self.tiempo_total += tiempo_ejercicio

        # Convertir fecha a string en formato ISO
        fecha_str = fecha.isoformat()
        
        # Limpiar registros antiguos
        fecha_limite = fecha - timedelta(days=7)
        ejercicios_actualizados = {}
        
        # Filtrar y mantener solo los últimos 7 días
        for fecha_registro, conteo in self.ejercicios_resueltos_ultimos_siete_dias.items():
            try:
                fecha_registro_date = datetime.fromisoformat(fecha_registro).date()
                if fecha_registro_date > fecha_limite:
                    ejercicios_actualizados[fecha_registro] = conteo
            except ValueError:
                continue  # Ignorar fechas inválidas

        # Actualizar el registro del día actual
        if fecha_str in ejercicios_actualizados:
            ejercicios_actualizados[fecha_str] += 1
        else:
            ejercicios_actualizados[fecha_str] = 1

        self.ejercicios_resueltos_ultimos_siete_dias = ejercicios_actualizados
        self.last_exercise_date = fecha
        self.save()

    def actualizar_racha(self):
        """
        Actualiza la racha diaria del usuario.
        - Si se completa un ejercicio hoy y fue consecutivo al día anterior o del mismo día, mantiene/aumenta la racha.
        - Si no fue consecutivo, la racha se reinicia.
        """
        today = now().date()

        if self.last_exercise_date:
            dias_diferencia = (today - self.last_exercise_date).days
            
            if dias_diferencia == 0:  # Mismo día
                pass  # Mantener la racha actual
            elif dias_diferencia == 1:  # Día consecutivo
                self.racha += 1
            else:  # Más de un día de diferencia
                self.racha = 1
        else:
            # Primera vez que resuelve un ejercicio
            self.racha = 1

        self.last_exercise_date = today
        self.save()
    
    def otorgar_experiencia(self, dificultad, execution_time=None, peak_memory=None):
        """
        Otorga puntos de experiencia al usuario y actualiza su nivel.
        """
        experiencia_por_dificultad = {
            'Easy': 10,
            'Medium': 20,
            'Hard': 30
        }
    
        puntos = experiencia_por_dificultad.get(dificultad, 0)
    
        # Bonus por tiempo rápido y bajo uso de memoria
        if execution_time and execution_time < 1.0:
            puntos += 5
        if peak_memory and peak_memory < 10.0:
            puntos += 5
    
        self.puntos_experiencia += puntos
        # Actualizar el nivel después de añadir puntos
        self.nivel = self._calcular_nivel()
        self.save()
    
        return puntos

    def _calcular_nivel(self):
        """
        Calcula el nivel del usuario basado en los puntos de experiencia.
        Los rangos son:
        - Básico: 0-99 puntos
        - Intermedio: 100-499 puntos
        - Avanzado: 500-999 puntos
        - Experto: 1000-1999 puntos
        - Maestro: 2000+ puntos
        """
        if self.puntos_experiencia < 100:
            return "Básico"
        elif self.puntos_experiencia < 500:
            return "Intermedio"
        elif self.puntos_experiencia < 1000:
            return "Avanzado"
        elif self.puntos_experiencia < 2000:
            return "Experto"
        else:
            return "Maestro"

    def actualizar_ranking(self):
        """
        Actualiza el ranking del usuario basado en sus puntos de experiencia.
        """
        ranking = CustomUser.objects.filter(
            puntos_experiencia__gt=self.puntos_experiencia
        ).count() + 1
        # Actualizar directamente el ranking en la base de datos
        CustomUser.objects.filter(pk=self.pk).update(ranking=ranking)


    def get_ejercicios_ultimos_dias(self):
        """
        Retorna los ejercicios de los últimos 7 días en formato lista para la gráfica
        """
        today = now().date()
        resultado = []
        
        # Crear diccionario con los últimos 7 días
        for i in range(7):
            fecha = today - timedelta(days=i)
            fecha_str = fecha.isoformat()
            resultado.append({
                "date": fecha_str,
                "count": self.ejercicios_resueltos_ultimos_siete_dias.get(fecha_str, 0)
            })
            
        
        return sorted(resultado, key=lambda x: x['date'])
