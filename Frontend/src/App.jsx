import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SideBar from "./components/SideBar/SideBar.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import Insight from "./components/Insight/Insight.jsx";
import BookList from "./components/BookList/BookList.jsx";
import LoginPage from "./pages/Login/LoginPage.jsx";

// 1. Tạo một Component riêng cho Layout Dashboard để code gọn hơn
const AdminLayout = () => {
  // Logic kiểm tra: Nếu chưa có Token thì đá về trang Login
  const isAuthenticated = !!localStorage.getItem('access_token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="d-flex">
      <SideBar />
      <div className="flex-grow-1 bg-light overflow-hidden">
        <NavBar />
        <div className="container-fluid p-4">
          <h3 className="mb-4 fw-bold">Dashboard Quản Lý</h3>
          <Insight />
          <BookList />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Đường dẫn cho trang Login: Không có Sidebar/Navbar */}
        <Route path="/login" element={<LoginPage />} />

        {/* Đường dẫn cho trang Admin: Có đầy đủ Sidebar/Navbar */}
        <Route path="/" element={<AdminLayout />} />

        {/* Nếu vào đường dẫn linh tinh, tự động về trang chủ */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;