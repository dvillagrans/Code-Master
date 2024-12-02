from django.contrib import admin
from .models import Category, Tag

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name']

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'description', 'created_at']
    search_fields = ['name']
    list_filter = ['category']
