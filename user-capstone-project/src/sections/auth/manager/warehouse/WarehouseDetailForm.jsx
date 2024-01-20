import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Stack,
    Grid,
    TextField,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { editWarehouse } from '~/data/mutation/warehouse/warehouse-mutation';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import CustomDialog from '~/components/alert/ConfirmDialog';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';

const WarehouseDetailForm = ({
    warehouses,
    warehouseId,
    updateWarehouseInList,
    updateWarehouseStatusInList,
    onClose,
    isOpen,
    mode,
}) => {
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [editedWarehouse, setEditedWarehouse] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('');
    console.log(currentStatus, formHeight, setSelectedTab);
    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [confirmOpen1, setConfirmOpen1] = useState(false);
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
        if (message === 'You must be logged in with proper permissions to access this resource') {
            setErrorMessage('Bạn không có quyền này !');
        } else if (message === 'Update category successfully') {
            setErrorMessage('Cập nhập thể loại thành công !');
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
        updateWarehouse();
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
            setEditedWarehouse({
                name: '',
                address: '',
            });
        } else {
            const warehouse = warehouses.find((o) => o.id === warehouseId);
            console.log(warehouse);
            if (warehouse) {
                // Create a new object with only the desired fields
                const editedWarehouse = {
                    name: warehouse.name,
                    address: warehouse.address,
                };

                setEditedWarehouse(editedWarehouse);
                setCurrentStatus(warehouse.status);
            }
        }
    }, [warehouses, warehouseId, mode]);

    const brand = warehouses.find((o) => o.id === warehouseId);

    if (!brand) {
        return null;
    }

    const updateWarehouse = async () => {
        try {
            if (editedWarehouse) {
                // Define the update data
                const updateData = {
                    name: editedWarehouse.name,
                    address: editedWarehouse.address,
                };

                // Call your API to update the category
                const response = await editWarehouse(warehouseId, updateData);
                if (response.status === '200 OK') {
                    handleSuccessMessage(response.message);
                }
                updateWarehouseInList(response.data);
                // Handle the response as needed
                console.log('Category updated:', response);
            }
        } catch (error) {
            // Handle errors
            console.error('Error updating brand:', error);
            handleErrorMessage(error.response.data.error);
            console.log(error.response.data.error);
        }
    };



    const handleEdit = (field, value) => {
        setEditedWarehouse((prevBrand) => ({
            ...prevBrand,
            [field]: value,
        }));
    };


    return (
        <div
            id="warehouseDetailForm"
            className="WarehouseDetailForm"
            style={{
                backgroundColor: 'white',
                zIndex: 999,
            }}
        >
            {selectedTab === 0 && (
                <div>
                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Tên kho:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Tên kho"
                                        sx={{ width: '70%' }}
                                        value={editedWarehouse ? editedWarehouse.name : ''}
                                        onChange={(e) => handleEdit('name', capitalizeFirstLetter(e.target.value))}
                                    />
                                </Grid>

                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Địa chỉ:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Địa chỉ"
                                        sx={{ width: '70%' }}
                                        value={editedWarehouse ? editedWarehouse.address : ''}
                                        onChange={(e) => handleEdit('address', capitalizeFirstLetter(e.target.value))}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>
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
                </div>
            )}
            {selectedTab === 1 && (
                <div style={{ flex: 1 }}>{/* Hiển thị nội dung cho tab "Lịch sử thanh toán" ở đây */}</div>
            )}
        </div>
    );
};

export default WarehouseDetailForm;
