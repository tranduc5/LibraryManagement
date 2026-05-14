from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Tạo model cho độc giả 
class UserProfile(models.Model):
    # tạo kết nối  1-1 với tài khoản User hệ thống
    user = models.OneToOneField(User , on_delete=models.CASCADE , related_name='profile')

    # Thông tin bổ sung cho độc giả 
    phone = models.CharField(max_length=15 , blank=True , null=True , verbose_name= "Số điện thoại")
    address = models.TextField(blank=True , null=True , verbose_name= "Địa chỉ") 
    avatar = models.ImageField(upload_to='avatars/' , null=True , blank =True , verbose_name= "Ảnh đại diện ")

    # Loại tài khoản (dùng để phân quyền )
    ROLE_CHOICES=[
        ('ADMIN' , 'Thủ Thư'),
        ('MEMBER' , 'Độc giả'),
    ]
    role = models.CharField(max_length=10 , choices=ROLE_CHOICES , default='MEMBER' , verbose_name ="Vai trò")


    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"
    
    

