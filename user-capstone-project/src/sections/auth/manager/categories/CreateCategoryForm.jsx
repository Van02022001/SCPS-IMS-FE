import { Button, DialogContent, Stack, TextField, IconButton } from '@mui/material';
import React, { useState } from 'react';

import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';

// api
import { createCategories } from '~/data/mutation/categories/categories-mutation';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';


const CreateCategoriesForm = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    
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

    const handleCreateCategory = async () => {
        const categoriesParams = {
            name,
            description,
        };

        try {
            const response = await createCategories(categoriesParams);
            console.log('API Response:', response);
            if (response.status === '200 OK') {
                handleSuccessMessage(response.message);

                handleCloseSnackbar();
                props.onClose(response.data, response.message);
            }

        } catch (error) {
            console.error("Can't fetch category", error.response);
            handleErrorMessage(error.response?.data?.message)
            // if (error.response?.data?.message === 'Invalid request') {
            //     handleErrorMessage('Yêu cầu không hợp lệ');
            // } else if (error.response?.data?.message === "You must be logged in with proper permissions to access this resource") {
            //     handleErrorMessage('Yêu cầu không hợp lệ');
            // }
        }
    };

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <DialogContent>
                    {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
                    <Stack spacing={2} margin={2}>
                        <TextField
                            variant="outlined"
                            label="Tên thể loại"
                            value={name}
                            onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
                        />
                        <TextField
                            variant="outlined"
                            label="Mô tả"
                            multiline
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(capitalizeFirstLetter(e.target.value))}
                        />
                        <Button color="primary" variant="contained" onClick={handleCreateCategory}>
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

export default CreateCategoriesForm;
