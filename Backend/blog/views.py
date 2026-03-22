from django.shortcuts import render
from .models import Post
from catalog.models import Book, Author, Genre  # Nhập các Model từ app catalog
# Create your views here.

def post_list(request):
    # lấy tất cả bài viết , sắp xếp theo nagfy mới nhất lên đầu
    posts=Post.objects.all().order_by('-date')

    # Lấy dữ liệu từ catalog để nhúng 
    num_books = Book.objects.all().count()
    num_authors = Author.objects.all().count()

    # Gửi tất cả vào context

    context = {
        'posts': posts,
        'num_books' : num_books,
        'num_authors' : num_authors,
    }
    return render(request,'blog/post_list.html', {'post':posts})

