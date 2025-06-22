from knox.auth import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

class KnoxCookieAuthentication(TokenAuthentication):
    def authenticate(self, request):
        # Получаем токен из куки
        token = request.COOKIES.get('auth_token')

        # Если токена нет в куках — пробуем через заголовок Authorization
        if not token:
            return super().authenticate(request)

        try:
            # Пытаемся аутентифицировать через куки
            user, auth_tuple = self.authenticate_credentials(token.encode('utf-8'))
            return (user, auth_tuple)
        except AuthenticationFailed:
            # Удаляем битый токен из куки (если нужно)
            request.COOKIES.pop('auth_token', None)
            raise