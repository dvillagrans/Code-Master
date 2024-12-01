from django.contrib import admin
from .models import EstadisticasGlobales, SistemaPuntos

@admin.register(EstadisticasGlobales)
class EstadisticasGlobalesAdmin(admin.ModelAdmin):
    list_display = ('total_usuarios', 'total_soluciones', 'tasa_exito_global')


@admin.register(SistemaPuntos)
class SistemaPuntosAdmin(admin.ModelAdmin):
    list_display = ('nivel', 'puntos_requeridos')
