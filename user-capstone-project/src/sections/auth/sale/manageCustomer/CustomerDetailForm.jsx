import React, { useEffect, useState } from 'react';
import { Typography, Tab, Tabs, Stack, Grid, TextField } from '@mui/material';


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

    // const [expandedItem, setExpandedItem] = useState(customerId);
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);

    // const [categories_id, setCategories_id] = useState([]);
    // const [unit_id, setUnits_id] = useState([]);
    // const [unit_mea_id, setUnit_mea_id] = useState([]);

    const [editedCustomer, setEditedCustomer,] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('');

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
            const customers = customer.find((o) => o.customerId === customerId);
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
            <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)} indicatorColor="primary" textColor="primary">
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
                                    <Typography variant="body1">Mã khách hàng:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Mã khách hàng"
                                        sx={{ width: '65%', marginRight: 5 }}
                                        value={editedCustomer ? editedCustomer.code : ''}
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
                                        sx={{ width: '65%', marginRight: 5 }}
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
                                        sx={{ width: '65%', marginRight: 5 }}
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
                                        sx={{ width: '65%', marginRight: 5 }}
                                        value={editedCustomer ? editedCustomer.email : ''}
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
                                        sx={{ width: '70%', marginRight: 5 }}
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
                                        sx={{ width: '70%', marginRight: 5 }}
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
                                    <Typography variant="body1">Vị trí khách hàng:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Vị trí khách hàng"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={editedCustomer ? editedCustomer.type : ''}
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
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={editedCustomer ? editedCustomer.description : ''}
                                        onChange={(e) => handleEdit('description', e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>
                    {isSuccess && <SuccessAlerts message={successMessage} />}
                    {isError && <ErrorAlerts errorMessage={errorMessage} />}

                </div>
            )}

        </div>
    );
};
export default CustomerDetailForm;
