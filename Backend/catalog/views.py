from django.shortcuts import render
from .models import Book 
def index (request):
    # Lấy tất cả các sách có trong database
    all_books= Book.objects.all()
    # Gửi dữ liệu sách sang file HTML
    return render(request , 'index.html', {'book_list': all_books})

# Create your views here.
