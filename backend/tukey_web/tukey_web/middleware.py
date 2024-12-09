from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope['query_string'].decode()
        params = dict(x.split('=') for x in query_string.split('&') if '=' in x)
        token = params.get('token', None)

        if token:
            try:
                access_token = AccessToken(token)
                scope['user'] = access_token['user_id']
            except Exception:
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)
