from django.db import models
from users.models import CustomUser
from exercises.models import Ejercicio

class RetoSemanal(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    ejercicios = models.ManyToManyField(Ejercicio, related_name="retos")

    def __str__(self):
        return self.nombre


class UsuarioReto(models.Model):
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="retos_participados")
    reto = models.ForeignKey(RetoSemanal, on_delete=models.CASCADE, related_name="participantes")
    completado = models.BooleanField(default=False)
    fecha_completado = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.usuario.username} - {self.reto.nombre}"
