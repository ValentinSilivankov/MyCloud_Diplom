from django.conf import settings
from django.contrib.auth import login,logout
from django.http import HttpResponse
from knox.views import LoginView 
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.viewsets import ModelViewSet
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import User
from .permissions import IsAdminOrIsSelf
from .serializers import AdminSerializer, UserSerializer, LoginSerializer
from knox.models import AuthToken
from rest_framework.decorators import api_view, permission_classes
from django.middleware.csrf import get_token
from django.utils import timezone
from datetime import timedelta
from rest_framework import status

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth(request):
    user = request.user
    return Response({
        'user': UserSerializer(user).data,
        'is_authenticated': True
        })

class LoginView(generics.GenericAPIView):
    # permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        # serializer = AuthTokenSerializer(data=request.data)
        # serializer.is_valid(raise_exception=True)
        # user = serializer.validated_data['user']
        # login(request, user)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)

        _, token = AuthToken.objects.create(user)

        response = Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
        })

        response.set_cookie(
            'auth_token',
            token,
            httponly=True,
            samesite='Lax',
            max_age=5*60*60,
            path='/',
        )

        response.set_cookie(
            key='csrftoken',
            value=get_token(request),
            samesite='Lax',
            max_age=60*60*5,
            path='/',
        )

        # return super(LoginView, self).post(request, format=None)
        return response
    

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        # if self.action in ['list', 'destroy']:
        #     return [IsAuthenticated(), IsAdminUser()]
        # elif self.action in ['retrieve', 'partial_update', 'update']:
        #     return [IsAuthenticated(), IsAdminOrIsSelf()]
        # return [AllowAny()]
        if self.action == 'create':
            return [permissions.AllowAny()]
        if self.action in ['list', 'destroy']:
            return [permissions.IsAdminUser()]
        elif self.action in ['retrieve', 'update', 'partial_update']:
            return [IsAdminOrIsSelf()]
        return super().get_permissions()

    def get_serializer_class(self):
        # if self.action in ['list']:
        if self.action == 'list' and self.request.user.is_staff:
            return AdminSerializer
        return UserSerializer


class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    # permission_classes = [AllowAny]

    def post(self, request):
        try:
            # Получаем токен из куки
            auth_token = request.COOKIES.get(settings.REST_KNOX['COOKIE_NAME'])
            
            # Удаляем токен из базы данных
            if auth_token:
                AuthToken.objects.filter(
                    token_key=auth_token[:8]  # Knox хранит только первые 8 символов
                ).delete()
            
            # Создаем ответ
            response = Response(
                {'detail': 'Successfully logged out.'},
                status=status.HTTP_200_OK
            )
            
            # Очищаем куки
            response.delete_cookie(
                settings.REST_KNOX['COOKIE_NAME'],
                path='/',
                domain=None,
                samesite='Lax'
            )
            response.delete_cookie(
                'csrftoken',
                path='/',
                domain=None,
                samesite='Lax'
            )
            
            # Выход из системы
            logout(request)
            
            return response
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )