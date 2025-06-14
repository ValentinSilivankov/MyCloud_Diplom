from django.urls import path
from knox import views as knox_views
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, SessionLoginView

from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse


@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'csrfToken': request.META['CSRF_COOKIE']})

router = DefaultRouter()
router.register(r'user', UserViewSet)

urlpatterns = [
    path('user/login/', SessionLoginView.as_view(), name='knox_login'),
    path('user/logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('api/auth/csrf/', get_csrf_token, name='get_csrf_token'),
] + router.urls
