# Lấy thông tin đăng nhập hiện lên NavBar

from rest_framework import viewsets, permissions
from .serializers import UserSerializer
from django.contrib.auth.models import User

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [permissions.AllowAny]
    def get_permissions(self):
        # Nếu là hành động 'create' (Đăng ký tài khoản mới)
        if self.action == 'create':
            return [permissions.AllowAny()] # Cho phép tất cả mọi người
        
        # Các hành động khác (xem danh sách, sửa, xóa) vẫn cần đăng nhập
        return [permissions.IsAuthenticated()]