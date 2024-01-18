import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Tab,
    Tabs,
    Stack,
    Grid,
    TextField,
    FormControl,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    IconButton,
} from '@mui/material';
import { deleteOrigins, editOrigins } from '~/data/mutation/origins/origins-mutation';
import { deleteBrands, editBrands } from '~/data/mutation/brand/brands-mutation';
import { deleteSuppliers, editStatusSuppliers, editSuppliers } from '~/data/mutation/supplier/suppliers-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import CloseIcon from '@mui/icons-material/Close';
import CustomDialog from '~/components/alert/ConfirmDialog';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';

const SupplierDetailForm = ({ suppliers, suppliersId, onClose, isOpen, mode, updateSupplierStatusInList }) => {
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [currentStatus, setCurrentStatus] = useState('');
    const [editedSupplier, setEditedSupplier] = useState(null);
    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [confirmOpen1, setConfirmOpen1] = useState(false);
    const [confirmOpen2, setConfirmOpen2] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Updated supplier successfully!') {
            setSuccessMessage('Cập nhập Nhà cung cấp thành công !');
        } else if (message === 'Update supplier status successfully!') {
            setSuccessMessage('Cập nhập trạng thái thành công !');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Email already in use!') {
            setErrorMessage('Email đã tồn tại !');
        } else if (message === 'Phone number already in use!') {
            setErrorMessage('Số điện thoại đã tồn tại !');
        } else if (message === 'Tax code already in use!') {
            setErrorMessage('Mã số thuế đã tồn tại !');
        } else if (message === 'could not execute!') {
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
        updateSupplier();
    };

    const handleConfirm1 = () => {
        setConfirmOpen1(true);
    };

    const handleConfirmUpdateStatus2 = () => {
        setConfirmOpen2(false);
        updateSupplierStatus();
    };

    const handleConfirm2 = () => {
        setConfirmOpen2(true);
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
            setEditedSupplier({
                // code: '',
                name: '',
                phone: '',
                email: '',
                taxCode: '',
                address: '',
            });
        } else {
            const supplier = suppliers.find((o) => o.id === suppliersId);
            console.log(supplier);
            if (supplier) {
                // Create a new object with only the desired fields
                const editedSupplier = {
                    // code: supplier.code,
                    name: supplier.name,
                    phone: supplier.phone,
                    email: supplier.email,
                    taxCode: supplier.taxCode,
                    address: supplier.address,
                };

                setEditedSupplier(editedSupplier);
            }
        }
    }, [suppliers, suppliersId, mode]);

    const supplier = suppliers.find((o) => o.id === suppliersId);

    if (!supplier) {
        return null;
    }

    const updateSupplier = async () => {
        try {
            if (editedSupplier) {
                // Define the update data
                const updateData = {
                    // code: editedSupplier.code,
                    name: editedSupplier.name,
                    phone: editedSupplier.phone,
                    email: editedSupplier.email,
                    taxCode: editedSupplier.taxCode,
                    address: editedSupplier.address,
                };

                // Call your API to update the category
                const response = await editSuppliers(suppliersId, updateData);

                // Handle the response as needed
                console.log('Category updated:', response);
                if (response.status === '200 OK') {
                    handleSuccessMessage(response.message);
                }
            }
        } catch (error) {
            // Handle errors
            console.error('Error updating supplier:', error);
            handleErrorMessage(error.response.data.message);
        }
    };

    const deleteSupplier = async () => {
        try {
            await deleteSuppliers(suppliersId);
            onClose();
        } catch (error) {
            console.error('Error deleting supplier:', error);
        }
    };

    const handleEdit = (field, value) => {
        setEditedSupplier((prevSupsetEditedSupplier) => ({
            ...prevSupsetEditedSupplier,
            [field]: value,
        }));
    };
    const handleSave = () => {
        // Xử lý lưu
    };

    const updateSupplierStatus = async () => {
        try {
            let newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

            const response = await editStatusSuppliers(suppliersId, newStatus);

            if (response.status === '200 OK') {
                handleSuccessMessage(response.message);
            }

            // Sử dụng hàm để cập nhật trạng thái trong danh sách categories trong CategoryPage
            updateSupplierStatusInList(suppliersId, newStatus);
            setCurrentStatus(newStatus);

            console.log('Product status updated:', response);
        } catch (error) {
            console.error('Error updating category status:', error);
            handleErrorMessage(error.response.data.message);
        }
    };

    return (
        <div
            id="supplierDetailForm"
            className="SupplierDetailForm"
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
                                    <Typography variant="body1">Mã nhà cung cấp:</Typography>
                                    <TextField
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Mã nhà cung cấp"
                                        sx={{ width: '70%', pointerEvents: 'none' }}
                                        value={supplier ? supplier.code : ''}
                                        onChange={(e) => handleEdit('code', e.target.value)}
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
                                    <Typography variant="body1">Nhà cung cấp:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Tên nhà cung cấp"
                                        sx={{ width: '70%' }}
                                        value={editedSupplier ? editedSupplier.name : ''}
                                        onChange={(e) => handleEdit('name', e.target.value)}
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
                                    <Typography variant="body1">Số điện thoại:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Số điện thoại"
                                        sx={{ width: '70%' }}
                                        value={editedSupplier ? editedSupplier.phone : ''}
                                        onChange={(e) => handleEdit('phone', e.target.value)}
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
                                    <Typography variant="body1">Email:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Email"
                                        sx={{ width: '70%' }}
                                        value={editedSupplier ? editedSupplier.email : ''}
                                        onChange={(e) => handleEdit('email', e.target.value)}
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
                                    <Typography variant="body1">Mã số thuế:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="taxCode"
                                        sx={{ width: '70%' }}
                                        value={editedSupplier ? editedSupplier.taxCode : ''}
                                        onChange={(e) => handleEdit('taxCode', e.target.value)}
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
                                        value={editedSupplier ? editedSupplier.address : ''}
                                        onChange={(e) => handleEdit('address', e.target.value)}
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
                                    <Typography variant="body1">Ngày tạo:</Typography>
                                    <TextField
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Ngày tạo"
                                        sx={{ width: '70%', pointerEvents: 'none' }}
                                        value={supplier.createdAt}
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
                                    <Typography variant="body1">Ngày cập nhật:</Typography>
                                    <TextField
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Ngày cập nhật"
                                        sx={{ width: '70%', pointerEvents: 'none' }}
                                        value={supplier.updatedAt}
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
                            {/* <Button variant="contained" color="error" onClick={handleConfirm2}>
                                Thay đổi trạng thái
                            </Button> */}
                            {/* Thông báo confirm */}
                            <CustomDialog
                                open={confirmOpen2}
                                onClose={handleConfirmClose1}
                                title="Thông báo!"
                                content="Bạn có chắc muốn cập nhật không?"
                                onConfirm={handleConfirmUpdateStatus2}
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
            {selectedTab === 1 && (
                <div style={{ flex: 1 }}>{/* Hiển thị nội dung cho tab "Lịch sử thanh toán" ở đây */}</div>
            )}
        </div>
    );
};

export default SupplierDetailForm;
