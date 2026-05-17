from rest_framework import serializers
from .models import BorrowTransaction
from books.models import Book
from django.db.models import Q

# Đức import chính xác 2 Serializer này từ app account và books của bạn nhé (đổi tên nếu viết khác)
from accounts.serializers import UserSerializer 
from books.serializers import BookSerializer

class BorrowTransactionSerializer(serializers.ModelSerializer):
    # 1. Đưa thông tin chi tiết lồng nhau vào để React lấy được Tên SV và Tên Sách
    user_detail = UserSerializer(source='user', read_only=True)
    book_detail = BookSerializer(source='book', read_only=True)
    
    # 2. Tạo trường định dạng trạng thái Tiếng Việt chuẩn hóa cho Frontend
    status_display = serializers.SerializerMethodField()

    class Meta:
        model = BorrowTransaction
        fields = '__all__'

    def get_status_display(self, obj):
        # Đồng bộ hóa chữ HOA trong DB thành chữ Tiếng Việt cho React lọc sạch lỗi
        if obj.status == 'BORROWED':
            return "Đang mượn"
        if obj.status == 'RETURNED':
            return "Đã trả"
        return obj.status

    def create(self, validated_data):
        book = validated_data['book']
        if book.stock <= 0:
            raise serializers.ValidationError({"error": "Sách này đã hết trong kho!"})
        
        book.stock -= 1
        book.save()
        return super().create(validated_data)