import React, { useState } from 'react';

const TransactionModal = ({ isOpen, onClose, onSave, books = [] }) => {
  const [formData, setFormData] = useState({
    readerName: '',
    phone: '',
    email: '',
    bookId: '',
    borrowDate: '2026-05-15', // Set mặc định theo form mẫu
    dueDate: '2026-05-29'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: '600px' }}>
        <div className="modal-content border-0 shadow-lg rounded-4 p-2">
          
          <div className="modal-header border-0 pt-3 px-4">
            <h5 className="modal-title fw-bold text-dark fs-4">Tạo Phiếu Mượn</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body px-4 pt-2">
              
              {/* Tên độc giả */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small mb-1">
                  Tên Độc Giả <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  className="form-control py-2 px-3 bg-white border border-light-subtle shadow-sm" 
                  placeholder="Nhập họ và tên..."
                  required 
                  value={formData.readerName}
                  onChange={e => setFormData({...formData, readerName: e.target.value})}
                  style={{ borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              {/* Số điện thoại & Email */}
              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold text-secondary small mb-1">
                    Số điện thoại <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    className="form-control py-2 px-3 bg-white border border-light-subtle shadow-sm" 
                    placeholder="Nhập số điện thoại..."
                    required 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    style={{ borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold text-secondary small mb-1">
                    Email liên hệ
                  </label>
                  <input 
                    type="email" 
                    className="form-control py-2 px-3 bg-white border border-light-subtle shadow-sm" 
                    placeholder="Ví dụ: name@gmail.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    style={{ borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* Sách mượn */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small mb-1">
                  Sách Mượn <span className="text-danger">*</span>
                </label>
                <select 
                  className="form-select py-2 px-3 bg-white border border-light-subtle shadow-sm text-muted"
                  required
                  value={formData.bookId}
                  onChange={e => setFormData({...formData, bookId: e.target.value})}
                  style={{ borderRadius: '8px', fontSize: '14px' }}
                >
                  <option value="">-- Chọn sách từ thư viện --</option>
                  {books.map(book => (
                    <option key={book.id} value={book.id}>{book.title} ({book.author})</option>
                  ))}
                  {/* Option fallback nếu chưa có dữ liệu backend */}
                  {books.length === 0 && (
                    <>
                      <option value="1">Python (Công nghệ thông tin)</option>
                      <option value="2">C++ (Công nghệ thông tin)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Ngày mượn & Hạn trả */}
              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold text-secondary small mb-1">
                    Ngày mượn <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="date" 
                    className="form-control py-2 px-3 bg-white border border-light-subtle shadow-sm" 
                    required 
                    value={formData.borrowDate}
                    onChange={e => setFormData({...formData, borrowDate: e.target.value})}
                    style={{ borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold text-secondary small mb-1">
                    Hạn trả (Dự kiến) <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="date" 
                    className="form-control py-2 px-3 bg-white border border-light-subtle shadow-sm" 
                    required 
                    value={formData.dueDate}
                    onChange={e => setFormData({...formData, dueDate: e.target.value})}
                    style={{ borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-light px-4 py-2 fw-semibold text-secondary border border-light-subtle" 
                onClick={onClose}
                style={{ borderRadius: '8px', backgroundColor: '#fff', fontSize: '14px' }}
              >
                Hủy bỏ
              </button>
              <button 
                type="submit" 
                className="btn btn-success px-4 py-2 fw-semibold text-white shadow-sm"
                style={{ borderRadius: '8px', backgroundColor: '#4ade80', border: 'none', fontSize: '14px' }}
              >
                Xác nhận tạo phiếu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;