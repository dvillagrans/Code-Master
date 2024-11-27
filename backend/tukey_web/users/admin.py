from django.contrib import admin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'is_google_user', 'is_active', 'date_joined')
    list_filter = ('is_google_user', 'is_active')
    search_fields = ('username', 'email')
