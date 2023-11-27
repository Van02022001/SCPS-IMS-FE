import React, { useEffect, useState } from 'react';
import { Typography, Button, Tab, Tabs, Stack, Grid, TextField, FormControl, Select, MenuItem } from '@mui/material';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { editSubCategory, editStatusCategory } from '~/data/mutation/subCategory/subCategory-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';

const CustomerDetailForm = ({
    customer,
    customerId,
    updateProductInList,
    updateProductStatusInList,
    productStatus,
    onClose,
    isOpen,
    mode,
}) => {
    const [tab1Data, setTab1Data] = useState({ categories_id: [] });
    const [tab2Data, setTab2Data] = useState({});
    const [tab3Data, setTab3Data] = useState({});

    const [expandedItem, setExpandedItem] = useState(customerId);
    const [formHeight, setFormHeight] = useState(0);
    const [currentTab, setCurrentTab] = useState(0);

    // const [categories_id, setCategories_id] = useState([]);
    // const [unit_id, setUnits_id] = useState([]);
    // const [unit_mea_id, setUnit_mea_id] = useState([]);

    const [editedCustomer, setEditedCustomer,] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('');

    const [positionedSnackbarOpen, setPositionedSnackbarOpen] = useState(false);
    const [positionedSnackbarError, setPositionedSnackbarError] = useState(false);

    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleTab1DataChange = (event) => {
        // Cập nhật dữ liệu cho tab 1 tại đây
        setTab1Data({ ...tab1Data, [event.target.name]: event.target.value });
    };

    const handleTab2DataChange = (event) => {
        // Cập nhật dữ liệu cho tab 2 tại đây
        setTab2Data({ ...tab2Data, [event.target.name]: event.target.value });
    };
    const handleChangeTab = (event, newValue) => {
        setCurrentTab(newValue);
    };
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
                code: '',
                name: '',
                phone: '',
                email: '',
                taxCode: '',
                address: '',
                type: '',
                description: '',
            });
        } else {
            const customers = customer.find((o) => o.id === customerId);
            console.log(customers);
            if (customers) {

                const editedCustomer = {
                    code: customers.code,
                    name: customers.name,
                    phone: customers.phone,
                    email: customers.email,
                    taxCode: customers.taxCode,
                    address: customers.address,
                    type: customers.type,
                    description: customers.description,
                };

                setEditedCustomer(editedCustomer);
                setCurrentStatus(customer.status);
                console.log(editedCustomer);
            }
        }
    }, [customerId, customer, mode]);


    const customers = customer.find((o) => o.id === customerId);

    if (!customer) {
        return null;
    }

    const updateProduct = async () => {
        if (!editedCustomer) {
            return;
        }
        try {
            const response = await editSubCategory(customerId, editedCustomer);

            if (response.status === '200 OK') {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.message);
            }

            updateProductInList(response.data);
            console.log('Product updated:', response);
        } catch (error) {
            console.error('An error occurred while updating the product:', error);
            setIsError(true);
            setIsSuccess(false);
            setErrorMessage(error.response.data.message);
            if (error.response) {
                console.log('Error response:', error.response);
            }
        }
    };

    const updateProductStatus = async () => {
        try {
            let newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

            const response = await editStatusCategory(customerId, newStatus);

            if (response.status === '200 OK') {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.message);
            }

            // Sử dụng hàm để cập nhật trạng thái trong danh sách categories trong CategoryPage
            updateProductStatusInList(customerId, newStatus);
            setCurrentStatus(newStatus);

            console.log('Product status updated:', response);
        } catch (error) {
            console.error('Error updating category status:', error);
            setIsError(true);
            setIsSuccess(false);
            setErrorMessage(error.response.data.message);
            if (error.response) {
                console.log('Error response:', error.response);
            }
        }
    };

    const handleClear = () => { };

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

    const handleDelete = () => {
        // Xử lý xóa
    };

    return editedCustomer ? (
        <div
            id="customerDetailForm"
            className="CustomerDetailForm"
            style={{
                backgroundColor: 'white',
                zIndex: 999,
            }}
        >
            <Tabs value={currentTab} onChange={handleChangeTab} indicatorColor="primary" textColor="primary">
                <Tab label="Thông tin" />
                <Tab label="Thẻ kho" />
                <Tab label="Tồn kho" />
            </Tabs>

            {currentTab === 0 && (
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
                                    <Typography variant="body1">Mã khách hàng:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Mã hàng"
                                        sx={{ width: '60%' }}
                                        value={customers ? customers.code : ''}
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
                                    <Typography variant="body1">Tên khách hàng:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Tên sản phẩm"
                                        sx={{ width: '60%' }}
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
                                        sx={{ width: '60%', cursor: 'none' }}
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
                                        sx={{ width: '60%' }}
                                        value={editedCustomer.email}
                                    />
                                </Grid>
                            </Grid>

                            {/* 5 field bên phải*/}
                            <Grid item xs={6}>
                                <div style={{ marginLeft: 30 }}>
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
                                            sx={{ width: '60%' }}
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
                                            sx={{ width: '60%' }}
                                            value={editedCustomer.taxCode}
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
                                        <Typography variant="body1">Vị trí khách hàng:</Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Vị trí khách hàng"
                                            sx={{ width: '60%' }}
                                            value={editedCustomer.type}
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
                                            sx={{ width: '60%' }}
                                            value={editedCustomer ? editedCustomer.description : ''}
                                            onChange={(e) => handleEdit('description', e.target.value)}
                                        />
                                    </Grid>


                                    {/* <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 2 }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Kích thước:{' '}
                                        </Typography>
                                        <div style={{ display: 'flex' }}>
                                            <FormControl sx={{ m: 0.2 }} variant="standard">
                                                <TextField
                                                    id="demo-customized-textbox"
                                                    label="Chiều dài"
                                                    value={editedCustomer ? editedCustomer.size.length : 0}
                                                    onChange={(e) => handleEdit('length', e.target.value)}
                                                />
                                            </FormControl>
                                            <FormControl sx={{ m: 0.2 }} variant="standard">
                                                <TextField
                                                    id="demo-customized-textbox"
                                                    label="Chiều rộng"
                                                    value={editedCustomer ? editedCustomer.size.width : 0}
                                                    onChange={(e) => handleEdit('width', e.target.value)}
                                                />
                                            </FormControl>
                                            <FormControl sx={{ m: 0.2 }} variant="standard">
                                                <TextField
                                                    id="demo-customized-textbox"
                                                    label="Chiều cao"
                                                    value={editedCustomer ? editedCustomer.size.height : 0}
                                                    onChange={(e) => handleEdit('height', e.target.value)}
                                                />
                                            </FormControl>
                                            <FormControl sx={{ m: 0.2 }} variant="standard">
                                                <TextField
                                                    id="demo-customized-textbox"
                                                    label="Đường kính"
                                                    value={editedCustomer ? editedCustomer.size.diameter : 0}
                                                    onChange={(e) => handleEdit('diameter', e.target.value)}
                                                />
                                            </FormControl>
                                        </div>
                                    </Grid> */}
                                </div>
                            </Grid>
                        </Grid>
                    </Stack>
                    {isSuccess && <SuccessAlerts message={successMessage} />}
                    {isError && <ErrorAlerts errorMessage={errorMessage} />}
                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={1} sx={{ gap: '10px' }}>
                            <Button variant="contained" color="primary" onClick={updateProduct}>
                                Cập nhập
                            </Button>
                            <Button variant="contained" color="error" onClick={updateProductStatus}>
                                Thay đổi trạng thái
                            </Button>
                            {/* <Button variant="contained" color="error" onClick={handleDelete}>
                                Xóa
                            </Button> */}
                            <Button variant="outlined" color="error" onClick={handleClear}>
                                Hủy bỏ
                            </Button>
                        </Grid>
                    </Stack>
                </div>
            )}

            {currentTab === 1 && (
                <div style={{ flex: 1 }}>{/* Hiển thị nội dung cho tab "Lịch sử thanh toán" ở đây */}</div>
            )}
        </div>
    ) : null;
};

export default CustomerDetailForm;
