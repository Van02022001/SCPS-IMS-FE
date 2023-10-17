import React, { useEffect, useState } from 'react';
import { Typography, Button, List, ListItem } from '@mui/material';

const OrderDetailForm = ({ orders, orderId, onClose, isOpen }) => {
    const [expandedItem, setExpandedItem] = useState(null);
    const [formHeight, setFormHeight] = useState(0);

    const handleExpandItem = (itemId) => {
        if (expandedItem === itemId) {
            setExpandedItem(null);
            setFormHeight(0); // Đóng form
        } else {
            setExpandedItem(itemId);
            setFormHeight(1000); // Mở form với chiều cao 1000px (hoặc bạn có thể sử dụng giá trị khác).
        }
    };
    useEffect(() => {
        if (isOpen) {
            setFormHeight(1000); // Khi `OrderDetailForm` được mở, đặt kích thước cho nó.
        } else {
            setFormHeight(0); // Khi `OrderDetailForm` được đóng, đặt lại kích thước cho nó.
        }
    }, [isOpen]);

    const order = orders.find((o) => o.id === orderId);

    if (!order) {
        return null;
    }

    const handleSave = () => {
        // Xử lý lưu
    }

    const handleDelete = () => {
        // Xử lý xóa
    }



    return (
        <div
            id="orderDetailForm"
            className="OrderDetailForm"
            style={{
                backgroundColor: 'white',
                zIndex: 999,
            }}
        >
            <List>
                <ListItem
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        transition: 'all 0.3s ease-in-out',
                        marginBottom: expandedItem ? 20 : 0,
                    }}
                >
                    <div style={{ flex: 1 }}>
                        {/* Hiển thị thông tin của item */}
                        <Typography variant="body1">{order.name}</Typography>
                        <Typography variant="body1">{order.company}</Typography>
                        <Button
                            variant="outlined"
                            onClick={() => handleExpandItem(orderId)}
                        >
                            {expandedItem === order.id ? 'Thu nhỏ' : 'Mở rộng'}
                        </Button>
                    </div>
                    {expandedItem === order.id && (
                        <div style={{ flex: 1 }}>
                            {/* Hiển thị form chi tiết ở đây */}
                            <Button variant="contained" color="primary" onClick={handleSave}>
                                Lưu
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={handleDelete}>
                                Xóa
                            </Button>
                            <Typography variant="body1">Tên: {order.name}</Typography>
                            <Typography variant="body1">Địa chỉ: {order.company}</Typography>
                            <Typography variant="body1">Vị trí: {order.role}</Typography>
                            <Typography variant="body1">Khách hàng: {order.isVerified ? 'Yes' : 'No'}</Typography>
                        </div>
                    )}
                </ListItem>
            </List>
        </div>
    );
}

export default OrderDetailForm;
