import {
    Button,
    DialogContent,
    IconButton,
    Stack,
    TextField,
} from '@mui/material';
import React, { useState } from 'react';

import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
// api
import { createBrands } from '~/data/mutation/brand/brands-mutation';
import CloseIcon from '@mui/icons-material/Close';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';

const BrandForm = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [nameError, setNameError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);
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
        } else if (message === 'Brand name was existed') {
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
            <Button color="secondary" size="small" onClick={handleClose}>
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="lage" />
            </IconButton>
        </React.Fragment>
    );
    const handleCloseSnackbar = () => {
        setOpen(false);
        setOpen1(false);
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


    const handleCreateBrand = async () => {
        const unitParams = {
            name,
            description,
        };
        try {
            const response = await createBrands(unitParams);
            console.log('Create brand response:', response.data);
            if (response.status === "200 OK") {
                handleSuccessMessage(response.message);
                handleCloseSnackbar();
                props.onClose(response.data, response.message);
            }
        } catch (error) {
            console.error('Error creating brand:', error);
            handleErrorMessage(error.response?.data?.message)
        }
    };

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <DialogContent>
                    {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
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
                        <Button color="primary" variant="contained" onClick={handleCreateBrand}>
                            Tạo
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
                    </Stack>
                </DialogContent>
            </div>
        </>
    );
};

export default BrandForm;
