from django.contrib import admin
from .models import Book, Author,  Genre
from.models import Loan

admin.site.register(Book)
admin.site.register(Author)
admin.site.register(Genre)
# admin.site.register(Loan)


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ('book', 'borrower', 'loan_date', 'due_date', 'status')
    list_filter = ('status', 'due_date') # Thêm bộ lọc bên phải