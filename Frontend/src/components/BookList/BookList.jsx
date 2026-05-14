import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookList = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // Gọi API từ Backend Django của Trần Đức
        axios.get('http://127.0.0.1:8000/api/books/')
            .then(res => setBooks(res.data))
            .catch(err => console.error("Lỗi rồi Đức ơi:", err));
    }, []);

    return (
        <div className="mt-4">
            <h4 className="mb-3">Danh Sách Sách Trong Kho</h4>
            <div className="table-responsive bg-white p-3 shadow-sm rounded">
                <table className="table table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Ảnh</th>
                            <th>Tên sách</th>
                            <th>Tác giả</th>
                            <th>Thể loại</th>
                            <th>Số lượng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.id}>
                                <td>
                                    <img src={book.image || 'https://via.placeholder.com/50'} 
                                         alt="cover" style={{width: '40px', height: '50px', objectFit: 'cover'}} />
                                </td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td><span className="badge bg-info text-dark">{book.category_detail?.name}</span></td>
                                <td>{book.stock}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary">Mượn sách</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookList;