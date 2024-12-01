from django.db import models

class EstadisticasGlobales(models.Model):
    # Definición del modelo
    total_usuarios = models.IntegerField(default=0)
    total_soluciones = models.IntegerField(default=0)
    tasa_exito_global = models.FloatField(default=0.0)

    def __str__(self):
        return "Estadísticas Globales"


class SistemaPuntos(models.Model):
    nivel = models.CharField(max_length=50, default="Básico")
    puntos_requeridos = models.IntegerField(default=100)  # Agregado valor predeterminado

    def __str__(self):
        return f"{self.nivel}: {self.puntos_requeridos} puntos"
