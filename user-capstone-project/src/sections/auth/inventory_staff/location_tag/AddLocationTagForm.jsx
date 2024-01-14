import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton } from '@mui/material';
// api
import { createCategories } from '~/data/mutation/categories/categories-mutation';

import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import { createLocations_tag } from '~/data/mutation/location_tag/location_tag-mutaion';
import SnackbarError from '~/components/alert/SnackbarError';

const AddLocationTagForm = ({ open, onClose, onSave }) => {
    const [openAddCategory, setOpenAddCategory] = React.useState(false);
    const [name, setName] = useState('');
    //========================== Hàm notification của trang ==================================
    const [open1, setOpen1] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Name of location tag was existed.') {
            setErrorMessage('Nhãn đã tồn tại !');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen1(false);
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

    //========================== Hàm notification của trang ==================================

    const handleSave = async () => {
        const locations_tagParams = {
            name: name,
        };
        try {
            const response = await createLocations_tag(locations_tagParams);
            if (response.status === '200 OK') {
                onSave && onSave(response.message, response.data);
                // Đóng form
                onClose && onClose();
            }
        } catch (error) {
            console.error("Can't fetch category", error);
            handleErrorMessage(error.response.data.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Thêm Nhãn</DialogTitle>
            <DialogContent>
                <TextField
                    label="Tên nhãn"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
                />
            </DialogContent>
            <div style={{ padding: '16px' }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    lưu
                </Button>
                <SnackbarError
                    open={open1}
                    handleClose={handleClose}
                    message={errorMessage}
                    action={action}
                    style={{ bottom: '16px', right: '16px' }}
                />
            </div>
        </Dialog>
    );
};

export default AddLocationTagForm;
