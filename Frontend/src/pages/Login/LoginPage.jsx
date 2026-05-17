import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username,
                password
            });
            
            // 1. Lưu các token vào trình duyệt
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            
            // 2. Lưu thông tin phân quyền role dựa trên phản hồi của Django Backend
            const userIsStaff = response.data.is_staff ?? (username === 'admin'); 
            localStorage.setItem('is_staff', userIsStaff.toString());
            
            alert('Đăng nhập thành công!');
            
            // 3. ĐIỀU HƯỚNG CHUẨN PHÂN QUYỀN LẬP TỨC
            if (userIsStaff === true || userIsStaff === 'true') {
                window.location.href = "/admin";
            } else {
                window.location.href = "/student";
            }
        } catch (error) {
            console.error(error);
            alert('Tài khoản hoặc mật khẩu không đúng!');
        }
    };

    return (
        <div className="container-fluid vh-100 p-0 overflow-hidden">
            <div className="row g-0 h-100">
                {/* BÊN TRÁI: KHÔNG GIAN HÌNH ẢNH THƯ VIỆN ĐỘC ĐÁO */}
                <div className="col-md-7 d-none d-md-block h-100">
                    <div className="login-image-side">
                        <div className="login-image-overlay d-flex flex-column justify-content-end p-5 text-white">
                        </div>
                    </div>
                </div>
                
                {/* BÊN PHẢI: FORM ĐĂNG NHẬP HIỆN ĐẠI */}
                <div className="col-md-5 d-flex align-items-center justify-content-center bg-white h-100">
                    <div className="p-4 p-sm-5 w-100" style={{ maxWidth: '440px' }}>
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-primary">LMS SYSTEM</h2>
                            <p className="text-muted">Đăng nhập để truy cập vào thư viện</p>
                        </div>
                        
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold small text-secondary">Tên đăng nhập</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg bg-light border-0 shadow-none px-3"
                                    placeholder="Nhập username..."
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="form-label fw-semibold small text-secondary">Mật khẩu</label>
                                <input 
                                    type="password" 
                                    className="form-control form-control-lg bg-light border-0 shadow-none px-3"
                                    placeholder="Nhập password..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm py-3 text-uppercase tracking-wide">
                                ĐĂNG NHẬP
                            </button>
                        </form>
                        
                        <div className="text-center mt-5">
                            <small className="text-muted">© 2026 Library Management System - Trần Đức</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;