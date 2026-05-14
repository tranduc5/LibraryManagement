from django.contrib import admin
from .models import Book, Category

# Đăng ký bảng Thể loại
# @admin.register(Category)
# class CategoryAdmin(admin.ModelAdmin):
#     list_display = ('id', 'name')

# Đăng ký bảng Sách
# @admin.register(Book)
# class BookAdmin(admin.ModelAdmin):
#     list_display = ('id', 'title', 'author', 'category')
#     search_fields = ('title', 'author') # Thêm thanh tìm kiếm cho xịn


from django.utils.html import format_html # Thư viện để hiển thị HTML (ảnh)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    # Những cột sẽ hiển thị ra danh sách bên ngoài
    list_display = ('get_image', 'title', 'author', 'category', 'stock', 'created_at')
    
    # Cho phép tìm kiếm nhanh theo tên và tác giả
    search_fields = ('title', 'author')
    
    # Bộ lọc ở thanh bên phải (Filter)
    list_filter = ('category', 'created_at')

    # Hàm bổ trợ để hiển thị ảnh bìa thu nhỏ ngay trong danh sách
    def get_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: auto; border-radius: 5px;" />', obj.image.url)
        return "Chưa có ảnh"
    get_image.short_description = 'Bìa sách'

admin.site.register(Category)