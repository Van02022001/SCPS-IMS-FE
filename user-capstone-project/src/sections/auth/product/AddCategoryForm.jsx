import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material';
// api
import { createCategories } from '~/data/mutation/categories/categories-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';

const AddCategoryForm = ({ open, onClose, onSave }) => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [isSuccess, setIsSuccess] = useState(false); // New state for success message
    const [isError, setIsError] = useState(false);

    const handleSave = async () => {
        const categoriesParams = {
            name: categoryName,
            description: categoryDescription,
        };
        try {
            const response = await createCategories(categoriesParams);
            console.log(response);
            console.log(response.status);

            if (response.status === 200) {
                setIsSuccess(true);
                setIsError(false);
            } else {
                if (response.data && response.data.message) {

                    setIsError(response.data.message);
                } else if (Array.isArray(response.data) && response.data.length > 0) {
                    // If there are specific error details, display them
                    const errorMessages = response.data.map((error) => error.message).join(', ');
                    setIsError(`Validation errors: ${errorMessages}`);
                } else {
                    // Use the default error message
                    setIsError('An error occurred.');
                }
                setIsSuccess(false);
            }
        } catch (error) {
            console.error("Can't fetch category", error);
            setIsError(true);
            setIsSuccess(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Thêm nhóm hàng</DialogTitle>
            <DialogContent>
                <TextField
                    label="Tên nhóm hàng"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                <TextField
                    label="Mô tả nhóm hàng"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                />
                {isSuccess && <SuccessAlerts />}
                {isError && <ErrorAlerts errorMessage={isError} />}
            </DialogContent>
            <div style={{ padding: '16px' }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    lưu
                </Button>
            </div>
        </Dialog>
    );
};

export default AddCategoryForm;
