from django.db import models
from users.models import CustomUser

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre


class Ejercicio(models.Model):
    DIFICULTAD_CHOICES = [
        ('Básico', 'Básico'),
        ('Intermedio', 'Intermedio'),
        ('Avanzado', 'Avanzado'),
        ('Experto', 'Experto'),
    ]

    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    dificultad = models.CharField(max_length=20, choices=DIFICULTAD_CHOICES)
    tiempo_estimado = models.DurationField()
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name="ejercicios")

    def __str__(self):
        return self.nombre


class UsuarioEjercicio(models.Model):
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="ejercicios_resueltos")
    ejercicio = models.ForeignKey(Ejercicio, on_delete=models.CASCADE, related_name="resoluciones")
    fecha_completado = models.DateTimeField(auto_now_add=True)
    intentos = models.IntegerField(default=0)
    tasa_exito = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.usuario.username} - {self.ejercicio.nombre}"
