import React from 'react';

const BookModal = ({ isOpen, isEditing, bookForm, setBookForm, categories, onClose, onSave }) => {
  // 1. Kiểm tra an toàn: Nếu không mở modal thì không render gì cả
  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '600px' }}>
        <div className="modal-content border-0 shadow-lg rounded-4 p-2 bg-white">
          <div className="modal-header border-0 pt-3 px-4 d-flex align-items-center">
            <h5 className="modal-title fw-bold text-dark fs-4 m-0">
              {isEditing ? 'Cập Nhật Thông Tin Sách' : 'Thêm Sách Mới Vào Kho'}
            </h5>
            <button type="button" className="btn-close ms-auto" onClick={onClose}></button>
          </div>
          
          <form onSubmit={onSave}>
            <div className="modal-body px-4 pt-2">
              {/* Tên sách */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small mb-1">Tên sách <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control py-2 px-3 border shadow-sm bg-white text-dark" 
                  placeholder="Nhập tên đầu sách..." 
                  required 
                  value={bookForm?.title || ''} 
                  onChange={e => setBookForm({...bookForm, title: e.target.value})} 
                  style={{ borderRadius: '8px', fontSize: '14px' }} 
                />
              </div>

              <div className="row mb-3">
                {/* Tác giả */}
                <div className="col-6">
                  <label className="form-label fw-semibold text-secondary small mb-1">Tác giả <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control py-2 px-3 border shadow-sm bg-white text-dark" 
                    placeholder="Tên tác giả..." 
                    required 
                    value={bookForm?.author || ''} 
                    onChange={e => setBookForm({...bookForm, author: e.target.value})} 
                    style={{ borderRadius: '8px', fontSize: '14px' }} 
                  />
                </div>

                {/* Thể loại */}
                <div className="col-6">
                  <label className="form-label fw-semibold text-secondary small mb-1">Thể loại <span className="text-danger">*</span></label>
                  <select 
                    className="form-select py-2 px-3 border shadow-sm bg-white text-dark" 
                    required 
                    value={bookForm?.category || ''} 
                    onChange={e => setBookForm({...bookForm, category: e.target.value})} 
                    style={{ borderRadius: '8px', fontSize: '14px' }}
                  >
                    <option value="">-- Chọn thể loại --</option>
                    {/* BẢO VỆ CHỐNG CRASH: Kiểm tra categories tồn tại và là mảng trước khi dùng .map() */}
                    {categories && Array.isArray(categories) && categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Số lượng */}
              <div className="mb-3 w-50">
                <label className="form-label fw-semibold text-secondary small mb-1">Số lượng nhập kho <span className="text-danger">*</span></label>
                <input 
                  type="number" 
                  className="form-control py-2 px-3 border shadow-sm bg-white text-dark" 
                  required 
                  min="0" 
                  value={bookForm?.stock ?? 0} 
                  onChange={e => setBookForm({...bookForm, stock: parseInt(e.target.value) || 0})} 
                  style={{ borderRadius: '8px', fontSize: '14px' }} 
                />
              </div>
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
                className="btn btn-primary px-4 py-2 fw-semibold shadow-sm" 
                style={{ borderRadius: '8px', backgroundColor: '#2563eb', border: 'none', fontSize: '14px' }}
              >
                Lưu thông tin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookModal;