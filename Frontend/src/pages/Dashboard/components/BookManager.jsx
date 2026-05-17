import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookModal from './BookModal'; // Đảm bảo import đúng BookModal của bạn

const BookManager = () => {
  const [adminBooks, setAdminBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Quản lý cục bộ các trạng thái Modal để tránh gây lỗi trắng màn hình
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  const [bookForm, setBookForm] = useState({ title: '', author: '', stock: 0, category: '' });

  const token = localStorage.getItem('access_token');

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/books/categories/');
      
      if (res.data && Array.isArray(res.data)) {
        setCategories(res.data);
      } else if (res.data && res.data.results && Array.isArray(res.data.results)) {
        setCategories(res.data.results);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách thể loại:", err);
    }
  };

  const fetchAdminBooks = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery && searchQuery.trim() !== '') params.append('search', searchQuery.trim());
      if (categoryFilter) params.append('category', categoryFilter);

      const url = `http://127.0.0.1:8000/api/books/${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminBooks(res.data.results || res.data);
    } catch (err) {
      console.error("Lỗi tải danh sách sách phía admin:", err);
    }
  };

  const handleAddBookClick = () => {
    setIsEditing(false);
    setBookForm({ title: '', author: '', stock: 0, category: '' });
    setShowModal(true);
  };

  const handleEditBookClick = (book) => {
    setIsEditing(true);
    setCurrentBookId(book.id);
    setBookForm({
      title: book.title,
      author: book.author,
      stock: book.stock,
      category: book.category || book.category_detail?.id || ''
    });
    setShowModal(true);
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Trần Đức chắc chắn muốn xóa đầu sách này chứ?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/books/${bookId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Xóa sách thành công!");
        fetchAdminBooks();
      } catch (err) {
        alert("Không thể xóa sách này!");
      }
    }
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://127.0.0.1:8000/api/books/${currentBookId}/`, bookForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Cập nhật thông tin sách thành công!");
      } else {
        await axios.post('http://127.0.0.1:8000/api/books/', bookForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Thêm sách vào kho thành công!");
      }
      setShowModal(false);
      fetchAdminBooks();
    } catch (err) {
      alert("Lỗi xử lý dữ liệu với hệ thống Backend!");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchAdminBooks();
  }, [searchQuery, categoryFilter]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0" style={{ color: '#111827' }}>Quản Lý Danh Mục Sách</h3>
        <button 
          className="btn btn-primary fw-bold px-4 py-2" 
          style={{ backgroundColor: '#2563eb', border: 'none', borderRadius: '6px' }}
          onClick={handleAddBookClick}
        >
          + Thêm Sách Mới
        </button>
      </div>

      <div className="bg-white p-4 rounded-3 shadow-sm border">
        <div className="d-flex gap-3 mb-4">
          <input 
            type="text" 
            className="form-control border bg-light text-muted" 
            placeholder="Tìm kiếm sách..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '280px', borderRadius: '6px' }}
          />
          
          <select 
            className="form-select border bg-light text-muted" 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: '220px', borderRadius: '6px' }}
          >
            <option value="">Tất cả thể loại</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr className="text-secondary" style={{ backgroundColor: '#fafafa' }}>
                <th className="py-3 px-3" style={{ width: '60px' }}>ID</th>
                <th className="py-3" style={{ width: '80px' }}>Ảnh</th>
                <th className="py-3">Tên sách</th>
                <th className="py-3">Thể loại</th>
                <th className="py-3">Tác giả</th>
                <th className="py-3 text-center" style={{ width: '100px' }}>Số lượng</th>
                <th className="py-3 text-center" style={{ width: '150px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {adminBooks.length > 0 ? (
                adminBooks.map((book) => (
                  <tr key={book.id}>
                    <td className="py-3 px-3 fw-bold text-secondary">{book.id}</td>
                    <td className="py-3">
                      <img 
                        src={book.image || 'https://via.placeholder.com/40x60'} 
                        style={{ width: '35px', height: '48px', borderRadius: '4px', objectFit: 'cover' }} 
                        alt="cover" 
                      />
                    </td>
                    <td className="py-3 fw-bold text-dark">{book.title}</td>
                    <td className="py-3 text-secondary">{book.category_detail?.name || 'Chưa phân loại'}</td>
                    <td className="py-3 text-secondary">{book.author}</td>
                    <td className="py-3 text-center fw-semibold text-secondary">{book.stock}</td>
                    <td className="py-3 text-center">
                      <div className="d-flex justify-content-center gap-3">
                        <button 
                          type="button"
                          className="btn p-1 border-0 bg-transparent text-primary" 
                          onClick={() => handleEditBookClick(book)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                          </svg>
                        </button>
                        <button 
                          type="button"
                          className="btn p-1 border-0 bg-transparent text-danger" 
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center py-5 text-muted small">Không tìm thấy kết quả sách phù hợp với bộ lọc...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gọi Modal Thêm/Sửa sách và truyền state nội bộ sạch lỗi */}
      <BookModal 
        isOpen={showModal}
        isEditing={isEditing}
        bookForm={bookForm}
        setBookForm={setBookForm}
        categories={categories}
        onClose={() => setShowModal(false)}
        onSave={handleSaveBook}
      />
    </div>
  );
};

export default BookManager;