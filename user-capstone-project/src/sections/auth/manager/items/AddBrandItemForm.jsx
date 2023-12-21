import { Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
// icon
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
// api
import { createBrands } from '~/data/mutation/brand/brands-mutation';
import SnackbarError from '~/components/alert/SnackbarError';

const AddBrandItemForm = ({ open, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [nameError, setNameError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);
    //thông báo
    const [errorMessage, setErrorMessage] = useState('');
    const [open1, setOpen1] = React.useState(false);

    //========================== Hàm notification của trang ==================================

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Brand name was existed') {
            setErrorMessage('Tên bị trùng lặp !');
        } else if (message === 'unit_mea_id: Unit of measurement id is required') {
            setErrorMessage('Vui lòng chọn đơn vị đo lường !');
        } else if (message === 'unit_id: Required field') {
            setErrorMessage('Vui lòng chọn đơn vị !');
        } else if (message === 'name: size must be between 1 and 100') {
            setErrorMessage('Tên phải từ 1 - 100 ký tự !');
        } else if (message === 'name: Name of product not null') {
            setErrorMessage('Tên không được để trống !');
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setNameError(null);
        setDescriptionError(null);
        setErrorMessage('');
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        resetForm();
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

    const validateDescription = (value) => {
        if (!value.trim()) {
            return "Mô tả hàng hóa không được để trống.";
        }
        return null;
    };

    const handleNameChange = (e) => {
        const newName = capitalizeFirstLetter(e.target.value);
        setName(newName);

        setNameError(validateName(newName));
    };

    const handleDescriptionChange = (e) => {
        const newDescription = capitalizeFirstLetter(e.target.value);
        setDescription(newDescription);

        setDescriptionError(validateDescription(newDescription));
    };
    //============================================================

    const handleSave = async () => {
        const originParams = {
            name,
            description,
        };
        try {
            const response = await createBrands(originParams);
            console.log(response);
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
            <DialogTitle>Thêm thương hiệu</DialogTitle>
            <DialogContent sx={{ width: 500 }}>
                <Stack spacing={2} margin={2}>
                    <TextField
                        helperText={nameError}
                        error={Boolean(nameError)}
                        variant="outlined"
                        value={name}
                        label="Tên đơn vị"
                        onChange={handleNameChange}
                    />
                    <TextField
                        helperText={descriptionError}
                        error={Boolean(descriptionError)}
                        variant="outlined"
                        value={description}
                        multiline
                        rows={3}
                        label="Mô tả"
                        onChange={handleDescriptionChange}
                    />
                    <Button color="primary" variant="contained" onClick={handleSave}>
                        Tạo thêm
                        <SnackbarError
                            open={open1}
                            handleClose={handleCloseSnackbar}
                            message={errorMessage}
                            action={action}
                            style={{ bottom: '16px', right: '16px' }}
                        />
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default AddBrandItemForm;
