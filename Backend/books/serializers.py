from rest_framework import serializers
from .models import Book , Category 

class CategorySerializer(serializers.ModelSerializer):
    # Tính toán xem mỗi thể loại bao nhiêu cuốn
    book_count = serializers.IntegerField(source='books.count' , read_only = True)

    class Meta:
        model = Category
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    # Hiển thi  chi tiết thể loại 
    category_detail = CategorySerializer(source='category' , read_only='True')


    class Meta: 
        model=Book
        fields  = [
            'id' , 'title' , 'author' , 'category' , 'category_detail', 
            'description' , 'stock', 'image' , 'published_date' , 'created_at'
            ]


        