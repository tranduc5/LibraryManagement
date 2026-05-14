import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
            // Lưu token vào trình duyệt
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            
            alert('Đăng nhập thành công!');
            // Chuyển hướng về trang chủ Dashboard
            window.location.href = "/"; 
        } catch (error) {
            console.error(error);
            alert('Tài khoản hoặc mật khẩu không đúng!');
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">LMS ADMIN</h2>
                    <p className="text-muted">Đăng nhập để quản lý thư viện</p>
                </div>
                
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Tên đăng nhập</label>
                        <input 
                            type="text" 
                            className="form-control form-control-lg"
                            placeholder="Nhập username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Mật khẩu</label>
                        <input 
                            type="password" 
                            className="form-control form-control-lg"
                            placeholder="Nhập password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm">
                        ĐĂNG NHẬP
                    </button>
                </form>
                
                <div className="text-center mt-4">
                    <small className="text-muted">© 2026 Library Management System - Trần Đức</small>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;