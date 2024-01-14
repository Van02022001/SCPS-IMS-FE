import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Stack,
    Grid,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';

import { editCategories, editStatusCategories } from '~/data/mutation/categories/categories-mutation';

import CloseIcon from '@mui/icons-material/Close';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import CustomDialog from '~/components/alert/ConfirmDialog';
import SnackbarError from '~/components/alert/SnackbarError';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';

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

    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [confirmOpen1, setConfirmOpen1] = useState(false);
    const [confirmOpen2, setConfirmOpen2] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Update category status successfully') {
            setSuccessMessage('Cập nhập trạng thái thể loại thành công !');
        } else if (message === 'Update category successfully') {
            setSuccessMessage('Cập nhập thể loại thành công !');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Category name was existed') {
            setErrorMessage('Tên thể loại đã tồn tại !');
        } else if (message === 'Update category successfully') {
            setErrorMessage('Cập nhập thể loại thành công !');
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
        updateCategory();
    };

    const handleConfirm1 = () => {
        setConfirmOpen1(true);
    };

    const handleConfirmUpdateStatus2 = () => {
        setConfirmOpen2(false);
        updateCategoryStatus();
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
                    handleSuccessMessage(response.message); // thông báo
                }

                updateCategoryInList(response.data);

                console.log('Category updated:', response);
            }
        } catch (error) {
            // Handle errors
            console.error('Error updating category:', error);
            if (error.response) {
                console.log('Error response:', error.response);
            }
            handleErrorMessage(error.response.data.message); // thông báo
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
                setSuccessMessage(response.message);
                handleSuccessMessage(response.message);
            }

            // Sử dụng hàm để cập nhật trạng thái trong danh sách categories trong CategoryPage
            updateCategoryStatusInList(categoriesId, newStatus);
            setCurrentStatus(newStatus);

            console.log('Category status updated:', response);
        } catch (error) {
            console.error('Error updating category status:', error);
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
                                        id="outlined-multiline-static"
                                        multiline
                                        rows={10}
                                        size="small"
                                        variant="outlined"
                                        label="Mô tả"
                                        sx={{ width: '70%' }}
                                        value={editedCategory ? editedCategory.description : ''}
                                        onChange={(e) =>
                                            handleEdit('description', capitalizeFirstLetter(e.target.value))
                                        }
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
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Ngày cập nhập"
                                        sx={{ width: '70%', pointerEvents: 'none' }}
                                        value={category.updatedAt}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <div style={{ background: currentStatus === 'Active' ? 'green' : 'red' }} />
                        <Typography variant="body1">Trạng thái: {currentStatus}</Typography>
                    </Stack>
                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={1} sx={{ gap: '10px' }}>
                            <Button variant="contained" color="primary" onClick={handleConfirm1}>
                                Cập nhật
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

                            <Button variant="contained" color="error" onClick={handleConfirm2}>
                                Thay đổi trạng thái
                            </Button>
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

export default CategoryDetailForm;
