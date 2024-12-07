from django.urls import path
from .views import (
    ProblemListView,
    ProblemDetailView
)

urlpatterns = [
    path('list/', ProblemListView.as_view(), name='list_problems'),
    path('<int:id>/', ProblemDetailView.as_view(), name='detail_problem'),
]
