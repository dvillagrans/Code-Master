from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    CustomTokenObtainPairView,
    UserProfileView,
    RegisterView,
    UserViewSet,
)
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

# Configuración del router
router = DefaultRouter()
router.register(r'users', UserViewSet)

# Rutas de la app
urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', RegisterView.as_view(), name='register_user'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
]

# Agregar rutas del router
urlpatterns += router.urls
