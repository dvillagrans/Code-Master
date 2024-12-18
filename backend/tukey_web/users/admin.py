from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'name', 'last_name', 'nivel', 'puntos_experiencia', 'racha')
    list_filter = ('nivel', 'role')
    search_fields = ('username', 'email', 'name', 'last_name')
    ordering = ('-puntos_experiencia',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información Personal', {'fields': ('name', 'last_name', 'email', 'avatar')}),
        ('Estadísticas', {'fields': ('nivel', 'puntos_experiencia', 'racha', 'ejercicios_completados', 'tasa_exito')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'role')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
