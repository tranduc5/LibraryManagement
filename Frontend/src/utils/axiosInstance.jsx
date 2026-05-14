import axiosIntance from './axiosInstance';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Cổng của Django
});

// hàm lấy danh sách sách
export const fetchBooks = () => api.get('/book/');
// Hàm lấy danh sách thể loại 
export const fetchCategories = () => api.get('/books/categories/');


export default api;