from django.urls import path
from .views import (
    SubmitSolutionView, 
    RecentSolutionsView,
    SolutionDetailView,
)

urlpatterns = [
    path('submit/', SubmitSolutionView.as_view(), name='submit_solution'),
    path('recent/', RecentSolutionsView.as_view(), name='recent-solutions'),
    path('<int:solution_id>/', SolutionDetailView.as_view(), name='solution_detail'),  # Nuevo endpoint
    
]
