import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReaderModal from './ReaderModal';

const ReaderManager = () => {
  const [readers, setReaders] = useState([]);
  const [readerSearch, setReaderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [isEditingReader, setIsEditingReader] = useState(false);
  const [currentReaderId, setCurrentReaderId] = useState(null);
  
  const [readerForm, setReaderForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active'
  });

  const token = localStorage.getItem('access_token');

  // 1. Lấy danh sách độc giả từ Django Backend kèm bộ lọc
  const fetchReaders = async () => {
    try {
      const params = new URLSearchParams();
      // Nếu Backend của bạn dùng bộ lọc Django REST Framework SearchFilter
      if (readerSearch) params.append('search', readerSearch);
      
      const url = `http://127.0.0.1:8000/api/users/${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Lọc trạng thái thẻ Active/Blocked ở Client-side nếu Backend chưa viết bộ lọc riêng
      let data = res.data.results || res.data; // Phòng trường hợp có hoặc không phân trang
      if (statusFilter) {
        data = data.filter(r => {
          const rStatus = r.profile?.status || r.status || 'Active';
          return rStatus === statusFilter;
        });
      }
      setReaders(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách độc giả từ Backend:", err);
    }
  };

  useEffect(() => {
    fetchReaders();
  }, [readerSearch, statusFilter]);

  const handleAddReaderClick = () => {
    setIsEditingReader(false);
    setReaderForm({ name: '', email: '', phone: '', status: 'Active' });
    setShowReaderModal(true);
  };

  const handleEditReaderClick = (reader) => {
    setIsEditingReader(true);
    setCurrentReaderId(reader.id);
    setReaderForm({
      name: reader.first_name || reader.name || '', // Linh động theo trường của User Model Django
      email: reader.email,
      phone: reader.profile?.phone || reader.phone || '',
      status: reader.profile?.status || reader.status || 'Active'
    });
    setShowReaderModal(true);
  };

  // 2. Hàm xử lý thay đổi nhanh trạng thái Khóa / Mở khóa thẻ độc giả trực tiếp trên bảng
  const handleToggleStatus = async (reader) => {
    const currentStatus = reader.profile?.status || reader.status || 'Active';
    const nextStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    const confirmMsg = currentStatus === 'Active' 
      ? `Bạn có chắc muốn KHÓA thẻ của độc giả ${reader.first_name || reader.name}?`
      : `Mở khóa thẻ cho độc giả ${reader.first_name || reader.name}?`;

    if (window.confirm(confirmMsg)) {
      try {
        // Gửi lệnh PATCH cập nhật riêng trường trạng thái lên Django
        await axios.patch(`http://127.0.0.1:8000/api/users/${reader.id}/`, {
          profile: { status: nextStatus } // Cấu trúc tùy thuộc vào serializer lồng của bạn
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Cập nhật trạng thái độc giả thành công!");
        fetchReaders();
      } catch (err) {
        console.error(err);
        alert("Không thể thay đổi trạng thái tài khoản này!");
      }
    }
  };

  return (
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
            placeholder="Tìm theo Họ Tên hoặc Email..." 
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
                <th className="py-3 px-4" style={{ width: '80px' }}>STT</th>
                <th className="py-3">Họ và Tên</th>
                <th className="py-3">Email liên hệ</th>
                <th className="py-3" style={{ width: '220px' }}>Trạng thái thẻ</th>
                <th className="py-3 text-center" style={{ width: '150px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {readers.length > 0 ? (
                readers.map((reader, index) => {
                  const rStatus = reader.profile?.status || reader.status || 'Active';
                  return (
                    <tr key={reader.id} style={{ backgroundColor: rStatus === 'Blocked' ? '#fdf2f2' : 'transparent' }}>
                      <td className="py-3 px-4 fw-bold text-secondary">{index + 1}</td>
                      <td className="py-3 fw-bold text-dark">{reader.first_name || reader.name || reader.username}</td>
                      <td className="py-3 text-muted">{reader.email}</td>
                      <td className="py-3">
                        {rStatus === 'Active' ? (
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
                          <button type="button" className="btn p-1 border-0 bg-transparent text-primary" onClick={() => handleEditReaderClick(reader)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg>
                          </button>
                          
                          {/* Nút Khóa / Mở khóa thẻ đồng bộ Icon ổ khóa theo trạng thái thực */}
                          <button 
                            type="button" 
                            className={`btn p-1 border-0 bg-transparent ${rStatus === 'Active' ? 'text-warning' : 'text-success'}`} 
                            onClick={() => handleToggleStatus(reader)}
                          >
                            {rStatus === 'Active' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/></svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M11 1a2 2 0 0 0-2 2v4H2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1V3a1 1 0 0 1 2 0v2a.5.5 0 0 0 1 0V3a2 2 0 0 0-2-2M0 9a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1z"/></svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="5" className="text-center py-5 text-muted small">Không tìm thấy kết quả độc giả phù hợp từ hệ thống...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReaderModal 
        isOpen={showReaderModal}
        isEditingReader={isEditingReader}
        readerForm={readerForm}
        setReaderForm={setReaderForm}
        currentReaderId={currentReaderId}
        onClose={() => setShowReaderModal(false)}
        onSuccess={() => {
          setShowReaderModal(false);
          fetchReaders(); // Tải lại bảng sau khi lưu thành công
        }}
      />
    </div>
  );
};

export default ReaderManager;