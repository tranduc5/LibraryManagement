from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from .models import BorrowTransaction
from .serializers import BorrowTransactionSerializer
from django.utils import timezone
from datetime import timedelta
from books.models import Book

class BorrowTransactionViewSet(viewsets.ModelViewSet):
    queryset = BorrowTransaction.objects.all().order_by('-borrow_date')
    serializer_class = BorrowTransactionSerializer
    permission_classes = [IsAuthenticated] # Đảm bảo chỉ người dùng đăng nhập mới thao tác được

    # 1. Logic mượn sách 
    @action(detail=False, methods=['post'])
    def borrow_book(self, request):
        book_id = request.data.get('book_id')
        
        try:
            # Tìm sách
            book = Book.objects.get(id=book_id)
            
            # Kiểm tra kho (Mặc dù Model đã có check nhưng check ở đây để báo lỗi sớm cho React)
            if book.stock <= 0:
                return Response({"error": "Sách đã hết trong kho!"}, status=status.HTTP_400_BAD_REQUEST)

            # Tính toán hạn trả (14 ngày kể từ bây giờ)
            han_tra = timezone.now() + timedelta(days=14) 

            # Tạo giao dịch 
            # Lưu ý: Hàm save() trong Model của Đức sẽ tự động trừ kho khi .create() chạy
            new_transaction = BorrowTransaction.objects.create(
                user=request.user,
                book=book,
                due_date=han_tra,
                status='BORROWED'
            )
            
            return Response({
                "message": "Mượn sách thành công!",
                "due_date": han_tra.strftime("%d/%m/%Y %H:%M"),
                "current_stock": book.stock - 1 # Dự báo stock sau khi trừ
            }, status=status.HTTP_201_CREATED)

        except Book.DoesNotExist:
            return Response({"error": "Không tìm thấy sách trong hệ thống!"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # In lỗi chi tiết ra Terminal để Đức dễ debug
            print(f"--- LỖI BACKEND: {str(e)} ---")
            return Response({"error": f"Lỗi hệ thống: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    # 2. Logic trả sách 
    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        """Logic khi trả sách theo ID giao dịch"""
        try:
            transaction = self.get_object()
            
            if transaction.status == 'RETURNED':
                return Response({"error": "Sách này đã được trả trước đó rồi!"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Cập nhật trạng thái giao dịch
            transaction.status = 'RETURNED'
            transaction.return_date = timezone.now()
            
            # Lưu transaction 
            # Lưu ý: Trong Model.save() của Đức đã có logic cộng lại kho khi status='RETURNED'
            transaction.save()
            
            return Response({
                "message": "Trả sách thành công, kho đã được cập nhật!",
                "return_date": transaction.return_date.strftime("%d/%m/%Y %H:%M")
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)