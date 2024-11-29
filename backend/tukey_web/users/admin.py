from django.contrib import admin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'ejercicios_completados', 'tasa_exito', 'racha', 'tiempo_total')
    search_fields = ('username', 'email')
    ordering = ('date_joined',)
