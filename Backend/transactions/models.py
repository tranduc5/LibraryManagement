from django.db import models , transaction 
from django.contrib.auth.models import User
from books.models import Book
from django.utils import timezone

# Create your models here.

class BorrowTransaction(models.Model):
    STATUS_CHOICES = [
        ('BORROWED', 'Đang mượn'),
        ('RETURNED' , 'Đã trả'),
        ('OVERDUE' , 'Quá hạn'),
    ]

    user = models.ForeignKey(User , on_delete=models.CASCADE , related_name='transactions')
    book = models.ForeignKey(Book , on_delete=models.CASCADE , related_name ='transactions')
    borrow_date =models.DateTimeField(auto_now_add=True , verbose_name="Ngày mượn")
    due_date = models.DateTimeField(verbose_name="Hạn Trả")
    return_date = models.DateTimeField(null=True , blank =True , verbose_name="Ngày thực tế trả")
    status =models.CharField(max_length=10 , choices=STATUS_CHOICES , default ='BORROWED')

    def __str__(self):
        return f"{self.user.username} mượn {self.book.title}"
    

    def save(self , *args , **kwargs): 
        # Nếu tạo giao dịch mới (Mượn sách)
        if not self.pk :
            if self.book.stock <=0:
                raise ValueError("Sách này đã hết trong kho!")

            # Trừ kho khi mượn 
            self.book.stock -=1
            self.book.save()

            # Trả sách 
        else : 
            old_status =BorrowTransaction.objects.get(pk=self.pk).status
            if old_status =='BORROWED' and self.status =='RETURNED':
                with transaction.atomic() : 
                    self.book.stock +=1
                    self.book.save()
                    self.return_date =timezone.now()    # Ghi nhận ngày trả

        super().save(*args , **kwargs)

    
