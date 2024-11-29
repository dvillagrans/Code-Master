from django.contrib import admin
from .models import Categoria, Ejercicio, UsuarioEjercicio

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
    search_fields = ('nombre',)

@admin.register(Ejercicio)
class EjercicioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'dificultad', 'categoria', 'tiempo_estimado')
    search_fields = ('nombre', 'categoria__nombre')
    list_filter = ('dificultad', 'categoria')

@admin.register(UsuarioEjercicio)
class UsuarioEjercicioAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'ejercicio', 'fecha_completado', 'intentos', 'tasa_exito')
    search_fields = ('usuario__username', 'ejercicio__nombre')
    list_filter = ('fecha_completado',)
