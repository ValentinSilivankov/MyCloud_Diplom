from django.middleware.csrf import CsrfViewMiddleware
from django.http import JsonResponse
from knox.auth import TokenAuthentication
from rest_framework.permissions import AllowAny
from django.utils.deprecation import MiddlewareMixin

class CustomCsrfMiddleware(CsrfViewMiddleware):
    def process_view(self, request, callback, callback_args, callback_kwargs):
        # Пропускаем CSRF проверку для:
        # 1. API запросов с токеном
        # 2. Эндпоинтов с AllowAny
        if (request.path.startswith('/api/') and 
            ('auth_token' in request.COOKIES or
             getattr(callback, 'permission_classes', None) == [AllowAny])):
            return self._accept(request)
        return super().process_view(request, callback, callback_args, callback_kwargs)

class KnoxAuthMiddleware(MiddlewareMixin):
    def __init__(self, get_response):
        self.get_response = get_response
        self.auth = TokenAuthentication()
        
    def __call__(self, request):

        if request.path == '/api/user/logout/':
            return self.get_response(request)
        
        is_api_path = request.path.startswith('/api/')
        is_allowed = getattr(request.resolver_match, 'permission_classes', None) == [AllowAny]
        
        if not is_api_path or is_allowed:
            return self.get_response(request)
            
        try:
            # Пробуем аутентифицировать через куки или заголовок
            auth_result = self.auth.authenticate(request)
            if auth_result is not None:
                request.user, request.auth = auth_result
        except Exception as e:
            # Не прерываем запрос при ошибке аутентификации
            # DRF сам вернет 401 если потребуется
            pass
            
        return self.get_response(request)