import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton } from '@mui/material';
// api
import { createCategories } from '~/data/mutation/categories/categories-mutation';

import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';

const AddCategoryForm = ({ open, onClose, onSave }) => {
    const [openAddCategory, setOpenAddCategory] = React.useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    //thông báo
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    //========================== Hàm notification của trang ==================================
    const handleMessage = (message) => {
        setOpenAddCategory(true);
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

        setOpenAddCategory(false);

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
        const categoriesParams = {
            name: categoryName,
            description: categoryDescription,
        };
        try {
            const response = await createCategories(categoriesParams);
            if (response.status === '200 OK') {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.data.message);

                handleMessage(response.message);
                onSave && onSave();
                // Đóng form
                onClose && onClose();
            }
        } catch (error) {
            console.error("Can't fetch category", error);
            setIsError(true);
            setIsSuccess(false);
            if (error.response?.data?.message === 'Invalid request') {
                setErrorMessage('Yêu cầu không hợp lệ');
            }
            if (error.response?.data?.message === 'Name was existed') {
                setErrorMessage('Nhóm hàng này đã tồn tại !');
            }
            if (error.response) {
                console.log('Error response:', error.response.data.message);
            }
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
                {isSuccess && <SuccessAlerts message={successMessage} />}
                {isError && <ErrorAlerts errorMessage={errorMessage} />}
            </DialogContent>
            <div style={{ padding: '16px' }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    lưu
                </Button>
                <Snackbar
                    open={openAddCategory}
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

export default AddCategoryForm;
