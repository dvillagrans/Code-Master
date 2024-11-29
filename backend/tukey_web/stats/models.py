from django.db import models
from users.models import CustomUser

class EstadisticasGlobales(models.Model):
    total_usuarios = models.IntegerField(default=0)
    total_ejercicios_resueltos = models.IntegerField(default=0)
    promedio_tasa_exito = models.FloatField(default=0.0)

    def __str__(self):
        return "Estadísticas Globales"


class SistemaPuntos(models.Model):
    usuario = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="puntos")
    puntos_totales = models.IntegerField(default=0)
    puntos_semanales = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.usuario.username} - {self.puntos_totales} puntos"
