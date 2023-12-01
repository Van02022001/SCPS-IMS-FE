import { Button, DialogContent, Stack, TextField, IconButton } from '@mui/material';
import React, { useState } from 'react';

import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
// api
import { createCategories } from '~/data/mutation/categories/categories-mutation';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';

const CreateCategoriesForm = (props) => {
    const [open, setOpen] = React.useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    //thông báo
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    //========================== Hàm notification của trang ==================================
    const handleMessage = (message) => {
        setOpen(true);
        // Đặt logic hiển thị nội dung thông báo từ API ở đây
        if (message === 'Create category successfully') {
            setMessage('Tạo nhóm hàng thành công')
        } else if (message === 'Update SubCategory successfully.') {
            setMessage('Cập nhập danh mục thành công')
            console.error('Error message:', errorMessage);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);

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
    const handleCreateCategory = async () => {
        const categoriesParams = {
            name,
            description,
        };

        try {
            const response = await createCategories(categoriesParams);
            console.log(response.message);
            if (response.status === '200 OK') {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.data.message);

                handleMessage(response.message);
                // Clear form fields
                // setCategoryName('');
                // setCategoryDescription('');
                props.onClose(response.data);
            }

        } catch (error) {
            console.error("Can't fetch category", error.response);
            setIsError(true);
            setIsSuccess(false);

            if (error.response?.data?.message === 'Invalid request') {
                setErrorMessage('Yêu cầu không hợp lệ');
            }
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
                            value={description}
                            onChange={(e) => setDescription(capitalizeFirstLetter(e.target.value))}
                        />
                        {isSuccess && <SuccessAlerts message={successMessage} />}
                        {isError && <ErrorAlerts errorMessage={errorMessage} />}
                        <Button color="primary" variant="contained" onClick={handleCreateCategory}>
                            Tạo
                        </Button>
                        <Snackbar
                            open={open}
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
                    </Stack>
                </DialogContent>
            </div>
        </>
    );
};

export default CreateCategoriesForm;
