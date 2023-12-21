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
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { createSuppliers } from '~/data/mutation/supplier/suppliers-mutation';
import SnackbarError from '~/components/alert/SnackbarError';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
// api


const AddSupplierFrom = ({ open, onClose, onSave }) => {

    // const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [taxCode, setTaxCode] = useState('');
    const [address, setAddress] = useState('');

    //========================== Hàm notification của trang ==================================

    const [errorMessage, setErrorMessage] = useState('');
    const [open1, setOpen1] = React.useState(false);

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'taxCode: Tax code cannot be null') {
            setErrorMessage('Vui lòng nhập mã số thuế !');
        } else if (message === 'taxCode: Required field.') {
            setErrorMessage('Vui lòng nhập mã số thuế !');
        } else if (message === 'address: size must be between 1 and 300') {
            setErrorMessage('Địa chỉ phải từ 1 - 300 ký tự !');
        } else if (message === 'name: The first letter must be uppercase.') {
            setErrorMessage('Chữ cái đầu phải viết hoa !');
        } else if (message === 'name: Required field.') {
            setErrorMessage('Vui lòng nhập tên !');
        } else if (message === 'email: Invalid email format.') {
            setErrorMessage('Email không đúng định dạng !');
        } else if (message === 'email: Email cannot be null') {
            setErrorMessage('Vui lòng nhập Email !');
        } else if (message === 'address: Address cannot be null') {
            setErrorMessage('Vui lòng nhập Địa chỉ !');
        } else if (message === 'name: size must be between 1 and 100') {
            setErrorMessage('Tên chỉ phải từ 1 - 100 ký tự !');
        } else if (message === 'Phone number already in use!') {
            setErrorMessage('Số điện thoại đã được sử dụng !');
        } else if (message === 'Email already in use!') {
            setErrorMessage('Email đã được sử dụng !');
        } else if (message === 'Tax code already in use!') {
            setErrorMessage('Mã số thuế đã được sử dụng !');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen1(false);
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}></Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="lage" />
            </IconButton>
        </React.Fragment>
    );

    const handleCloseSnackbar = () => {
        setOpen1(false);
        setOpen1('');
    };
    //============================================================

    const handleSave = async () => {
        const supplierParams = {
            // code,
            name,
            phone,
            email,
            taxCode,
            address,
        };
        try {
            const response = await createSuppliers(supplierParams);
            onSave && onSave(response.message);
            // Đóng form
            onClose && onClose();
        } catch (error) {
            console.error("can't feaching category", error);
            const errorMessage = error.response?.data?.data?.[0] || error.response?.data?.message;

            handleErrorMessage(errorMessage);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Thêm nhà cung cấp</DialogTitle>
            <DialogContent style={{ minWidth: 500 }}>

                <Stack spacing={2} margin={2} >
                    {/* <TextField
                        variant="outlined"
                        value={code}
                        label="Mã nhà cung cấp"
                        onChange={(e) => setCode(e.target.value)}
                    /> */}
                    <TextField
                        variant="outlined"
                        value={name}
                        label="Tên nhà cung cấp"
                        onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
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
                        label="Mã số thuế "
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
                    <SnackbarError
                        open={open1}
                        handleClose={handleCloseSnackbar}
                        message={errorMessage}
                        action={action}
                        style={{ bottom: '16px', right: '16px' }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddSupplierFrom;