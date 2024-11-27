from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    # Campos personalizados
    first_name = models.CharField(max_length=30)  # AbstractUser ya incluye esto, pero lo podemos sobrescribir si es necesario.
    last_name = models.CharField(max_length=30)   # AbstractUser ya incluye esto también.
    is_google_user = models.BooleanField(default=False)  # Indica si el usuario se registró con Google.
    date_joined = models.DateTimeField(auto_now_add=True)  # Fecha automática de registro.

    # Retorna el email como representación del usuario.
    def __str__(self):
        return self.email
