from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied

__all__ = ['admin_required']

def admin_required(view_func):
    @wraps(view_func)
    def wrapper(view_instance, request, *args, **kwargs):
        if request.user.role != 'admin':
            raise PermissionDenied("You don't have permission to access this resource.")
        return view_func(view_instance, request, *args, **kwargs)
    return wrapper