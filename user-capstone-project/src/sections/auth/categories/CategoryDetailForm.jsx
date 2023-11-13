import React, { useEffect, useState } from 'react';
import { Typography, Button, Tab, Tabs, Stack, Grid, TextField, FormControl, Select, MenuItem } from '@mui/material';

import { editCategories, editStatusCategories } from '~/data/mutation/categories/categories-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';

const CategoryDetailForm = ({
    categories,
    updateCategoryInList,
    updateCategoryStatusInList,
    categoryStatus,
    categoriesId,
    onClose,
    isOpen,
    mode,
}) => {
    const [expandedItem, setExpandedItem] = useState(categoriesId);
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);

    const [editedCategory, setEditedCategory] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('');

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
            setEditedCategory({
                name: '',
                description: '',
            });
        } else {
            const category = categories.find((o) => o.id === categoriesId);
            console.log(category);
            if (category) {
                // Create a new object with only the desired fields
                const editedCategory = {
                    name: category.name,
                    description: category.description,
                };

                setEditedCategory(editedCategory);
                setCurrentStatus(category.status);

                console.log(editedCategory);
            }
        }
    }, [categoriesId, categories, mode]);

    const category = categories.find((o) => o.id === categoriesId);

    if (!category) {
        return null;
    }

    const updateCategory = async () => {
        try {
            if (editedCategory) {
                // Define the update data
                const updateData = {
                    name: editedCategory.name,
                    description: editedCategory.description,
                };

                // Call your API to update the category
                const response = await editCategories(categoriesId, updateData);

                if (response.status === '200 OK') {
                    setIsSuccess(true);
                    setIsError(false);
                    setSuccessMessage(response.message);
                }

                updateCategoryInList(response.data);

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

    const handleEdit = (field, value) => {
        // Create a copy of the editedCategory object with the updated field
        setEditedCategory((prevCategory) => ({
            ...prevCategory,
            [field]: value,
        }));
    };
    // Thay đổi status
    const updateCategoryStatus = async () => {
        try {
            let newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

            const response = await editStatusCategories(categoriesId, newStatus);

            if (response.status === '200 OK') {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.message);
            }

            // Sử dụng hàm để cập nhật trạng thái trong danh sách categories trong CategoryPage
            updateCategoryStatusInList(categoriesId, newStatus);
            setCurrentStatus(newStatus);

            console.log('Category status updated:', response);
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
                            <Grid item xs={10}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Tên thể loại:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Tên sản phẩm"
                                        sx={{ width: '70%' }}
                                        value={editedCategory ? editedCategory.name : ''}
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
                                    <Typography variant="body1">Mô tả:</Typography>
                                    <TextField
                                        id="outlined-multiline-static"
                                        multiline
                                        rows={10}
                                        size="small"
                                        variant="outlined"
                                        label="Mô tả"
                                        sx={{ width: '70%' }}
                                        value={editedCategory ? editedCategory.description : ''}
                                        onChange={(e) => handleEdit('description', e.target.value)}
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
                                        value={category.createdAt}
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
                                    <Typography variant="body1">Ngày cập nhập:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Ngày cập nhập"
                                        sx={{ width: '70%' }}
                                        value={category.updatedAt}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <div style={{ background: currentStatus === 'Active' ? 'green' : 'red' }} />
                        <Typography variant="body1">Trạng thái: {currentStatus}</Typography>
                    </Stack>
                    {isSuccess && <SuccessAlerts />}
                    {isError && <ErrorAlerts errorMessage={errorMessage} />}
                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={1} sx={{ gap: '10px' }}>
                            <Button variant="contained" color="primary" onClick={updateCategory}>
                                Cập nhật
                            </Button>
                            <Button variant="contained" color="error" onClick={updateCategoryStatus}>
                                Thay đổi trạng thái
                            </Button>
                            {/* <Button variant="outlined" color="secondary" onClick={handleDelete}>
                                Xóa
                            </Button> */}
                            <Button variant="outlined" color="error" onClick={handleDelete}>
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

export default CategoryDetailForm;
