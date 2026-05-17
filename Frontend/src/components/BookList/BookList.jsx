import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookList = ({ searchQuery }) => {
  const [books, setBooks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]); // State lưu danh sách thể loại

  // 1. Hàm lấy danh sách thể loại từ API backend
  const fetchCategories = async () => {
    try {
      // Gọi đúng endpoint đã được router ưu tiên giải phóng
      const res = await axios.get('http://127.0.0.1:8000/api/books/categories/');
      
      // Kiểm tra cấu trúc dữ liệu an toàn để tránh lỗi .map()
      if (res.data && Array.isArray(res.data)) {
        setCategories(res.data);
      } else if (res.data && res.data.results && Array.isArray(res.data.results)) {
        setCategories(res.data.results);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách thể loại:", err);
    }
  };

  // 2. Hàm lấy danh sách sách kèm bộ lọc search và category
  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery && searchQuery.trim() !== '') params.append('search', searchQuery.trim());
      if (categoryFilter) params.append('category', categoryFilter);

      const url = `http://127.0.0.1:8000/api/books/${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await axios.get(url);
      setBooks(res.data);
    } catch (err) {
      console.error("Lỗi fetch sách:", err);
    }
  };

  useEffect(() => {
    fetchCategories(); // Gọi 1 lần duy nhất khi render component
  }, []);

  useEffect(() => {
    fetchBooks(); // Gọi lại khi từ khóa gõ hoặc ô chọn thể loại thay đổi
  }, [searchQuery, categoryFilter]);

  const handleBorrow = async (bookId) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("Đức ơi, bạn cần đăng nhập lại nhé!");
      return;
    }
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/transactions/borrow_book/', 
        { book_id: bookId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Mượn sách thành công rồi nhé!");
      fetchBooks(); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Lỗi khi mượn sách!");
    }
  };

  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Danh Sách Sách Trong Kho</h4>
        
        {/* CẬP NHẬT Ô LỌC THỂ LOẠI CHUẨN RENDERING */}
        <select 
          className="form-select w-25 border shadow-sm" 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ borderRadius: '6px', fontSize: '14px' }}
        >
          <option value="">Tất cả thể loại</option>
          {categories && categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white p-3 shadow-sm rounded-4 border">
        <table className="table table-hover align-middle m-0">
          <thead>
            <tr className="text-secondary" style={{ fontSize: '14px' }}>
              <th>Ảnh</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Thể loại</th>
              <th className="text-center">Số lượng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px' }}>
            {books.length > 0 ? (
              books.map(book => (
                <tr key={book.id}>
                  <td>
                    <img 
                      src={book.image || 'https://via.placeholder.com/40x60'} 
                      style={{width: '40px', height: '55px', borderRadius: '4px', objectFit: 'cover'}} 
                      alt="cover" 
                    />
                  </td>
                  <td className="fw-bold text-dark">{book.title}</td>
                  <td className="text-secondary">{book.author}</td>
                  <td className="text-secondary">{book.category_detail?.name || 'Chưa phân loại'}</td>
                  <td className="text-center fw-semibold text-secondary">{book.stock}</td>
                  <td>
                    <button 
                      className={`btn btn-sm px-3 ${book.stock > 0 ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => handleBorrow(book.id)} 
                      disabled={book.stock <= 0}
                      style={{ borderRadius: '6px' }}
                    >
                      {book.stock > 0 ? 'Mượn sách' : 'Hết sách'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4 small">
                  Không tìm thấy đầu sách nào phù hợp...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList;