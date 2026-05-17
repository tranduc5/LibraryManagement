from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    # 1. ĐƯA CÁC ĐƯỜNG DẪN CỤ THỂ LÊN TRÊN ĐẦU
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # 2. ĐẨY THẰNG CHUỖI RỖNG CỦA ROUTER XUỐNG DƯỚI CÙNG
    path('', include(router.urls)),
]