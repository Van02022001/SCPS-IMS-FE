import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
} from '@mui/material';
// icon
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// api
import { createOrigins } from '~/data/mutation/origins/origins-mutation';

const AddOriginItemForm = ({ open, onClose, onSave }) => {
    const [openMsg, setOpenMsg] = React.useState(false);
    const [originName, setOriginName] = useState('');
    const [message, setMessage] = useState('');

    //========================== Hàm notification của trang ==================================
    const handleMessage = (message) => {
        setOpenMsg(true);
        // Đặt logic hiển thị nội dung thông báo từ API ở đây
        if (message === 'Update SubCategory status successfully.') {
            setMessage('Cập nhập trạng thái danh mục thành công')
        } else if (message === 'Update SubCategory successfully.') {
            setMessage('Cập nhập danh mục thành công')
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenMsg(false);

    };
    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="lage" />
            </IconButton>
        </React.Fragment>
    );
    //============================================================

    const handleSave = async () => {
        const originParams = {
            name: originName,
        }
        try {
            const response = await createOrigins(originParams);
            console.log(response);
            onSave && onSave();
            // Đóng form
            onClose && onClose();
            handleMessage(response.message);
        } catch (error) {
            console.error("can't feaching category", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Thêm xuất sứ</DialogTitle>
            <DialogContent sx={{ width: 500 }}>
                <TextField
                    label="Tên xuất xứ"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={originName}
                    onChange={(e) => setOriginName(e.target.value)}
                />
            </DialogContent>
            <div style={{ padding: '16px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                >
                    Tạo thêm
                </Button>
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    message={message}
                    action={action}
                    style={{ bottom: '16px', right: '16px' }}
                />
            </div>
        </Dialog>
    );
};

export default AddOriginItemForm;