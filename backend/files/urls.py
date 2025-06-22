from django.urls import path
from files.views import FileViewSet, upload_file
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'files', FileViewSet, basename='file')

urlpatterns = [
    path('files/list/<username>/', FileViewSet.as_view({'get': 'list'})),
    path('files/', FileViewSet.as_view({'post': 'create'}),name='file-upload'),
    path('files/<int:pk>/', FileViewSet.as_view({
        'get': 'retrieve',
        'patch': 'partial_update', 
        'delete': 'destroy'
        }),name='file-detail'),
    path('files/download/<int:pk>/', FileViewSet.as_view({'get': 'download'}),name='file-download'),
    path('files/link/<int:pk>/', FileViewSet.as_view({'get': 'get_link'}), name='file_link'),
    path('files/share/<uuid:pk>/', FileViewSet.as_view({'get': 'share_file'}), name='file-share'),
    # path('', upload_file, name='file-upload'),
]

# urlpatterns = [
#     path('files/download/<int:pk>/', FileViewSet.as_view({'get': 'download'}), name='file-download'),
#     path('files/share/<uuid:code>/', FileViewSet.as_view({'get': 'share_file'}), name='file-share'),
# ] + router.urls