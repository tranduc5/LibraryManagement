"""
URL configuration for library_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path , include  # Thêm include 
from catalog import views # Phải có dòng này để lấy hàm index
# from . import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'), # Dòng này sẽ thay thế trang tên lửa bằng trang của bạn
    path('accounts/', include('django.contrib.auth.urls')) , # đường dẫn đăng nhập
    path('blog/', include('blog.urls')),
    path('', views.index, name='index'),
    # Đường dẫn ví dụ: /catalog/book/1
    path('book/<int:pk>', views.BookDetailView.as_view(), name='book-detail'),
    path('book/<int:pk>/borrow/', views.borrow_book, name='borrow_book'),
    path('loan/<int:pk>/return/', views.return_book, name='return-book'),
    path('mybooks/' , views.LoanedBooksByUserListView.as_view() , name='my-borrowed'),
    
]