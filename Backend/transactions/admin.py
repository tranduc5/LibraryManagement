from django.contrib import admin
from .models import BorrowTransaction

@admin.register(BorrowTransaction)
class BorrowTransactionAdmin(admin.ModelAdmin):
    # Hiển thị các cột thông tin quan trọng
    list_display = ('user', 'book', 'borrow_date', 'due_date', 'status')
    
    # Bộ lọc nhanh theo trạng thái và ngày mượn
    list_filter = ('status', 'borrow_date')
    
    # Tìm kiếm theo tên người mượn hoặc tên sách
    search_fields = ('user__username', 'book__title')
    
    # Màu sắc cho các trạng thái (Tùy chọn cho chuyên nghiệp)
    list_editable = ('status',)