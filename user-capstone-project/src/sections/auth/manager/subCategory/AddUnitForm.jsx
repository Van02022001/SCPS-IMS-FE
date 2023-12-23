import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton } from '@mui/material';

import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';

import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
// api
import { createUnits } from '~/data/mutation/unit/unit-mutation';
import SnackbarError from '~/components/alert/SnackbarError';

const AddUnitForm = ({ open, onClose, onSave }) => {
    const [unitName, setUnitName] = useState('');

    //thông báo
    const [errorMessage, setErrorMessage] = useState('');
    const [open1, setOpen1] = React.useState(false);

    //========================== Hàm notification của trang ==================================

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Unit name was existed') {
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
    //============================================================

    const handleSave = async () => {
        const unitParams = {
            name: unitName,
        };
        try {
            const response = await createUnits(unitParams);

            if (response.status === '200 OK') {
                setUnitName('');
                onSave && onSave(response.message);
                // Đóng form
                onClose && onClose();
            }
        } catch (error) {
            console.error("can't feaching category", error);
            const errorMessage = error.response?.data?.data?.[0] || error.response?.data?.message;

            handleErrorMessage(errorMessage);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Thêm đơn vị</DialogTitle>
            <DialogContent sx={{ width: 500 }}>
                <TextField
                    label="Tên đơn vị"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={unitName}
                    onChange={(e) => setUnitName(capitalizeFirstLetter(e.target.value))}
                />
            </DialogContent>
            <div style={{ padding: '16px' }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    lưu
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

export default AddUnitForm;
