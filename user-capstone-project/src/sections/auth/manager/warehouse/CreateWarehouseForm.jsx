import React, { useState } from 'react';
import { DialogContent, TextField, Button, IconButton } from '@mui/material';

import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
// api
import { createWarehouse } from '~/data/mutation/warehouse/warehouse-mutation';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';
import CloseIcon from '@mui/icons-material/Close';


const CreateWarehouseForm = (props) => {
    const [warehouseName, setWarehouseName] = useState('');
    const [warehouseAddress, setWarehouseAddress] = useState('');
    const [warehouseNameError, setWarehouseNameError] = useState('');
    const [warehouseAddressError, setWarehouseAddressError] = useState('');
    //thông báo
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    //========================== Hàm notification của trang ==================================
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
    const validateName = (value) => {
        if (!value.trim()) {
            return "Tên hàng hóa không được để trống"
        } else if (!/^\p{Lu}/u.test(value)) {
            return "Chữ cái đầu phải in hoa.";
        }

        return null;
    };

    const validateAdress = (value) => {
        if (!value.trim()) {
            return "Mô tả hàng hóa không được để trống.";
        }
        return null;
    };
    const handleWarehouseNameChange = (e) => {
        const newName = capitalizeFirstLetter(e.target.value);
        setWarehouseName(newName);

        setWarehouseNameError(validateName(newName));
    };

    const handleWarehouseAddressChange = (e) => {
        const newAddress = capitalizeFirstLetter(e.target.value);
        setWarehouseAddress(newAddress);

        setWarehouseAddressError(validateAdress(newAddress));
    };
    //============================================================
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
                    helperText={warehouseNameError}
                    error={Boolean(warehouseNameError)}
                    label="Tên kho"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={warehouseName}
                    onChange={handleWarehouseNameChange}
                />
                <TextField
                    helperText={warehouseAddressError}
                    error={Boolean(warehouseAddressError)}
                    label="Địa chỉ kho"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={warehouseAddress}
                    onChange={handleWarehouseAddressChange}
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
