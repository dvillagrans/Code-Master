from django.contrib import admin
from .models import Solution

@admin.register(Solution)
class SolutionAdmin(admin.ModelAdmin):
    list_display = ('user', 'problem', 'language', 'created_at')
    search_fields = ('user__username', 'problem__title', 'language')
