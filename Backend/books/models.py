from django.db import models

# Create your models here.
class Category(models.Model): 
    name=models.CharField(max_length=100, verbose_name="Tên thể loại")
    description = models.TextField(blank = True , null = True , verbose_name="Mô tả")

    def __str__(self):
        return self.name
    
class Book(models.Model):
    title = models.CharField(max_length=200 , verbose_name="Tên sách")
    author=models.CharField(max_length=100 , verbose_name="Tác giả")
    # Sử dụng set_null : để khi xoá thể loại , Sách chuyển về trạng thái trống cho an toàn
    category=models.ForeignKey(Category, on_delete=models.SET_NULL , null=True ,  related_name='books')
    description = models.TextField(blank=True , null=True , verbose_name="Tóm tắt nội dung")
    published_date = models.DateField(auto_now_add=True)
    

    # Tạo trường quản lý kho sách  :  giúp cta nắm bắt còn bao nhiêu sách trong kho 
    stock = models.PositiveIntegerField(default=1 , verbose_name = "Số lượng sách trong kho")

    # Ảnh bìa
    image = models.ImageField(upload_to = 'book_covers/' ,  null=True , blank=True , verbose_name = "Bìa sách")

    # Ngày nhập kho
    created_at = models.DateTimeField(auto_now_add = True)


    def __str__(self):
        return self.title
    



    