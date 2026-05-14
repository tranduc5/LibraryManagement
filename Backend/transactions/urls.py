from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BorrowTransactionViewSet

# Sử dụng Router để tự động tạo các đường dẫn mượn/trả
router = DefaultRouter()
router.register(r'', BorrowTransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),
]