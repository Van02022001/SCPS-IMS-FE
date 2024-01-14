import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Stack,
    Grid,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import { deleteOrigins, editOrigins } from '~/data/mutation/origins/origins-mutation';

import CloseIcon from '@mui/icons-material/Close';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import CustomDialog from '~/components/alert/ConfirmDialog';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';

const OriginDetailForm = ({ origins, originsId, onClose, isOpen, mode }) => {
    // const [expandedItem, setExpandedItem] = useState(originsId);
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [editedOrigin, setEditedOrigin] = useState(null);

    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [confirmOpen1, setConfirmOpen1] = useState(false);
    const [confirmOpen2, setConfirmOpen2] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Create origin successfully') {
            setSuccessMessage('Cập nhập nguồn gốc thành công !');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Origin name was existed') {
            setErrorMessage('Tên nguồn gốc đã tồn tại !');
        } else if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

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
    const handleConfirmClose1 = () => {
        setConfirmOpen1(false);
    };

    const handleConfirmUpdate1 = () => {
        setConfirmOpen1(false);
        updateOrigin();
    };

    const handleConfirm1 = () => {
        setConfirmOpen1(true);
    };

    //========================== Hàm notification của trang ==================================
    useEffect(() => {
        if (isOpen) {
            setFormHeight(1000);
        } else {
            setFormHeight(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (mode === 'create') {
            setEditedOrigin({
                name: '',
            });
        } else {
            const origin = origins.find((o) => o.id === originsId);
            console.log(origin);
            if (origin) {
                // Create a new object with only the desired fields
                const editedOrigin = {
                    name: origin.name,
                };

                setEditedOrigin(editedOrigin);

                console.log(editedOrigin);
            }
        }
    }, [originsId, origins, mode]);

    const origin = origins.find((o) => o.id === originsId);

    if (!origin) {
        return null;
    }

    const updateOrigin = async () => {
        try {
            if (editedOrigin) {
                // Define the update data
                const updateData = {
                    name: editedOrigin.name,
                };

                // Call your API to update the category
                const response = await editOrigins(originsId, updateData);
                if (response.status === '200 OK') {
                    handleSuccessMessage(response.message);
                }

                // Handle the response as needed
                console.log('Category updated:', response);
            }
        } catch (error) {
            // Handle errors
            console.error('Error updating category:', error);
            // setErrorMessage(error.response.data.message);
            // if (error.response) {
            //     console.log('Error response:', error.response);
            // }
            handleErrorMessage(error.response.data.message);
        }
    };

    const deleteOrigin = async () => {
        try {
            await deleteOrigins(originsId);
            onClose();
        } catch (error) {
            console.error('Error deleting origin:', error);
        }
    };

    const handleEdit = (field, value) => {
        setEditedOrigin((prevOrigin) => ({
            ...prevOrigin,
            [field]: value,
        }));
    };
    const handleSave = () => {
        // Xử lý lưu
    };

    const handleDelete = () => {
        // Xử lý xóa
    };

    return (
        <div
            id="productDetailForm"
            className="ProductDetailForm"
            style={{
                backgroundColor: 'white',
                zIndex: 999,
            }}
        >
            {selectedTab === 0 && (
                <div>
                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Tên nguồn gốc:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Tên nguồn gốc"
                                        sx={{ width: '70%' }}
                                        value={editedOrigin ? editedOrigin.name : ''}
                                        onChange={(e) => handleEdit('name', capitalizeFirstLetter(e.target.value))}
                                        helperText="kích thước phải nằm trong khoảng từ 1 đến 100"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>
                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={1} sx={{ gap: '10px' }}>
                            <Button variant="contained" color="primary" onClick={handleConfirm1}>
                                Cập nhập
                            </Button>
                            {/* Thông báo confirm */}
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
                                message={successMessage}
                                action={action}
                                style={{ bottom: '16px', right: '16px' }}
                            />
                            <SnackbarError
                                open={open1}
                                handleClose={handleClose}
                                message={errorMessage}
                                action={action}
                                style={{ bottom: '16px', right: '16px' }}
                            />
                        </Grid>
                    </Stack>
                </div>
            )}
            {/* {selectedTab === 1 && (
                <div style={{ flex: 1 }}></div>
            )} */}
        </div>
    );
};

export default OriginDetailForm;
