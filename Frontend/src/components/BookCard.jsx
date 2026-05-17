import React, { useState, useEffect } from 'react';
import SideBar from '../../components/SideBar/SideBar';
import NavBar from '../../components/NavBar/NavBar';
import Insight from '../../components/Insight/Insight';
import BookList from '../../components/BookList/BookList';
import axios from 'axios';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState('tong-quan');

  // =================================================================
  // 1. STATE & LOGIC QUẢN LÝ SÁCH (GIỮ NGUYÊN)
  // =================================================================
  const [adminBooks, setAdminBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  const [bookForm, setBookForm] = useState({ title: '', author: '', stock: 0, category: '' });

  const token = localStorage.getItem('access_token');

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/categories/');
      setCategories(res.data);
    } catch (err) {
      console.log("Backend chưa có API /api/categories/ hoặc lỗi 404");
    }
  };

  const fetchAdminBooks = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (categoryFilter) params.append('category', categoryFilter);

      const url = `http://127.0.0.1:8000/api/books/${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await axios.get(url);
      setAdminBooks(res.data);
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
    if (window.confirm("Đức chắc chắn muốn xóa đầu sách này chứ?")) {
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
      alert("Lỗi xử lý dữ liệu!");
    }
  };

  // =================================================================
  // 2. STATE & LOGIC QUẢN LÝ ĐỘC GIẢ (CẬP NHẬT HOÀN CHỈNH)
  // =================================================================
  const [readers, setReaders] = useState([]);
  const [readerSearch, setReaderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Các state phục vụ đóng mở form Độc giả
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [isEditingReader, setIsEditingReader] = useState(false);
  const [currentReaderId, setCurrentReaderId] = useState(null);
  
  // Cấu trúc Form Độc giả chuẩn theo 2 ảnh mẫu mới của Đức
  const [readerForm, setReaderForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active'
  });

  const fetchReaders = () => {
    const mockReaders = [
      { id: 1, student_code: 'B22DCCN123', name: 'Nguyễn Văn A', email: 'nguyenvana@stu.ptit.edu.vn', phone: '0987654321', status: 'Active' },
      { id: 2, student_code: 'B22DCCN456', name: 'Trần Thị B', email: 'tranthib@stu.ptit.edu.vn', phone: '0912345678', status: 'Blocked' },
      { id: 3, student_code: 'B22DCCN789', name: 'Lê Hoàng C', email: 'lehoangc@stu.ptit.edu.vn', phone: '0906667778', status: 'Active' },
    ];

    const filtered = mockReaders.filter(reader => {
      const matchesSearch = reader.student_code.toLowerCase().includes(readerSearch.toLowerCase()) || 
                            reader.name.toLowerCase().includes(readerSearch.toLowerCase());
      const matchesStatus = statusFilter === '' || reader.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    setReaders(filtered);
  };

  // Kích hoạt khi bấm nút "+ Đăng Ký Độc Giả Mới"
  const handleAddReaderClick = () => {
    setIsEditingReader(false);
    setReaderForm({ name: '', email: '', phone: '', status: 'Active' });
    setShowReaderModal(true);
  };

  // Kích hoạt khi bấm icon Sửa trên dòng độc giả
  const handleEditReaderClick = (reader) => {
    setIsEditingReader(true);
    setCurrentReaderId(reader.id);
    setReaderForm({
      name: reader.name,
      email: reader.email,
      phone: reader.phone || '',
      status: reader.status
    });
    setShowReaderModal(true);
  };

  // Xử lý gửi Form Đăng ký / Chỉnh sửa độc giả
  const handleSaveReader = (e) => {
    e.preventDefault();
    if (isEditingReader) {
      // Logic gọi API PUT/PATCH chỉnh sửa độc giả sau này
      alert(`Cập nhật thông tin độc giả thành công!`);
    } else {
      // Logic gọi API POST tạo mới độc giả sau này
      alert("Đăng ký hồ sơ độc giả mới thành công!");
    }
    setShowReaderModal(false);
    fetchReaders(); // Tải lại danh sách bảng độc giả
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeMenu === 'quan-ly-sach') {
      fetchAdminBooks();
    } else if (activeMenu === 'quan-ly-doc-gia') {
      fetchReaders();
    }
  }, [searchQuery, categoryFilter, readerSearch, statusFilter, activeMenu]);

  return (
    <div className="d-flex">
      <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <div className="flex-grow-1 bg-light min-vh-100">
        <NavBar onSearch={(term) => setActiveMenu('tong-quan') || setSearchQuery(term)} />
        
        <div className="p-4">
          {/* MENU 1: TỔNG QUAN */}
          {activeMenu === 'tong-quan' && (
            <>
              <h3 className="fw-bold mb-4">Dashboard Hệ Thống</h3>
              <Insight />
              <BookList searchQuery={searchQuery} />
            </>
          )}

          {/* MENU 2: QUẢN LÝ SÁCH */}
          {activeMenu === 'quan-ly-sach' && (
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
                              {book.image ? (
                                <img src={book.image} style={{ width: '35px', height: '48px', borderRadius: '4px', objectFit: 'cover' }} alt="cover" />
                              ) : (
                                <div className="bg-light d-flex align-items-center justify-content-center rounded border" style={{ width: '35px', height: '48px' }}>
                                  <i className="bi bi-image text-muted fs-5"></i>
                                </div>
                              )}
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
                                  style={{ transition: 'transform 0.1s' }}
                                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
                                  style={{ transition: 'transform 0.1s' }}
                                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
            </div>
          )}

          {/* MENU 3: QUẢN LÝ ĐỘC GIẢ */}
          {activeMenu === 'quan-ly-doc-gia' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0" style={{ color: '#111827' }}>Quản Lý Hồ Sơ Độc Giả</h3>
                <button 
                  className="btn btn-primary fw-semibold px-4 py-2" 
                  style={{ backgroundColor: '#2563eb', border: 'none', borderRadius: '6px' }}
                  onClick={handleAddReaderClick}
                >
                  + Đăng Ký Độc Giả Mới
                </button>
              </div>

              <div className="bg-white p-4 rounded-3 shadow-sm border">
                <div className="d-flex gap-3 mb-4">
                  <input 
                    type="text" 
                    className="form-control border bg-light text-muted" 
                    placeholder="Tìm theo Mã SV hoặc Họ Tên..." 
                    value={readerSearch}
                    onChange={(e) => setReaderSearch(e.target.value)}
                    style={{ width: '320px', borderRadius: '6px' }}
                  />
                  
                  <select 
                    className="form-select border bg-light text-muted" 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ width: '200px', borderRadius: '6px' }}
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr className="text-secondary" style={{ backgroundColor: '#fafafa' }}>
                        <th className="py-3 px-4" style={{ width: '180px' }}>Mã Sinh Viên</th>
                        <th className="py-3">Họ và Tên</th>
                        <th className="py-3">Email liên hệ</th>
                        <th className="py-3" style={{ width: '220px' }}>Trạng thái thẻ</th>
                        <th className="py-3 text-center" style={{ width: '150px' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {readers.length > 0 ? (
                        readers.map((reader) => (
                          <tr key={reader.id} style={{ backgroundColor: reader.status === 'Blocked' ? '#fdf2f2' : 'transparent' }}>
                            <td className="py-3 px-4 fw-bold text-dark">{reader.student_code}</td>
                            <td className="py-3 fw-bold text-secondary">{reader.name}</td>
                            <td className="py-3 text-muted">{reader.email}</td>
                            <td className="py-3">
                              {reader.status === 'Active' ? (
                                <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 fw-semibold">
                                  <span className="bg-success rounded-circle" style={{ width: '6px', height: '6px' }}></span>
                                  Active
                                </span>
                              ) : (
                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 fw-semibold">
                                  <span className="bg-danger rounded-circle" style={{ width: '6px', height: '6px' }}></span>
                                  Blocked (Nợ sách)
                                </span>
                              )}
                            </td>
                            <td className="py-3 text-center">
                              <div className="d-flex justify-content-center gap-3">
                                {/* Bấm vào icon sửa sẽ gọi hàm handleEditReaderClick */}
                                <button type="button" className="btn p-1 border-0 bg-transparent text-primary" onClick={() => handleEditReaderClick(reader)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg>
                                </button>
                                <button type="button" className={`btn p-1 border-0 bg-transparent ${reader.status === 'Active' ? 'text-warning' : 'text-success'}`} onClick={() => alert(`Thay đổi trạng thái khóa`)}>
                                  {reader.status === 'Active' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/></svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M11 1a2 2 0 0 0-2 2v4H2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1V3a1 1 0 0 1 2 0v2a.5.5 0 0 0 1 0V3a2 2 0 0 0-2-2M0 9a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1z"/></svg>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="5" className="text-center py-5 text-muted small">Không tìm thấy kết quả độc giả phù hợp...</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CÁC MENU KHÁC GIỮ NGUYÊN */}
          {activeMenu === 'quan-ly-muon-tra' && <div className="p-4 card border-0 shadow-sm rounded-4">🔄 Quản lý Mượn / Trả</div>}
          {activeMenu === 'bao-cao-thong-ke' && <div className="p-4 card border-0 shadow-sm rounded-4">📈 Báo cáo Thống kê Hoạt động</div>}
        </div>
      </div>

      {/* MODAL THÊM / SỬA SÁCH */}
      {showModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: '650px' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 p-2">
              <div className="modal-header border-0 pt-3 px-4">
                <h5 className="modal-title fw-bold text-dark fs-4">{isEditing ? 'Cập nhật thông tin' : 'Thêm Sách Mới'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSaveBook}>
                <div className="modal-body px-4">
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-secondary small">Tên sách <span className="text-danger">*</span></label>
                    <input type="text" className="form-control py-2 px-3 border-light-subtle bg-light-subtle" placeholder="Nhập tên sách" required value={bookForm.title} onChange={e => setBookForm({...bookForm, title: e.target.value})} style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="row mb-4">
                    <div className="col-6">
                      <label className="form-label fw-semibold text-secondary small">Tác giả <span className="text-danger">*</span></label>
                      <input type="text" className="form-control py-2 px-3 border-light-subtle bg-light-subtle" placeholder="Nhập tên tác giả" required value={bookForm.author} onChange={e => setBookForm({...bookForm, author: e.target.value})} style={{ borderRadius: '8px' }} />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold text-secondary small">Thể loại <span className="text-danger">*</span></label>
                      <select className="form-select py-2 px-3 border-light-subtle bg-light-subtle text-muted" required value={bookForm.category} onChange={e => setBookForm({...bookForm, category: e.target.value})} style={{ borderRadius: '8px' }}>
                        <option value="">Chọn thể loại</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-6">
                      <label className="form-label fw-semibold text-secondary small">Số lượng <span className="text-danger">*</span></label>
                      <input type="number" className="form-control py-2 px-3 border-light-subtle bg-light-subtle" required min="1" value={bookForm.stock} onChange={e => setBookForm({...bookForm, stock: e.target.value})} style={{ borderRadius: '8px' }} />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold text-secondary small">Ảnh bìa</label>
                      <div className="d-flex flex-column align-items-center justify-content-center bg-light border border-2 text-secondary" style={{ height: '110px', borderRadius: '8px', borderStyle: 'dashed', cursor: 'pointer', borderColor: '#dee2e6' }} onClick={() => alert("Chức năng tải ảnh lên đang được kết nối với Backend...")}>
                        <div className="d-flex align-items-center gap-2"><span className="small">Click để chọn ảnh bìa</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 px-4 pb-4">
                  <button type="button" className="btn btn-light px-4 py-2 fw-semibold text-secondary" onClick={() => setShowModal(false)} style={{ borderRadius: '8px', backgroundColor: '#f1f3f5' }}>Hủy bỏ</button>
                  <button type="submit" className="btn btn-primary px-4 py-2 fw-semibold shadow-sm" style={{ borderRadius: '8px', backgroundColor: '#5c7cfa', border: 'none' }}>Lưu thông tin</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL ĐĂNG KÝ VÀ CHỈNH SỬA ĐỘC GIẢ (THIẾT KẾ CHUẨN 100% THEO 2 ẢNH MỚI) */}
      {/* ================================================================= */}
      {showReaderModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '480px' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 p-2">
              
              {/* Header Modal đổi tiêu đề và icon linh hoạt theo trạng thái Thêm/Sửa */}
              <div className="modal-header border-0 pt-3 px-4 d-flex align-items-center gap-2">
                {isEditingReader && (
                  <span className="text-primary fs-5 d-inline-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-gear" viewBox="0 0 16 16">
                      <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 1 0 0 4m.002 6a4.99 4.99 0 0 1 2.184-4.075C9.477 8.374 8.753 8 8 8s-1.477.374-2.185 1.025A4.96 4.96 0 0 0 3 13.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .002-1M11 12.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0-3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m4 1.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0-3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                    </svg>
                  </span>
                )}
                <h5 className="modal-title fw-bold text-dark fs-5 m-0">
                  {isEditingReader ? 'Chỉnh Sửa Thông Tin Độc Giả' : 'Đăng Ký Độc Giả Mới'}
                </h5>
                <button type="button" className="btn-close ms-auto" onClick={() => setShowReaderModal(false)}></button>
              </div>

              <form onSubmit={handleSaveReader}>
                <div className="modal-body px-4 pt-2">
                  
                  {/* Trường Họ và Tên */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary small mb-1">
                      Họ và Tên <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-control py-2 px-3 bg-white border border-light-subtle shadow-sm" 
                      placeholder="Nhập họ và tên..."
                      required 
                      value={readerForm.name}
                      onChange={e => setReaderForm({...readerForm, name: e.target.value})}
                      style={{ borderRadius: '8px', fontSize: '14px' }}
                    />
                  </div>

                  {/* Trường Email liên hệ */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary small mb-1">
                      Email liên hệ <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="email" 
                      className="form-control py-2 px-3 bg-white border border-light-subtle shadow-sm" 
                      placeholder="Ví dụ: nguyenvana@stu.ptit.edu.vn"
                      required 
                      value={readerForm.email}
                      onChange={e => setReaderForm({...readerForm, email: e.target.value})}
                      style={{ borderRadius: '8px', fontSize: '14px' }}
                    />
                  </div>

                  {/* Trường Số điện thoại */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary small mb-1">
                      Số điện thoại
                    </label>
                    <input 
                      type="text" 
                      className="form-control py-2 px-3 bg-white border border-light-subtle shadow-sm" 
                      placeholder="Nhập số điện thoại (nếu có)"
                      value={readerForm.phone}
                      onChange={e => setReaderForm({...readerForm, phone: e.target.value})}
                      style={{ borderRadius: '8px', fontSize: '14px' }}
                    />
                  </div>

                  {/* Trường Trạng thái thẻ - CHỈ HIỂN THỊ KHI Ở CHẾ ĐỘ SỬA ĐỘC GIẢ (Chuẩn ảnh mẫu số 2) */}
                  {isEditingReader && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-secondary small mb-1">
                        Trạng thái thẻ <span className="text-danger">*</span>
                      </label>
                      <select 
                        className="form-select py-2 px-3 bg-white border border-light-subtle shadow-sm text-dark"
                        required
                        value={readerForm.status}
                        onChange={e => setReaderForm({...readerForm, status: e.target.value})}
                        style={{ borderRadius: '8px', fontSize: '14px' }}
                      >
                        <option value="Active">Hoạt động (Active)</option>
                        <option value="Blocked">Khóa (Blocked)</option>
                      </select>
                    </div>
                  )}

                </div>

                {/* Footer với nút Hủy và nút Thay đổi linh hoạt */}
                <div className="modal-footer border-0 px-4 pb-4 pt-2">
                  <button 
                    type="button" 
                    className="btn btn-light px-4 py-2 fw-semibold text-secondary border border-light-subtle" 
                    onClick={() => setShowReaderModal(false)}
                    style={{ borderRadius: '8px', backgroundColor: '#white', fontSize: '14px' }}
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4 py-2 fw-semibold shadow-sm d-flex align-items-center gap-1"
                    style={{ borderRadius: '8px', backgroundColor: '#5c67f2', border: 'none', fontSize: '14px' }}
                  >
                    {isEditingReader ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757 Gold .757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                        </svg>
                        Cập nhật thay đổi
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-floppy-fill" viewBox="0 0 16 16">
                          <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z"/>
                        </svg>
                        Lưu thông tin
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;