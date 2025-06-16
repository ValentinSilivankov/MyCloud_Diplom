from rest_framework.permissions import BasePermission


class IsAdminOrIsSelf(BasePermission):
    def has_object_permission(self, request, view, obj):
        # return request.user.is_staff or request.user.id == obj.id
        return request.user.is_authenticated and (
            request.user.is_staff or request.user.id == obj.id
        )
