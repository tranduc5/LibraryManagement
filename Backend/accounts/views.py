from rest_framework import viewsets, permissions
from .serializers import UserSerializer, CustomTokenObtainPairSerializer # Import thêm class custom mới
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView # Import view gốc của JWT

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        # Lấy tất cả người dùng nhưng loại trừ những tài khoản có is_staff=True hoặc username='admin'
        return User.objects.exclude(is_staff=True).exclude(username='admin')
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

# View xử lý đăng nhập tùy biến
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]