from django.shortcuts import render, redirect, get_object_or_404
from django.views import generic 
from django.core.paginator import Paginator 
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages 
from datetime import timedelta, date 

from .models import Loan, Book

# 1. Trang danh sách sách (Có tìm kiếm và phân trang)
def index(request):
    query = request.GET.get('q') 
    if query:
        # Sắp xếp để tránh lỗi UnorderedObjectListWarning
        all_books = Book.objects.filter(title__icontains=query).order_by('title')
    else:
        all_books = Book.objects.all().order_by('title')

    # Phân trang: Số lượng sách mỗi trang (ví dụ là 5 cho dễ nhìn)
    paginator = Paginator(all_books, 1) 
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'index.html', {'book_list': page_obj})


# 2. Trang chi tiết sách
class BookDetailView(generic.DetailView):
    model = Book
    template_name = 'catalog/book_detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.user.is_authenticated:
            # Chỉ lấy đơn mượn ĐANG diễn ra (status='o') của người dùng này
            context['user_loan'] = Loan.objects.filter(
                book=self.get_object(), 
                borrower=self.request.user, 
                status='o'
            ).first()
        return context


# 3. Logic mượn sách
@login_required
def borrow_book(request, pk):
    book = get_object_or_404(Book, pk=pk)
    
    if book.is_available:
        # Tạo bản ghi mượn
        new_loan = Loan(
            book=book,
            borrower=request.user,
            due_date=date.today() + timedelta(days=14),
            status='o'
        )
        new_loan.save()
        
        # Cập nhật trạng thái sách
        book.is_available = False
        book.save()
        
        messages.success(request, f'Chúc mừng, bạn đã mượn thành công cuốn "{book.title}".')
    else: 
        messages.error(request, 'Rất tiếc, cuốn sách này đã có người mượn rồi.')

    return redirect('book-detail', pk=pk)


# 4. Logic trả sách
@login_required
def return_book(request, pk):
    loan = get_object_or_404(Loan, pk=pk)
    book = loan.book 
    
    if request.user == loan.borrower or request.user.is_staff:
        # Cập nhật đơn mượn thành ĐÃ TRẢ
        loan.status = 'r' 
        loan.save()
        
        # Cập nhật trạng thái sách thành SẴN SÀNG
        book.is_available = True
        book.save()

        messages.info(request, f'Bạn đã trả "{book.title}" thành công. Cảm ơn bạn!')
        
    return redirect('book-detail', pk=book.pk)


# 5. THÊM MỚI: Trang danh sách sách của tôi (Logic cơ bản cuối cùng)
class LoanedBooksByUserListView(LoginRequiredMixin, generic.ListView):
    model = Loan
    template_name = 'catalog/book_list_borrowed_user.html'
    context_object_name = 'loan_list'
    
    def get_queryset(self):
        return Loan.objects.filter(borrower=self.request.user, status='o').order_by('due_date')