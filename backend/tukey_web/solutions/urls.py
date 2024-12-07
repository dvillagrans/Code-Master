from django.urls import path
from .views import (
    SubmitSolutionView, 
    RecentSolutionsView
)

urlpatterns = [
    path('submit/', SubmitSolutionView.as_view(), name='submit_solution'),
    path('recent/', RecentSolutionsView.as_view(), name='recent-solutions'),
]
