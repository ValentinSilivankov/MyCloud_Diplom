import uuid
from django.http import FileResponse, HttpResponseForbidden
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from files.models import File
from files.permissions import IsAdminOrIsOwner
from files.serializers import FileSerializer
from users.models import User
from rest_framework.decorators import action


@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_file(request):
    
    serializer = FileSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FileViewSet(viewsets.ModelViewSet):
    lookup_field = 'pk'
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated, IsAdminOrIsOwner]

    def get_permissions(self):
        # if self.action in ['partial_update', 'destroy', 'download', 'link']:
        #     return [IsAuthenticated(), IsAdminOrIsOwner()]
        # if self.action in ['list', 'create']:
        #     return [IsAuthenticated()]
        # return [AllowAny()]
        if self.action in ['update', 'partial_update', 'destroy', 'download']:
            return [IsAuthenticated(), IsAdminOrIsOwner()]
        return super().get_permissions()

    # def list(self, request, username, *args, **kwargs):
    #     if request.user.is_staff:
    #         user = get_object_or_404(User, username=username)
    #         user_files = user.files
    #     else:
    #         user_files = request.user.files

    #     serializer = self.serializer_class(user_files, many=True)
    #     return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # def partial_update(self, request, pk=None, *args, **kwargs):
    #     file = get_object_or_404(self.queryset, pk=pk)
    #     self.check_object_permissions(request, file)
    #     serializer = self.serializer_class(file, data=request.data, partial=True)
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()
    #     return Response(serializer.data, status=status.HTTP_200_OK)

    # def destroy(self, request, pk=None, *args, **kwargs):
    #     file = get_object_or_404(self.queryset, pk=pk)
    #     self.check_object_permissions(request, file)
    #     file.delete()
    #     return Response(
    #         {'message': 'Файл успешно удалён'},
    #         status=status.HTTP_204_NO_CONTENT
    #     )

    

    # def get_link(self, request, pk=None):
    #     file = get_object_or_404(self.queryset, pk=pk)
    #     self.check_object_permissions(request, file)
    #     link = file.special_link
    #     if not link:
    #         code = uuid4().hex
    #         link = request.build_absolute_uri(f'/api/file/share/{code}')
    #         file.special_link = link
    #         file.save()
    #     return Response({'special_link': link}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='share/(?P<pk>[^/.]+)')
    def share_file(self, request, pk=None):
        try:
            file = File.objects.get(special_link__contains=pk)
            # file = self.get_object()
            file.downloaded = timezone.now()
            file.save()
            # return self.download(request, file.id)
            return FileResponse(file.file.open('rb'), as_attachment=True, filename=file.file_name)
        
        except File.DoesNotExist:
            return Response(
                {'error': 'Файл не найден или ссылка недействительна'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['get'])
    def get_link(self, request, pk=None):
        file = self.get_object()
        self.check_object_permissions(request, file)

        if not file.special_link:
            code = uuid.uuid4()
            file.special_link = f"{request.build_absolute_uri('/')}api/files/share/{code}/"
            file.save()
        return Response({
            'link': file.special_link,
            'id': file.id
            })

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        # file = get_object_or_404(self.queryset, pk=pk)
        # self.check_object_permissions(request, file)
        # file.downloaded = timezone.now()
        # file.save()
        # return FileResponse(open(file.file.path, 'rb'), as_attachment=True)
        file = self.get_object()
        file.downloaded = timezone.now()
        file.save()
        # response = FileResponse(file.file.open('rb'), as_attachment=True)
        # response['Content-Disposition'] = f'attachment; filename="{file.file_name}"'
        # return response
        return FileResponse(file.file.open('rb'), as_attachment=True, filename=file.file_name)

