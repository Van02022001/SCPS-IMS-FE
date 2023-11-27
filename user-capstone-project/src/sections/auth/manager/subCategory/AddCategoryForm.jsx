import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material';
// api
import { createCategories } from '~/data/mutation/categories/categories-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';

const AddCategoryForm = ({ open, onClose, onSave }) => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
                setSuccessMessage(response.data.message);
                console.log(response.data.message);
            }
        } catch (error) {
            console.error("Can't fetch category", error);
            setIsError(true);
            setIsSuccess(false);
            setErrorMessage(error.response.data.message);
            if (error.response) {
                console.log('Error response:', error.response.data.message);
            }
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
                    onChange={(e) => setCategoryName(capitalizeFirstLetter(e.target.value))}
                />
                <TextField
                    label="Mô tả nhóm hàng"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(capitalizeFirstLetter(e.target.value))}
                />
                {isSuccess && <SuccessAlerts message={successMessage} />}
                {isError && <ErrorAlerts errorMessage={errorMessage} />}
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
