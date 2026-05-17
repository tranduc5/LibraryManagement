import React from 'react';

const ReaderModal = ({ isOpen, isEditingReader, readerForm, setReaderForm, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '480px' }}>
        <div className="modal-content border-0 shadow-lg rounded-4 p-2">
          
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
            <button type="button" className="btn-close ms-auto" onClick={onClose}></button>
          </div>

          <form onSubmit={onSave}>
            <div className="modal-body px-4 pt-2">
              
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

            <div className="modal-footer border-0 px-4 pb-4 pt-2">
              <button 
                type="button" 
                className="btn btn-light px-4 py-2 fw-semibold text-secondary border border-light-subtle" 
                onClick={onClose}
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
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757 0 0 1 0-1.06.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
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
  );
};

export default ReaderModal;