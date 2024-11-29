from django.contrib import admin
from .models import RetoSemanal, UsuarioReto

@admin.register(RetoSemanal)
class RetoSemanalAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'fecha_inicio', 'fecha_fin')
    search_fields = ('nombre',)
    list_filter = ('fecha_inicio', 'fecha_fin')

@admin.register(UsuarioReto)
class UsuarioRetoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'reto', 'completado', 'fecha_completado')
    search_fields = ('usuario__username', 'reto__nombre')
    list_filter = ('completado', 'fecha_completado')
