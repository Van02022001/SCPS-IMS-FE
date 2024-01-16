import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { format } from 'date-fns';

function NotificationAll({ notifications, onClose }) {
    console.log(notifications, 'AAAAA');
    const translateContentToVietnamese = (type, content, sourceId) => {
        switch (type) {
            case 'CANH_BAO_THUA_HANG':
                return `Thông báo thừa hàng hãy kiểm tra!`;
            case 'CANH_BAO_HET_HANG':
                return `Thông báo hết hàng hãy kiểm tra!`;
            case 'DANG_TIEN_HANH_NHAP_KHO':
                return `Thông báo Đang tiến hành nhập kho!`;
            case 'XAC_NHAN_NHAP_KHO':
                return `Thông báo Xác nhận nhập kho!`;
            default:
                return content;
        }
    };

    const translateTypeToVietnamese = (type) => {
        switch (type) {
            case 'CANH_BAO_THUA_HANG':
                return 'Cảnh báo thừa hàng';
            case 'CANH_BAO_HET_HANG':
                return 'Cảnh báo hết hàng';
            case 'DANG_TIEN_HANH_NHAP_KHO':
                return 'Đang tiến hành nhập kho';
            case 'XAC_NHAN_NHAP_KHO':
                return 'Xác nhận nhập kho';
            default:
                return type;
        }
    };
    return (
        <>
            <div>
                <DialogContent open={notifications.length > 0} onClose={onClose}>
                    {notifications.map((notification) => (
                        <div key={notification.id}>
                            <DialogTitle>{notification.title}</DialogTitle>
                            <DialogContent>
                                {notification.content && (
                                    <Typography variant="body2" color="black">
                                        {translateContentToVietnamese(notification.type, notification.content, notification.sourceId)}
                                    </Typography>
                                )}
                                <Typography variant="caption" color="text.disabled">
                                    {`Loại thông báo: ${translateTypeToVietnamese(notification.type)}`}
                                </Typography>
                                {/* {notification.createdAt && (
                            <Typography variant="caption" color="text.disabled">
                                {`Type: ${translateTypeToVietnamese(notification.type)}`}
                            </Typography>
                        )} */}
                            </DialogContent>
                        </div>
                    ))}
                </DialogContent>
            </div>
        </>
    );
}

NotificationAll.propTypes = {
    notifications: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string,
            createdAt: PropTypes.string, // Assuming createdAt is a string for simplicity
            content: PropTypes.string,
            type: PropTypes.string,
        })
    ),
    onClose: PropTypes.func.isRequired,
};

export default NotificationAll;
