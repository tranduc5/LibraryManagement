from django.db import models
from django.contrib.auth.models import User  
from datetime import date 


# Bảng thể loại sách
class Genre(models.Model):
    name = models.CharField(max_length=200, help_text="Nhập thể loại sách (ví dụ: CNTT, Văn học...)")

    def __str__(self):
        return self.name

# Bảng thông tin tác giả 
class Author(models.Model): # <--- KIỂM TRA TÊN CLASS NÀY
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    # ... các field khác ...
    def __str__(self):
        return f'{self.last_name}, {self.first_name}'
    

# Bảng thông tin sách
class Book(models.Model):
    title = models.CharField(max_length=200, verbose_name="Tên sách")
    author = models.CharField(max_length=200, verbose_name="Tác giả")
    summary = models.TextField(max_length=1000, help_text="Mô tả nội dung sách")
    isbn = models.CharField('ISBN', max_length=13, unique=True)
    genre = models.ManyToManyField(Genre, help_text="Chọn thể loại cho sách")
    is_available = models.BooleanField(default=True)    # True là chưa mượn , False là đã mượn 
    
    def __str__(self):
        return self.title
    


# Bảng mượn sách 
class Loan(models.Model):
    book= models.ForeignKey('Book', on_delete=models.CASCADE)
    borrower=models.ForeignKey(User , on_delete=models.SET_NULL , null=True , blank=True)
    loan_date= models.DateField(auto_now_add= True)    # Tư động lấy ngày mượn là ngày hôm nay 
    due_date= models.DateField(null=True , blank=True)    # Ngày hẹn trả

    LOAN_STATUS=(
        ('o', 'Đang mượn'),
        ('r', 'Đã trả'),
    )

    status = models.CharField(max_length=1  , choices=LOAN_STATUS , default='o')

    def __str__(self):
        return f"{self.borrower.username} mượn {self.book.title}"
    