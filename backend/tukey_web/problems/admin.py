# problems/admin.py
from django.contrib import admin
from .models import Problem, Example

@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'difficulty', 'created_at')
    prepopulated_fields = {'slug': ('title',)}
    
@admin.register(Example)
class ExampleAdmin(admin.ModelAdmin):
    list_display = ('problem', 'input_data', 'output_data')