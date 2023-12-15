import { Button, DialogContent, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
//icon
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';

// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createOrigins } from '~/data/mutation/origins/origins-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import CustomDialog from '~/components/alert/ConfirmDialog';

const CreateOriginForm = (props) => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = useState('');
    //thông báo
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmOpen1, setConfirmOpen1] = useState(false);

    //============================================================

    const handleMessage = (message) => {
        setOpen(true);
        // Đặt logic hiển thị nội dung thông báo từ API ở đây
        if (message === 'Update sub category status successfully.') {
            setMessage('Cập nhập trạng thái danh mục thành công');
        } else if (message === 'Update SubCategory successfully.') {
            setMessage('Cập nhập danh mục thành công');
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
            <Button color="secondary" size="small" onClick={handleClose}></Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="lage" />
            </IconButton>
        </React.Fragment>
    );

    const handleConfirm1 = () => {
        setConfirmOpen1(true);
    };

    const handleConfirmClose1 = () => {
        setConfirmOpen1(false);
    };

    const handleConfirmUpdate1 = () => {
        setConfirmOpen1(false);
        handleCreateOrigins();
    };

    const handleCreateOrigins = async () => {
        const originParams = {
            name,
        };
        try {
            const response = await createOrigins(originParams);
            console.log('Create origin response:', response);
            if (response.status === '200 OK') {
                handleMessage(response.message);
                props.onClose(response.data, response.message);
            }
        } catch (error) {
            console.error('Error creating origin:', error);
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
                            label="Tên thương hiệu"
                            onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
                        />
                        <Button color="primary" variant="contained" onClick={handleConfirm1}>
                            Tạo
                        </Button>
                        <CustomDialog
                            open={confirmOpen1}
                            onClose={handleConfirmClose1}
                            title="Thông báo!"
                            content="Bạn có chắc muốn cập nhật không?"
                            onConfirm={handleConfirmUpdate1}
                            confirmText="Xác nhận"
                        />
                        <SnackbarSuccess
                            open={open}
                            handleClose={handleClose}
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

export default CreateOriginForm;
