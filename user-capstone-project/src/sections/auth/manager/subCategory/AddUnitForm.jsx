import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton } from '@mui/material';

import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';

import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
// api
import { createUnits } from '~/data/mutation/unit/unit-mutation';

const AddUnitForm = ({ open, onClose, onSave }) => {
    const [openAddCategoryMeta, setOpenAddCategoryMeta] = React.useState(false);
    const [unitName, setUnitName] = useState('');


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
        const unitParams = {
            name: unitName,
        };
        try {
            const response = await createUnits(unitParams);

            if (response.status === '200 OK') {
                setUnitName('');

                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.message);
                console.log(response);
                onSave && onSave();
                // Đóng form
                onClose && onClose();
            }
        } catch (error) {
            console.error("can't feaching category", error);
            setIsError(true);
            setIsSuccess(false);
            if (error.response?.data?.message === 'Invalid request') {
                setErrorMessage('Yêu cầu không hợp lệ');
            }
            if (error.response?.data?.message === 'Unit name already exists') {
                setErrorMessage('Đơn vị này đã tồn tại !');
            }
            if (error.response) {
                console.log('Error response:', error.response.data.message);
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Thêm đơn vị</DialogTitle>
            <DialogContent sx={{ width: 500 }}>
                <TextField
                    label="Tên đơn vị"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={unitName}
                    onChange={(e) => setUnitName(capitalizeFirstLetter(e.target.value))}
                />
                {isSuccess && <SuccessAlerts message={successMessage} />}
                {isError && <ErrorAlerts errorMessage={errorMessage} />}
            </DialogContent>
            <div style={{ padding: '16px' }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
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
            {/* Notification */}
            {/* <Snackbar
                open={showNotification || errorMessage.length > 0}
                autoHideDuration={6000}
                onClose={closeNotification}
            >
                {errorMessage ? (
                    <Alert onClose={closeNotification} severity="error">
                        {errorMessage}
                    </Alert>
                ) : (
                    <Alert onClose={closeNotification} severity="success">
                        Đơn vị đã được tạo thành công.
                    </Alert>
                )}
            </Snackbar> */}
        </Dialog>
    );
};

export default AddUnitForm;
