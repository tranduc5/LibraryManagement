from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import BorrowTransaction
from .serializers import BorrowTransactionSerializer
from django.utils import timezone

class BorrowTransactionViewSet(viewsets.ModelViewSet):
    queryset = BorrowTransaction.objects.all()
    serializer_class = BorrowTransactionSerializer

    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        """Logic khi trả sách"""
        transaction = self.get_object()
        if transaction.status == 'RETURNED':
            return Response({"error": "Sách này đã được trả trước đó rồi!"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Cập nhật trạng thái giao dịch
        transaction.status = 'RETURNED'
        transaction.return_date = timezone.now()
        transaction.save()
        
        # Cộng lại kho cho sách
        book = transaction.book
        book.stock += 1
        book.save()
        
        return Response({"message": "Trả sách thành công, kho đã được cập nhật!"})