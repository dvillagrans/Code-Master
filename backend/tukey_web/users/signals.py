from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from .models import CustomUser
from django.core.files.storage import default_storage
import os

@receiver(post_save, sender=CustomUser)
def update_user_ranking(sender, instance, created, **kwargs):
    """
    Actualiza el ranking de todos los usuarios cuando se crea o modifica un usuario
    """
    if not created and not instance._state.adding:
        # Actualizar el ranking solo si el usuario ya existe y no está siendo creado
        instance.actualizar_ranking()

@receiver(pre_delete, sender=CustomUser)
def delete_user_avatar(sender, instance, **kwargs):
    """
    Elimina el avatar del usuario cuando se elimina el usuario
    """
    if instance.avatar and instance.avatar.name != 'avatars/default_avatar.png':
        if default_storage.exists(instance.avatar.name):
            default_storage.delete(instance.avatar.name)
