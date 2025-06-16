from django.middleware.csrf import CsrfViewMiddleware
from django.http import JsonResponse
from knox.auth import TokenAuthentication

class CustomCsrfMiddleware(CsrfViewMiddleware):
    def process_view(self, request, callback, callback_args, callback_kwargs):
        if request.path.startswith('/api/'):
            return self._accept(request)
        return super().process_view(request, callback, callback_args, callback_kwargs)
    
    def _accept(self, request):
        request.csrf_processing_done = True
        return None
    
class KnoxAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        if request.path.startswith('/api/'):
            auth = TokenAuthentication()
            try:
                user_auth_tuple = auth.authenticate(request)
                if user_auth_tuple:
                    request.user, _ = user_auth_tuple
            except Exception:
                return JsonResponse(
                    {'detail': 'Invalid token'}, 
                    status=401
                )
        return self.get_response(request)