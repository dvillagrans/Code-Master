from django.urls import path
from .views import SubmitSolutionView

urlpatterns = [
    path('submit/', SubmitSolutionView.as_view(), name='submit_solution'),
]