from rest_framework import viewsets, permissions , filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Book, Category
from .serializers import BookSerializer, CategorySerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('-created_at')  # Hiển thị sách mới nhất lên đầu 
    serializer_class = BookSerializer
    permission_classes = [permissions.AllowAny] # Thêm dòng này để cho phép xem không cần token

    # Cấu hình bộ lọc 
    filter_backends = [DjangoFilterBackend , filters.SearchFilter , filters.OrderingFilter]

    # Lọc theo ID thể loại 
    filterset_fields = ['category', 'stock']

    # Tìm kiếm theo tên sách hoặc tác giả 
    search_fields = ['title' , 'author']

    # Sắp xếp 
    ordering_fields = ['stock' , 'created_at']

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny] 