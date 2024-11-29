from django.contrib import admin
from .models import EstadisticasGlobales, SistemaPuntos

@admin.register(EstadisticasGlobales)
class EstadisticasGlobalesAdmin(admin.ModelAdmin):
    list_display = ('total_usuarios', 'total_ejercicios_resueltos', 'promedio_tasa_exito')

@admin.register(SistemaPuntos)
class SistemaPuntosAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'puntos_totales', 'puntos_semanales')
    search_fields = ('usuario__username',)
