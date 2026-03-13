from django.db import models

# Bảng thể loại sách
class Genre(models.Model):
    name = models.CharField(max_length=200, help_text="Nhập thể loại sách (ví dụ: CNTT, Văn học...)")

    def __str__(self):
        return self.name

# Bảng thông tin sách
class Book(models.Model):
    title = models.CharField(max_length=200, verbose_name="Tên sách")
    author = models.CharField(max_length=200, verbose_name="Tác giả")
    summary = models.TextField(max_length=1000, help_text="Mô tả nội dung sách")
    isbn = models.CharField('ISBN', max_length=13, unique=True)
    genre = models.ManyToManyField(Genre, help_text="Chọn thể loại cho sách")

    def __str__(self):
        return self.title