import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Stack,
} from '@mui/material';
// icon
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { createSuppliers } from '~/data/mutation/supplier/suppliers-mutation';
// api


const AddSupplierFrom = ({ open, onClose, onSave }) => {
    const [openMsg, setOpenMsg] = React.useState(false);

    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [taxCode, setTaxCode] = useState('');
    const [address, setAddress] = useState('');

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
        const supplierParams = {
            code,
            name,
            phone,
            email,
            taxCode,
            address,
        };
        try {
            const response = await createSuppliers(supplierParams);
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
            <DialogTitle>Thêm nhà cung cấp</DialogTitle>
            <DialogContent style={{ minWidth: 500 }}>

                <Stack spacing={2} margin={2} >
                    <TextField
                        variant="outlined"
                        value={code}
                        label="Mã người bán"
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        value={name}
                        label="Tên người bán"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        value={phone}
                        label="Số điện thoại"
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        value={email}
                        label="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        value={taxCode}
                        label="taxCode"
                        onChange={(e) => setTaxCode(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        value={address}
                        label="Địa chỉ"
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </Stack>
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
            </DialogContent>
        </Dialog>
    );
};

export default AddSupplierFrom;