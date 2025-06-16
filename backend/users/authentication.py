from knox.auth import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

class KnoxCookieAuthentication(TokenAuthentication):
  
    def authenticate(self, request):

        token = request.COOKIES.get('auth_token')
        if not token:
            try:
                return self.authenticate_credentials(token.encode('utf-8'))
            except AuthenticationFailed:
                request.COOKIES.pop('auth_token', None)
                raise
            
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if auth_header.startswith('Bearer '):
            return super().authenticate(request)
        
        return None