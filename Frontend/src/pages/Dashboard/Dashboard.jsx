import React, { useState } from 'react';
import SideBar from '../../components/SideBar/SideBar';
import NavBar from '../../components/NavBar/NavBar';
import Insight from '../../components/Insight/Insight';
import BookList from '../../components/BookList/BookList';

import BookManager from './components/BookManager';
import ReaderManager from './components/ReaderManager';
import TransactionManager from './components/TransactionManager';
import ReportManager from './components/ReportManager';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState('tong-quan');

  const handleGlobalSearch = (term) => {
    setSearchQuery(term);
    if (activeMenu !== 'tong-quan' && term.trim() !== '') {
      setActiveMenu('tong-quan');
    }
  };

  return (
    <div className="d-flex">
      <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <div className="flex-grow-1 bg-light min-vh-100">
        <NavBar onSearch={handleGlobalSearch} />
        
        <div className="p-4">
          {/* MENU 1: TỔNG QUAN */}
          {activeMenu === 'tong-quan' && (
            <>
              <h3 className="fw-bold mb-4">Dashboard Hệ Thống</h3>
              <Insight />
              <BookList searchQuery={searchQuery} />
            </>
          )}

          {/* MENU 2: QUẢN LÝ SÁCH (Sửa đổi: Gọi độc lập, sạch lỗi) */}
          {activeMenu === 'quan-ly-sach' && <BookManager />}

          {/* MENU 3: QUẢN LÝ ĐỘC GIẢ */}
          {activeMenu === 'quan-ly-doc-gia' && <ReaderManager />}

          {/* MENU 4: QUẢN LÝ MƯỢN TRẢ */}
          {activeMenu === 'quan-ly-muon-tra' && <TransactionManager />}

          {/* MENU 5: BÁO CÁO THỐNG KÊ */}
          {activeMenu === 'bao-cao-thong-ke' && <ReportManager />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;