import React from 'react';
import { Card, Tag, Button } from 'antd';

const BookCard = ({ book }) => {
    return (
        <Card
            hoverable
            style={{ width: 240, marginBottom: 20 }}
            cover={
                <img 
                    alt={book.title} 
                    src={book.image || 'https://via.placeholder.com/150'} 
                    style={{ height: 300, objectFit: 'cover' }}
                />
            }
        >
            <Card.Meta 
                title={book.title} 
                description={`Tác giả: ${book.author}`} 
            />
            <div style={{ marginTop: 10 }}>
                <Tag color="blue">{book.category_detail?.name || 'Chưa phân loại'}</Tag>
                <p style={{ marginTop: 5 }}>Kho: <b>{book.stock}</b></p>
                <Button type="primary" block disabled={book.stock <= 0}>
                    {book.stock > 0 ? 'Mượn ngay' : 'Hết hàng'}
                </Button>
            </div>
        </Card>
    );
};

export default BookCard;