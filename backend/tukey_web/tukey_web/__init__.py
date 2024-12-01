from __future__ import absolute_import, unicode_literals

# Esto hará que Celery se cargue al importar el proyecto
from .celery import app as celery_app

__all__ = ('celery_app',)
