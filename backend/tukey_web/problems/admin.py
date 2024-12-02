# problems/admin.py
from django.contrib import admin
from .models import Problem

@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'difficulty', 'created_at')
    prepopulated_fields = {'slug': ('title',)}
