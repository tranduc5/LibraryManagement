from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer 

# 1. Serializer cho Profile (Phải định nghĩa TRƯỚC để lồng vào User)
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone', 'address', 'avatar', 'role']

# 2. Serializer chính cho User
class UserSerializer(serializers.ModelSerializer):
    # Lồng thông tin profile vào đây
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile', 'is_staff', 'password']
        # Mật khẩu chỉ dùng để ghi (lúc đăng ký), không hiện ra lúc xem danh sách
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Mặc định mật khẩu sẽ được băm (hash) để bảo mật
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)    # Xử lí băm mật khẩu 
        user.save()
        # Lưu ý: Profile sẽ được tạo tự động nhờ signals.py chúng ta đã viết
        return user
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Lấy dữ liệu cặp token access và refresh gốc
        data = super().validate(attrs)
        
        # self.user đại diện cho tài khoản đang thực hiện đăng nhập thành công
        data['username'] = self.user.username
        data['is_staff'] = self.user.is_staff  # Trả về True/False cho React nhận diện quyền
        
        # Nếu Đức muốn trả thêm cả trường 'role' (admin/student) từ UserProfile sang React:
        if hasattr(self.user, 'profile') and self.user.profile:
            data['role'] = self.user.profile.role
            
        return data