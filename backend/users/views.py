from django.contrib.auth import login, logout
from django.middleware.csrf import get_token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from knox.views import LoginView as KnoxLoginView
from rest_framework.authtoken.serializers import AuthTokenSerializer
from .models import User
from .permissions import IsAdminOrIsSelf
from .serializers import (
    AdminSerializer,
    UserSerializer,
    LoginSerializer,
    UserSessionSerializer
)
from rest_framework.decorators import action
from rest_framework.response import Response

from django.contrib.auth import authenticate, login


class CSRFTokenView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response({'csrfToken': get_token(request)})


class SessionLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        login(request, user)
        
        return Response({
            'status': 'success',
            'user': UserSessionSerializer(user).data,
            'csrfToken': get_token(request)
        }, status=status.HTTP_200_OK)
    

class SessionLogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({'status': 'success'})


class SessionCheckView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            'isAuthenticated': True,
            'user': UserSessionSerializer(request.user).data
        })


class KnoxLoginView(KnoxLoginView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super().post(request, format=None)
    
class SessionAPIView(APIView):
    def get(self, request):
        
        if request.user.is_authenticated:
            return Response({
                'isAuthenticated': True,
                'username': request.user.username,
                'email': request.user.email,
                'csrfToken': get_token(request)
            })
        return Response({
            'isAuthenticated': False,
            'csrfToken': get_token(request)
        })


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return Response({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_staff': user.is_staff
                }
            }, status=status.HTTP_200_OK)
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['list', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()]
        elif self.action in ['retrieve', 'partial_update', 'update']:
            return [IsAuthenticated(), IsAdminOrIsSelf()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.action in ['list']:
            return AdminSerializer
        return UserSerializer
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
