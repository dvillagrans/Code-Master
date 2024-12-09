from django.urls import re_path
from solutions.consumers import SolutionConsumer

# Agrega las rutas de WebSocket de todas las aplicaciones aquí
websocket_urlpatterns = [
    re_path(r'ws/solutions/(?P<solution_id>\d+)/$', SolutionConsumer.as_asgi()),

]