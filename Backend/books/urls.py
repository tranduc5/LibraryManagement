from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, CategoryViewSet, DashboardStatsView

router = DefaultRouter()
# Ép thằng 'categories' lên đầu để Django ưu tiên nhận diện trước
router.register(r'categories', CategoryViewSet, basename='category')
# Đẩy thằng chuỗi rỗng xuống dưới cùng
router.register(r'', BookViewSet, basename='book')

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='book-stats'),
    path('', include(router.urls)),
]