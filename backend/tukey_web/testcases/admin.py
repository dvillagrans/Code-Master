from django.contrib import admin
from .models import TestCase

@admin.register(TestCase)
class TestCaseAdmin(admin.ModelAdmin):
    list_display = ('problem', 'input', 'expected_output', 'visibility')
    search_fields = ('problem__title', 'input', 'expected_output')