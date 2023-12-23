import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton } from '@mui/material';
// api
import { createCategories } from '~/data/mutation/categories/categories-mutation';

import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';

import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import SnackbarError from '~/components/alert/SnackbarError';

const AddCategoryForm = ({ open, onClose, onSave }) => {
    const [openAddCategory, setOpenAddCategory] = React.useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    //thông báo
    const [errorMessage, setErrorMessage] = useState('');
    const [open1, setOpen1] = React.useState(false);

    //========================== Hàm notification của trang ==================================

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Category name was existed') {
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

        setOpenAddCategory(false);
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
        const categoriesParams = {
            name: categoryName,
            description: categoryDescription,
        };
        try {
            const response = await createCategories(categoriesParams);
            if (response.status === '200 OK') {

                onSave && onSave(response.message);
                // Đóng form
                onClose && onClose();
            }
        } catch (error) {
            console.error("Can't fetch category", error);
            const errorMessage = error.response?.data?.data?.[0] || error.response?.data?.message;

            handleErrorMessage(errorMessage);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Thêm nhóm hàng</DialogTitle>
            <DialogContent>
                <TextField
                    label="Tên nhóm hàng"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={categoryName}
                    onChange={(e) => setCategoryName(capitalizeFirstLetter(e.target.value))}
                />
                <TextField
                    label="Mô tả nhóm hàng"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(capitalizeFirstLetter(e.target.value))}
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

export default AddCategoryForm;
