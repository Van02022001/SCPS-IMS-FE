import React, { useEffect, useState } from 'react';
import { Typography, Button, Tab, Tabs, Stack, Grid, TextField, FormControl, Select, MenuItem } from '@mui/material';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import { editWarehouse } from '~/data/mutation/warehouse/warehouse-mutation';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';

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
    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [editedWarehouse, setEditedWarehouse] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('');

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
                    setIsSuccess(true);
                    setIsError(false);
                    setSuccessMessage(response.message);
                }
                updateWarehouseInList(response.data);
                // Handle the response as needed
                console.log('Category updated:', response);
            }
        } catch (error) {
            // Handle errors
            console.error('Error updating brand:', error);
            setIsError(true);
            setIsSuccess(false);
            if (error.response?.data?.message === 'Invalid request') {
                setErrorMessage('Yêu cầu không hợp lệ');
            }
        }
    };
    // const updateWarehouseStatus = async () => {
    //     try {
    //         let newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

    //         const response = await editStatusWarehouse(warehouseId, newStatus);

    //         if (response.status === '200 OK') {
    //             setIsSuccess(true);
    //             setIsError(false);
    //             setSuccessMessage(response.message);
    //         }

    //         // Sử dụng hàm để cập nhật trạng thái trong danh sách categories trong CategoryPage
    //         updateWarehouseStatusInList(warehouseId, newStatus);
    //         setCurrentStatus(newStatus);

    //         console.log('Product status updated:', response);
    //     } catch (error) {
    //         console.error('Error updating category status:', error);
    //         setIsError(true);
    //         setIsSuccess(false);
    //         setErrorMessage(error.response.data.message);
    //         if (error.response) {
    //             console.log('Error response:', error.response);
    //         }
    //     }
    // };

    const deleteWarehouse = async () => {
        try {
            await deleteWarehouse(warehouseId);
            onClose();
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    };

    const handleEdit = (field, value) => {
        setEditedWarehouse((prevBrand) => ({
            ...prevBrand,
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
                    {isSuccess && <SuccessAlerts />}
                    {isError && <ErrorAlerts errorMessage={errorMessage} />}
                    <Button variant="contained" color="primary" onClick={updateWarehouse}>
                        Cập nhập
                    </Button>
                </div>
            )}
            {selectedTab === 1 && (
                <div style={{ flex: 1 }}>{/* Hiển thị nội dung cho tab "Lịch sử thanh toán" ở đây */}</div>
            )}
        </div>
    );
};

export default WarehouseDetailForm;
