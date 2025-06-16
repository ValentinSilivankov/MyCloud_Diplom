from django.urls import path
from files.views import FileViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'files', FileViewSet, basename='file')

urlpatterns = [
    path('file/list/<username>/', FileViewSet.as_view({'get': 'list'})),
    path('file/', FileViewSet.as_view({'post': 'create'})),
    path('file/<int:pk>/', FileViewSet.as_view({'patch': 'partial_update', 'delete': 'destroy'})),
    path('file/download/<int:pk>/', FileViewSet.as_view({'get': 'download'})),
    path('file/link/<int:pk>/', FileViewSet.as_view({'get': 'get_link'})),
    path('file/share/<code>/', FileViewSet.as_view({'get': 'share_file'})),
]

# urlpatterns = [
#     path('files/download/<int:pk>/', FileViewSet.as_view({'get': 'download'}), name='file-download'),
#     path('files/share/<uuid:code>/', FileViewSet.as_view({'get': 'share_file'}), name='file-share'),
# ] + router.urls