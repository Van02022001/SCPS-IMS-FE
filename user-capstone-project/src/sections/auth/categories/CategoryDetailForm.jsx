import React, { useEffect, useState } from 'react';
import { Typography, Button, Tab, Tabs, Stack, Grid, TextField, FormControl, Select, MenuItem } from '@mui/material';

import { editCategories, editStatusCategories } from '~/data/mutation/categories/categories-mutation';


const CategoryDetailForm = ({ categories, updateCategoryData, categoryStatus, updateCategoriesStatus, categoriesId, onClose, isOpen, mode }) => {
    const [expandedItem, setExpandedItem] = useState(categoriesId);
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);

    const [editedCategory, setEditedCategory] = useState(null);
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
                updateCategoryData([response.data])
                console.log('Category updated:', response);
            }
        } catch (error) {
            // Handle errors
            console.error('Error updating category:', error);
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
            // Đoạn này đang muốn status cũng thay đổi ở categories Page nhưng chưa hoạt động cần chỉnh sửa chút nữa
            // updateCategoriesStatus(newStatus);
            setCurrentStatus(newStatus);

            console.log('Category status updated:', response);
        } catch (error) {
            console.error('Error updating category status:', error);
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
                            <Grid item xs={6}>
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
                                        rows={4}
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
                    <Button variant="contained" color="primary" onClick={updateCategory}>
                        Cập nhập
                    </Button>
                    <Button variant="contained" color="primary" onClick={updateCategoryStatus}>
                        Thay đổi trạng thái
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleDelete}>
                        Xóa
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleDelete}>
                        Hủy bỏ
                    </Button>
                </div>
            )}
            {selectedTab === 1 && (
                <div style={{ flex: 1 }}>{/* Hiển thị nội dung cho tab "Lịch sử thanh toán" ở đây */}</div>
            )}
        </div>
    );
};

export default CategoryDetailForm;
