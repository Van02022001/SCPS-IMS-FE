import React, { useEffect, useState } from 'react';
import { Typography, Button, Stack, Grid, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { deleteOrigins, editOrigins } from '~/data/mutation/origins/origins-mutation';

import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';

const OriginDetailForm = ({ origins, originsId, onClose, isOpen, mode }) => {
    // const [expandedItem, setExpandedItem] = useState(originsId);
    const [open, setOpen] = React.useState(false);
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    //thông báo
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [editedOrigin, setEditedOrigin] = useState(null);
    //========================== Hàm notification của trang ==================================
    const handleMessage = (message) => {
        setOpen(true);
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

        setOpen(false);

    };
    const handleConfirmClose = () => {
        setConfirmOpen(false);
    };

    const handleConfirmUpdate = () => {
        setConfirmOpen(false);
        updateOrigin();
    };

    const handleConfirm = () => {
        setConfirmOpen(true);
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
                    setIsSuccess(true);
                    setIsError(false);
                    setSuccessMessage(response.message);
                    handleMessage(response.message);
                }

                // Handle the response as needed
                console.log('Category updated:', response);
            }
        } catch (error) {
            // Handle errors
            console.error('Error updating category:', error);
            setIsError(true);
            setIsSuccess(false);
            setErrorMessage(error.response.data.message);
            if (error.response) {
                console.log('Error response:', error.response);
            }
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
                                    <Typography variant="body1">Tên thương hiệu:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Tên thương hiệu"
                                        sx={{ width: '70%' }}
                                        value={editedOrigin ? editedOrigin.name : ''}
                                        onChange={(e) => handleEdit('name', capitalizeFirstLetter(e.target.value))}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>
                    {isSuccess && <SuccessAlerts />}
                    {isError && <ErrorAlerts errorMessage={errorMessage} />}
                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={1} sx={{ gap: '10px' }}>
                            <Button variant="contained" color="primary" onClick={handleConfirm}>
                                Cập nhập
                            </Button>
                            {/* Thông báo confirm */}
                            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                                <DialogTitle>Thông báo!</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>Bạn có chắc muốn cập nhật không?</DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleConfirmClose} color="primary">
                                        Hủy
                                    </Button>
                                    <Button onClick={handleConfirmUpdate} color="primary" autoFocus>
                                        Xác nhận
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            {/* notificaiton */}
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
