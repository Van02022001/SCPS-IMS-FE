import { Button, DialogContent, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import SnackbarError from '~/components/alert/SnackbarError';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
// api
import { createUnits } from '~/data/mutation/unit/unit-mutation';
import CloseIcon from '@mui/icons-material/Close';

const CreateUnitForm = (props) => {
    const [name, setName] = useState('');
    //========================== Hàm notification của trang ==================================
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Create unit successfully') {
            setSuccessMessage('Tạo thành công');
        } else if (message === 'Update SubCategory successfully.') {
            setSuccessMessage('Cập nhập danh mục thành công');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Category name was existed') {
            setErrorMessage('Tên thể loại bị trùng !');
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
    //============================================================

    const handleCreateUnit = async () => {
        const unitParams = {
            name,
        };
        try {
            const response = await createUnits(unitParams);
            console.log('Create origin response:', response);
            if (response.status === '200 OK') {
                handleSuccessMessage(response.message);
                handleCloseSnackbar();
                props.onClose(response.data, response.message);
                //clear
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
                            variant="outlined"
                            value={name}
                            label="Tên đơn vị"
                            onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
                        />
                        <Button color="primary" variant="contained" onClick={handleCreateUnit}>
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

export default CreateUnitForm;
