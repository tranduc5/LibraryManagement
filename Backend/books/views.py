from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Book, Category
from .serializers import BookSerializer, CategorySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum # THÊM DÒNG NÀY

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    # 1. Thêm bộ lọc SearchFilter và DjangoFilterBackend vào đây
    filter_backends = [filters.SearchFilter]
    
    # 2. Định nghĩa các trường cho phép tìm kiếm (Tên sách và Tác giả)
    search_fields = ['title', 'author']
    def get_queryset(self):
        queryset = Book.objects.all()
        
        # Nhận tham số 'category' truyền từ hàm fetchBooks của React sang
        category_id = self.request.query_params.get('category', None)
        if category_id:
            # Lọc các cuốn sách có trường category bằng ID nhận được
            queryset = queryset.filter(category_id=category_id)
            
        return queryset

    def get_permissions(self):
        # Ai cũng có thể xem danh sách (GET)
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        # Chỉ Admin mới được Thêm, Sửa, Xóa
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class DashboardStatsView(APIView):
    # Bạn có thể để AllowAny hoặc IsAuthenticated tùy bảo mật
    permission_classes = [permissions.AllowAny] 

    def get(self, request):
        # SỬA TẠI ĐÂY: Tính tổng cột stock của tất cả các cuốn sách
        total_stock = Book.objects.aggregate(total=Sum('stock'))['total'] or 0
        
        total_categories = Category.objects.count()
        
        from transactions.models import BorrowTransaction
        active_borrows = BorrowTransaction.objects.filter(status='BORROWED').count()

        return Response({
            "total_books": total_stock,      # Đây là tổng số bản sao còn lại
            "total_categories": total_categories,
            "active_borrows": active_borrows
        })