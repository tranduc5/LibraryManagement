
from django.contrib import admin
from django.urls import path , include
# import thư viện ảnh 
from django.conf import settings
from django.conf.urls.static import static

# 1. Import các view của JWT
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # kết nối cac app vào books
    path('api/books/' , include('books.urls')) , 
    # kết nối các url từ app accounts
    path('api/users/' , include('accounts.urls')),
    #  Kết nối app transactions
    path('api/transactions/', include('transactions.urls')),

    # 2. KHAI BÁO ĐƯỜNG DẪN NÀY (Đây là chỗ React đang gọi đến)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),   
]

# Cho phép truy cập file ảnh trong quá trình phát triển (Development)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
