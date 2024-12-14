from functools import wraps
from rest_framework.response import Response
from rest_framework import status

__all__ = ['admin_required']

def admin_required(view_func):
    @wraps(view_func)
    def _wrapped_view(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response(
                {"error": "Admin privileges required"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return view_func(self, request, *args, **kwargs)
    return _wrapped_view