import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Stack,
    Grid,
    TextField,
    IconButton,
} from '@mui/material';

import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';

import CustomDialog from '~/components/alert/ConfirmDialog';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';
import CloseIcon from '@mui/icons-material/Close';
import { editUnits } from '~/data/mutation/unit/unit-mutation';


const UnitDetailForm = ({ units, unitsId, onClose, isOpen, mode }) => {
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);

    const [editedUnit, setEditedUnit] = useState(null);

    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [confirmOpen1, setConfirmOpen1] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Update unit successfully') {
            setSuccessMessage('Cập nhập đơn vị thành công !');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Unit name was existed') {
            setErrorMessage('Tên đơn vị đã tồn tại !');
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
        updateUnit();
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
            setEditedUnit({
                name: '',
            });
        } else {
            const unit = units.find((o) => o.id === unitsId);
            console.log(unit);
            if (unit) {
                // Create a new object with only the desired fields
                const editedUnit = {
                    name: unit.name,
                };

                setEditedUnit(editedUnit);
            }
        }
    }, [units, unitsId, mode]);

    const unit = units.find((o) => o.id === unitsId);

    if (!unit) {
        return null;
    }

    const updateUnit = async () => {
        try {
            if (editedUnit) {
                // Define the update data
                const updateData = {
                    name: editedUnit.name,
                };

                const response = await editUnits(unitsId, updateData);

                console.log('Category updated:', response);
                if (response.status === '200 OK') {
                    handleSuccessMessage(response.message);
                }
            }
        } catch (error) {
            // Handle errors
            console.error('Error updating unit:', error);
            handleErrorMessage(error.response.data.message);
        }
    };

    const handleEdit = (field, value) => {
        setEditedUnit((prevUnit) => ({
            ...prevUnit,
            [field]: value,
        }));
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
                                    <Typography variant="body1">Tên đơn vị:</Typography>
                                    <TextField
                                        helperText="Kích thước phải nằm trong khoảng từ 1 đến 100!"
                                        size="small"
                                        variant="outlined"
                                        label="Tên thương hiệu"
                                        sx={{ width: '70%' }}
                                        value={editedUnit ? editedUnit.name : ''}
                                        onChange={(e) => handleEdit('name', capitalizeFirstLetter(e.target.value))}
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

export default UnitDetailForm;
