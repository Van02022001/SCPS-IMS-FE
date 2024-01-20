import React, { useEffect, useState } from 'react';
import { Typography, Tab, Tabs, Stack, Grid, TextField, Button } from '@mui/material';

import { editStatusCustomer } from '~/data/mutation/customer/customer-mutation';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';
import CustomDialog from '~/components/alert/ConfirmDialog';

const CustomerDetailForm = ({ customer, customerId, updateCustomerStatusInList, onClose, isOpen, mode }) => {
    // const [tab1Data, setTab1Data] = useState({ categories_id: [] });
    // const [tab2Data, setTab2Data] = useState({});
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);

    const [editedCustomer, setEditedCustomer] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('');

    //thông báo
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [confirmOpen1, setConfirmOpen1] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // const handleTab1DataChange = (event) => {
    //     // Cập nhật dữ liệu cho tab 1 tại đây
    //     setTab1Data({ ...tab1Data, [event.target.name]: event.target.value });
    // };

    // const handleTab2DataChange = (event) => {
    //     // Cập nhật dữ liệu cho tab 2 tại đây
    //     setTab2Data({ ...tab2Data, [event.target.name]: event.target.value });
    // };

    //=====================================Hàm thông báo================================
    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Update sub category status successfully.') {
            setSuccessMessage('Cập nhập trạng thái danh mục thành công');
        } else if (message === 'Update sub category successfully.') {
            setSuccessMessage('Cập nhập danh mục thành công');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Category name was existed') {
            setErrorMessage('Tên thể loại đã tồn tại !');
        } else if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ');
        } else if (message === '404 NOT_FOUND') {
            setErrorMessage('Mô tả quá dài');
        } else if (message === 'Sub category name was existed') {
            setErrorMessage('Tên đã tồn tại !');
        } else if (message === 'SubCategory must have at least one category') {
            setErrorMessage('Vui lòng chọn ít nhất 1 nhóm hàng !');
        }
    };

    const handleConfirm1 = () => {
        setConfirmOpen1(true);
    };
    const handleConfirmClose1 = () => {
        setConfirmOpen1(false);
    };
    const handleConfirmUpdateStatus1 = () => {
        setConfirmOpen1(false);
        updateCustomerStatus();
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
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
    //=====================================================================
    useEffect(() => {
        if (isOpen) {
            setFormHeight(1000);
        } else {
            setFormHeight(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (mode === 'create') {
            setEditedCustomer({
                name: '',
                phone: '',
                email: '',
                taxCode: '',
                address: '',
                type: '',
                description: '',
            });
        } else {
            const customers = customer.find((o) => o.customerId === customerId);
            console.log(customers);
            if (customers) {
                const editedCustomer = {
                    name: customers.name,
                    phone: customers.phone,
                    email: customers.email,
                    taxCode: customers.taxCode,
                    address: customers.address,
                    type: customers.customerType,
                    description: customers.description,
                };

                setEditedCustomer(editedCustomer);
                setCurrentStatus(customer.status);
                console.log(editedCustomer);
            }
        }
    }, [customerId, customer, mode]);

    const customers = customer.find((o) => o.id === customerId);
    console.log(customers, formHeight);
    if (!customer) {
        return null;
    }

    const updateCustomerStatus = async () => {
        try {
            const response = await editStatusCustomer(customerId, !currentStatus);
            console.log('API response status:', response);

            if (response.status === '200 OK') {
                setSuccessMessage(response.message);
                handleSuccessMessage(response.message);
                const newStatus = currentStatus;

                // Cập nhật trạng thái local
                const updatedCustomer = {
                    ...editedCustomer,
                    status: newStatus,
                };
                setEditedCustomer(updatedCustomer);
                setCurrentStatus(newStatus);

                updateCustomerStatusInList(customerId, !newStatus);
            }
        } catch (error) {
            handleErrorMessage(error.response?.data?.message);
        }
    };

    const handleEdit = (field, value) => {
        console.log(`Field: ${field}, Value: ${value}`);
        if (field === 'categories_id') {
            const categoryIds = value.map(Number).filter(Boolean);
            setEditedCustomer((prevProduct) => ({
                ...prevProduct,
                [field]: categoryIds,
            }));
        } else if (field === 'unit_id' || field === 'unit_mea_id') {
            const id = parseInt(value);
            setEditedCustomer((prevProduct) => ({
                ...prevProduct,
                [field]: id,
            }));
        } else {
            setEditedCustomer((prevProduct) => ({
                ...prevProduct,
                [field]: value,
            }));
        }
    };

    return (
        <div
            id="customerDetailForm"
            className="CustomerDetailForm"
            style={{
                backgroundColor: 'white',
                zIndex: 999,
            }}
        >
            <Tabs
                value={selectedTab}
                onChange={(event, newValue) => setSelectedTab(newValue)}
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab label="Thông tin" />
            </Tabs>

            {selectedTab === 0 && (
                <div style={{ marginLeft: 50 }}>
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
                                    <Typography variant="body1">Tên khách hàng:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Tên sản phẩm"
                                        sx={{ width: '65%', marginRight: 5, pointerEvents: 'none' }}
                                        InputProps={{ readOnly: true }}
                                        value={editedCustomer ? editedCustomer.name : ''}
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
                                        sx={{ width: '65%', marginRight: 5, pointerEvents: 'none' }}
                                        InputProps={{ readOnly: true }}
                                        value={editedCustomer ? editedCustomer.phone : ''}
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
                                        sx={{ width: '65%', marginRight: 5, pointerEvents: 'none' }}
                                        InputProps={{ readOnly: true }}
                                        value={editedCustomer ? editedCustomer.email : ''}
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
                                    <Typography variant="body1">Hình thức:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Hình thức"
                                        sx={{ width: '65%', marginRight: 5, pointerEvents: 'none' }}
                                        InputProps={{ readOnly: true }}
                                        value={
                                            editedCustomer
                                                ? editedCustomer.type === 'INDIVIDUAL'
                                                    ? 'Cá nhân'
                                                    : editedCustomer.type === 'COMPANY'
                                                        ? 'Công ty'
                                                        : 'Không có'
                                                : ''
                                        }
                                    />
                                </Grid>
                            </Grid>

                            {/* 5 field bên phải*/}
                            <Grid item xs={6}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Trạng thái:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Trạng thái"
                                        sx={{ width: '70%', marginRight: 5, pointerEvents: 'none' }}
                                        InputProps={{ readOnly: true }}
                                        value={currentStatus === 'Active' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
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
                                    <Typography variant="body1">Mã thuế:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Mã thuế"
                                        sx={{ width: '70%', marginRight: 5, pointerEvents: 'none' }}
                                        InputProps={{ readOnly: true }}
                                        value={editedCustomer ? editedCustomer.taxCode : ''}
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
                                        sx={{ width: '70%', marginRight: 5, pointerEvents: 'none' }}
                                        InputProps={{ readOnly: true }}
                                        value={editedCustomer ? editedCustomer.address : ''}
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
                                    <Typography variant="body1">Mô tả:</Typography>
                                    <TextField
                                        id="outlined-multiline-static"
                                        multiline
                                        rows={4}
                                        size="small"
                                        variant="outlined"
                                        label="Mô tả"
                                        sx={{ width: '70%', marginRight: 5, pointerEvents: 'none' }}
                                        InputProps={{ readOnly: true }}
                                        value={editedCustomer ? editedCustomer.description : ''}
                                        onChange={(e) => handleEdit('description', e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>
                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={1} sx={{ gap: '10px' }}>
                            <Button variant="contained" color="error" onClick={handleConfirm1}>
                                Thay đổi trạng thái
                            </Button>
                            {/* Thông báo confirm */}
                            <CustomDialog
                                open={confirmOpen1}
                                onClose={handleConfirmClose1}
                                title="Thông báo!"
                                content="Bạn có chắc muốn cập nhật không?"
                                onConfirm={handleConfirmUpdateStatus1}
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
        </div>
    );
};
export default CustomerDetailForm;
