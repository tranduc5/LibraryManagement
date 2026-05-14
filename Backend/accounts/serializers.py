from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

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