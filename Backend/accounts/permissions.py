# Phân quyền

from rest_framework import permissions

class IsLibrarian(permissions.BasePermission):
    """
    Chỉ cho phép Thủ thư (Admin) thực hiện các thao tác chỉnh sửa.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.profile.role == 'ADMIN'