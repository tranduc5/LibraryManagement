from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Sử dụng Router để tự động tạo ra các đường dẫn chuẩn RESTful
router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    # Đường dẫn cho UserViewSet: api/users/
    path('', include(router.urls)),
    
    # API Đăng nhập để lấy Token (JWT)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]