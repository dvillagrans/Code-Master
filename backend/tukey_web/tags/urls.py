# tags/urls.py
from django.urls import path
from .views import list_categories_with_tags

urlpatterns = [
    path('list/', list_categories_with_tags, name='list_categories_with_tags'),
]
