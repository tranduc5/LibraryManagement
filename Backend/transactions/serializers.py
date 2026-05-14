from rest_framework import serializers
from .models import BorrowTransaction
from books.models import Book

class BorrowTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BorrowTransaction
        fields = '__all__'

    def create(self, validated_data):
        book = validated_data['book']
        
        # Kiểm tra xem còn sách trong kho không
        if book.stock <= 0:
            raise serializers.ValidationError({"error": "Sách này đã hết trong kho!"})
        
        # Trừ kho 1 cuốn
        book.stock -= 1
        book.save()
        
        return super().create(validated_data)