import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
} from '@mui/material';
// icon
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
// api
import { createOrigins } from '~/data/mutation/origins/origins-mutation';
import SnackbarError from '~/components/alert/SnackbarError';


const AddOriginItemForm = ({ open, onClose, onSave }) => {
    const [originName, setOriginName] = useState('');
    const [originNameError, setOriginNameError] = useState('');
    //thông báo
    const [errorMessage, setErrorMessage] = useState('');
    const [open1, setOpen1] = React.useState(false);

    //========================== Hàm notification của trang ==================================

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Origin name was existed') {
            setErrorMessage('Tên bị trùng lặp !');
        } else if (message === 'unit_mea_id: Unit of measurement id is required') {
            setErrorMessage('Vui lòng chọn đơn vị đo lường !');
        } else if (message === 'unit_id: Required field') {
            setErrorMessage('Vui lòng chọn đơn vị !');
        } else if (message === 'name: size must be between 1 and 100') {
            setErrorMessage('Tên phải từ 1 - 100 ký tự !');
        } else if (message === 'description: Required field') {
            setErrorMessage('Vui lòng nhập mô tả !');
        } else if (message === 'name: Name of product not null') {
            setErrorMessage('Tên không được để trống !');
        } else if (message === 'description: Description not null') {
            setErrorMessage('Mô tả không được để trống !');
        } else if (message === 'name: The first letter must be uppercase.') {
            setErrorMessage('Chữ cái đầu của tên phải viết hoa !');
        } else if (message === 'description: The first letter must be uppercase.') {
            setErrorMessage('Chữ cái đầu của mô tả phải viết hoa !');
        } else if (message === 'name: Required field.') {
            setErrorMessage('Vui lòng nhập tên !');
        } else if (message === 'SubCategory must have at least one category') {
            setErrorMessage('Vui lòng chọn nhóm hàng !');
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

    const validateName = (value) => {
        if (!value.trim()) {
            return "Tên hàng hóa không được để trống"
        } else if (!/^\p{Lu}/u.test(value)) {
            return "Chữ cái đầu phải in hoa.";
        }

        return null;
    };

    const handleNameChange = (e) => {
        const newName = capitalizeFirstLetter(e.target.value);
        setOriginName(newName);

        setOriginNameError(validateName(newName));
    };
    //============================================================

    const handleSave = async () => {
        const originParams = {
            name: originName,
        }
        try {
            const response = await createOrigins(originParams);
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
            <DialogTitle>Thêm xuất sứ</DialogTitle>
            <DialogContent sx={{ width: 500 }}>
                <TextField
                    helperText={originNameError}
                    error={Boolean(originNameError)}
                    label="Tên xuất xứ"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={originName}
                    onChange={handleNameChange}
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
                <SnackbarError
                    open={open1}
                    handleClose={handleCloseSnackbar}
                    message={errorMessage}
                    action={action}
                    style={{ bottom: '16px', right: '16px' }}
                />
            </div>
        </Dialog>
    );
};

export default AddOriginItemForm;