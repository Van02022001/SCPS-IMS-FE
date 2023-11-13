import React, { useEffect, useState } from 'react';
import { Typography, Button, Tab, Tabs, Stack, Grid, TextField, FormControl, Select, MenuItem } from '@mui/material';
import { deleteOrigins, editOrigins } from '~/data/mutation/origins/origins-mutation';
import { deleteBrands, editBrands } from '~/data/mutation/brand/brands-mutation';
import { deleteSuppliers, editStatusSuppliers, editSuppliers } from '~/data/mutation/supplier/suppliers-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';

const SupplierDetailForm = ({ suppliers, suppliersId, onClose, isOpen, mode, updateSupplierStatusInList }) => {
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [currentStatus, setCurrentStatus] = useState('');
    const [editedSupplier, setEditedSupplier] = useState(null);
    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
                code: '',
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
                    code: supplier.code,
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
                    code: editedSupplier.code,
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
                    setIsSuccess(true);
                    setIsError(false);
                    setSuccessMessage(response.message);
                }
            }
        } catch (error) {
            // Handle errors
            console.error('Error updating supplier:', error);
            setIsError(true);
            setIsSuccess(false);
            setErrorMessage(error.response.data.message);
            if (error.response) {
                console.log('Error response:', error.response);
            }
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
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.message);
            }

            // Sử dụng hàm để cập nhật trạng thái trong danh sách categories trong CategoryPage
            updateSupplierStatusInList(suppliersId, newStatus);
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
                                    <Typography variant="body1">Mã người bán:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Mã người bán"
                                        sx={{ width: '70%' }}
                                        value={editedSupplier ? editedSupplier.code : ''}
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
                                    <Typography variant="body1">Tên người bán:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Tên người bán"
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
                                    <Typography variant="body1">taxCode:</Typography>
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
                                        size="small"
                                        variant="outlined"
                                        label="Ngày tạo"
                                        sx={{ width: '70%' }}
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
                                        size="small"
                                        variant="outlined"
                                        label="Ngày cập nhật"
                                        sx={{ width: '70%' }}
                                        value={supplier.updatedAt}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>
                    {isSuccess && <SuccessAlerts message={successMessage} />}
                    {isError && <ErrorAlerts errorMessage={errorMessage} />}
                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={1} sx={{ gap: '10px' }}>
                            <Button variant="contained" color="primary" onClick={updateSupplier}>
                                Cập nhập
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={updateSupplierStatus}>
                                Thay đổi trạng thái
                            </Button>
                            <Button variant="outlined" color="secondary" >
                                Hủy bỏ
                            </Button>
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
