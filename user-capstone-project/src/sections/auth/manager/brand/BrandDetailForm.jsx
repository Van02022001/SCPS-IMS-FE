import React, { useEffect, useState } from 'react';
import { Typography, Button, Tab, Tabs, Stack, Grid, TextField, FormControl, Select, MenuItem } from '@mui/material';
import { deleteOrigins, editOrigins } from '~/data/mutation/origins/origins-mutation';
import { deleteBrands, editBrands } from '~/data/mutation/brand/brands-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';

const BrandDetailForm = ({ brands, brandsId, onClose, isOpen, mode }) => {
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [editedBrand, setEditedBrand] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setFormHeight(1000);
        } else {
            setFormHeight(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (mode === 'create') {
            setEditedBrand({
                name: '',
                description: '',
            });
        } else {
            const brand = brands.find((o) => o.id === brandsId);
            console.log(brand);
            if (brand) {
                // Create a new object with only the desired fields
                const editedBrand = {
                    name: brand.name,
                    description: brand.description,
                };

                setEditedBrand(editedBrand);
            }
        }
    }, [brands, brandsId, mode]);

    const brand = brands.find((o) => o.id === brandsId);

    if (!brand) {
        return null;
    }

    const updateBrand = async () => {
        try {
            if (editedBrand) {
                // Define the update data
                const updateData = {
                    name: editedBrand.name,
                    description: editedBrand.description,
                };

                // Call your API to update the category
                const response = await editBrands(brandsId, updateData);
                if (response.status === '200 OK') {
                    setIsSuccess(true);
                    setIsError(false);
                    setSuccessMessage(response.message);
                }
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
            if (error.response?.data?.error === '404 NOT_FOUND') {
                setErrorMessage('Mô tả quá dài');
            }
        }
    };

    const deleteBrand = async () => {
        try {
            await deleteBrands(brandsId);
            onClose();
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    };

    const handleEdit = (field, value) => {
        setEditedBrand((prevBrand) => ({
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
            id="brandDetailForm"
            className="BrandDetailForm"
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
                                    <Typography variant="body1">Tên thương hiệu:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Tên thương hiệu"
                                        sx={{ width: '70%' }}
                                        value={editedBrand ? editedBrand.name : ''}
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
                                    <Typography variant="body1">Mô tả:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Mô tả"
                                        multiline
                                        rows={4}
                                        sx={{ width: '70%' }}
                                        value={editedBrand ? editedBrand.description : ''}
                                        onChange={(e) =>
                                            handleEdit('description', capitalizeFirstLetter(e.target.value))
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>
                    {isSuccess && <SuccessAlerts />}
                    {isError && <ErrorAlerts errorMessage={errorMessage} />}
                    <Button variant="contained" color="primary" onClick={updateBrand}>
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

export default BrandDetailForm;
