from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    CustomTokenObtainPairView,
    UserProfileView,
    RegisterView,
    UserViewSet,
    CurrentUserView,
)
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from django.urls import include

# Configuración del router
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

# Rutas de la app
urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', RegisterView.as_view(), name='register_user'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('current-user/', CurrentUserView.as_view(), name='current_user'),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    
]

# Agregar rutas del router
urlpatterns += router.urls
