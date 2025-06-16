from django.contrib.auth import login
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth(request):
    return Response({
        'authenticated': request.user.is_authenticated,
        'user': UserSerializer(request.user).data
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
            key='auth_token',
            value=token,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax',
            max_age=5*60*60,
            path='/',
            domain=None
        )

        response.set_cookie(
            key='csrftoken',
            value=request.META.get('CSRF_COOKIE', ''),
            secure=not settings.DEBUG,
            samesite='Lax',
            max_age=60*60*5,
            path='/',
            domain=None
        )

        # return super(LoginView, self).post(request, format=None)
        return response
    

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        # if self.action in ['list', 'destroy']:
        #     return [IsAuthenticated(), IsAdminUser()]
        # elif self.action in ['retrieve', 'partial_update', 'update']:
        #     return [IsAuthenticated(), IsAdminOrIsSelf()]
        # return [AllowAny()]
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


