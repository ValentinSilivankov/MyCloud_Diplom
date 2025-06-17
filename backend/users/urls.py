from django.urls import path, include
from knox import views as knox_views
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, LoginView

router = DefaultRouter()
router.register(r'user', UserViewSet)

urlpatterns = [
    path('user/login/', LoginView.as_view(), name='knox_login'),
    path('user/logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('user/logoutall/', knox_views.LogoutAllView.as_view(), name='knox-logoutall'),

    path('',include(router.urls)),
# ]

] + router.urls