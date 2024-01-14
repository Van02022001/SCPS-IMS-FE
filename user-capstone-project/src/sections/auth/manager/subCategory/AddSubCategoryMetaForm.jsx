import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    IconButton,
} from '@mui/material';

import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import { createSubCategoryMeta } from '~/data/mutation/subCategoryMeta/subCategoryMeta-mutation';
// api




const AddSubCategoryMetaForm = ({ subCategoryMetaId, open, onClose, onSave }) => {
    const [openAddCategoryMeta, setOpenAddCategoryMeta] = React.useState(false);
    const [key, setKey] = useState('');
    const [description, setDescription] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    //thông báo
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    //========================== Hàm notification của trang ==================================
    const handleMessage = (message) => {
        setOpenAddCategoryMeta(true);
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

        setOpenAddCategoryMeta(false);

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
        const subCategoryMetaParams = {
            key: key,
            description: description,
        }
        try {
            const response = await createSubCategoryMeta(subCategoryMetaId, subCategoryMetaParams);

            if (response.status === "200 OK") {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.message);
                console.log(response);

                handleMessage(response.message)
                onSave && onSave();
                // Đóng form
                onClose && onClose();
            }
        } catch (error) {
            console.error("can't feaching sub category", error);
            setIsError(true);
            setIsSuccess(false);
            setErrorMessage(error.response.data.message);
            if (error.response) {
                console.log('Error response:', error.response.data.message);
            }
        }
    };

    console.log(subCategoryMetaId);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Thêm thẻ mô tả</DialogTitle>
            <DialogContent sx={{ width: 500 }}>
                <TextField
                    label="Mô tả sơ lược"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={key}
                    onChange={(e) => setKey(capitalizeFirstLetter(e.target.value))}
                />
                <TextField
                    label="Mô tả chi tiết thêm"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(capitalizeFirstLetter(e.target.value))}
                />
                {isSuccess && <SuccessAlerts message={successMessage} />}
                {isError && <ErrorAlerts errorMessage={errorMessage} />}
            </DialogContent>
            <div style={{ padding: '16px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                >
                    lưu
                </Button>
                <Snackbar
                    open={openAddCategoryMeta}
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

export default AddSubCategoryMetaForm;