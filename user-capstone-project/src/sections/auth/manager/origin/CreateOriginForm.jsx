import { Button, DialogContent, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
//icon
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';

// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createOrigins } from '~/data/mutation/origins/origins-mutation';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';

import SnackbarError from '~/components/alert/SnackbarError';

const CreateOriginForm = (props) => {
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    //========================== Hàm notification của trang ==================================

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Create origin successfully') {
            setSuccessMessage('Tạo thành công');
        } else if (message === 'Update SubCategory successfully.') {
            setSuccessMessage('Cập nhập danh mục thành công');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Origin name was existed') {
            setErrorMessage('Tên nguồn gốc bị trùng !');
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

    const handleNameChange = (e) => {
        const newName = capitalizeFirstLetter(e.target.value);
        setName(newName);

        setNameError(validateName(newName));
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

    const handleCreateOrigins = async () => {
        const originParams = {
            name,
        };
        try {
            const response = await createOrigins(originParams);
            console.log('Create origin response:', response);
            if (response.status === '200 OK') {
                handleSuccessMessage(response.message);
                props.onClose(response.data, response.message);
            }
        } catch (error) {
            console.error('Error creating origin:', error);
            handleErrorMessage(error.response?.data?.message)
        }
    };

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <DialogContent>
                    <Stack spacing={2} margin={2}>
                        <TextField
                            helperText={nameError}
                            error={Boolean(nameError)}
                            variant="outlined"
                            value={name}
                            label="Tên xuất xứ"
                            onChange={handleNameChange}
                        />
                        <Button color="primary" variant="contained" onClick={handleCreateOrigins}>
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

export default CreateOriginForm;
