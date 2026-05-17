import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import Dashboard from './pages/Dashboard/Dashboard'; 
import StudentDashboard from './pages/StudentDashboard/StudentDashboard';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const token = localStorage.getItem('access_token');
  const isStaff = localStorage.getItem('is_staff'); 

  // Nếu không có token mới ép về Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && isStaff !== 'true') {
    return <Navigate to="/student" replace />;
  }

  if (!requireAdmin && isStaff === 'true') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route 
          path="/admin" 
          element = {
            <ProtectedRoute requireAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/student" 
          element = {
            <ProtectedRoute requireAdmin={false}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="*" 
          element = {
            <Navigate 
              to={
                localStorage.getItem('access_token') 
                  ? (localStorage.getItem('is_staff') === 'true' ? '/admin' : '/student')
                  : '/login'
              } 
              replace 
            />
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;