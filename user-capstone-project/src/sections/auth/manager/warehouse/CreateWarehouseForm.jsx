import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton } from '@mui/material';

import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
// api
import { createWarehouse } from '~/data/mutation/warehouse/warehouse-mutation';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';
import CloseIcon from '@mui/icons-material/Close';


const CreateWarehouseForm = ({ onSave, props }) => {
    const [warehouseName, setWarehouseName] = useState('');
    const [warehouseAddress, setWarehouseAddress] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    //thông báo
    //========================== Hàm notification của trang ==================================
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Create category successfully') {
            setSuccessMessage('Tạo nhóm hàng thành công');
        } else if (message === 'Update SubCategory successfully.') {
            setSuccessMessage('Cập nhập danh mục thành công');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Warehouse name was existed') {
            setErrorMessage('Tên bị trùng lặp !');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        console.log('Closing Snackbar...');
        setOpen(false);
        setOpen1(false);
        setSuccessMessage('');
        setErrorMessage('');
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
        setOpen(false);
        setOpen1(false);
    };
    //============================================================

    const handleSave = async () => {
        const warehouseParams = {
            name: warehouseName,
            address: warehouseAddress,
        };
        try {
            const response = await createWarehouse(warehouseParams);

            if (response.status === '200 OK') {
                handleSuccessMessage(response.message);
                handleCloseSnackbar();
                props.onClose(response.data, response.message);
            }
        } catch (error) {
            console.error("can't feaching category", error);
            handleErrorMessage(error.response?.data?.message);
        }
    };

    return (
        <>
            <DialogContent sx={{ width: 500 }}>
                <TextField
                    label="Tên kho"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={warehouseName}
                    onChange={(e) => setWarehouseName(capitalizeFirstLetter(e.target.value))}
                />
                <TextField
                    helperText="Địa chỉ phải có từ 1 đến 200 ký tự."
                    label="Địa chỉ kho"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={warehouseAddress}
                    onChange={(e) => setWarehouseAddress(capitalizeFirstLetter(e.target.value))}
                />
            </DialogContent>
            <div style={{ padding: '16px' }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    lưu
                </Button>
                <SnackbarSuccess
                    open={open}
                    handleClose={handleCloseSnackbar}
                    message={successMessage}
                    action={action}
                    style={{ bottom: '16px', right: '16px' }}
                />
                <SnackbarError
                    open={open1}
                    handleClose={handleCloseSnackbar}
                    message={errorMessage}
                    action={action}
                    style={{ bottom: '16px', right: '16px' }}
                />
            </div>
        </>
    );
};

export default CreateWarehouseForm;
