from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserAnalytics
from .serializers import UserAnalyticsSerializer

# Obtener estadísticas del usuario
class UserAnalyticsView(APIView):
    def get(self, request, user_id):
        try:
            analytics = UserAnalytics.objects.get(user_id=user_id)
            serializer = UserAnalyticsSerializer(analytics)
            return Response(serializer.data)
        except UserAnalytics.DoesNotExist:
            return Response({"error": "Analytics not found"}, status=status.HTTP_404_NOT_FOUND)
