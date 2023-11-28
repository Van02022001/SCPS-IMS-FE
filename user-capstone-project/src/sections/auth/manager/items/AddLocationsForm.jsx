import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Select } from '@mui/material';
// api
import { createCategories } from '~/data/mutation/categories/categories-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import { editItemLocations } from '~/data/mutation/items/item-mutation';

const AddLocationsForm = ({ open, onClose, onSave, itemId  }) => {
    const [editedLocations, setEditedLocations] = useState({});

    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const updateLocations = async () => {
        if (!editedLocations) {
            return;
        }
        try {
            const response = await editItemLocations(itemId, editedLocations);

            if (response.status === '200 OK') {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.message);
            }

            // updateItemInList(response.data);
            console.log('Item updated:', response);
        } catch (error) {
            console.error('An error occurred while updating the item:', error);
            setIsError(true);
            setIsSuccess(false);
            setErrorMessage(error.response.data.message);
            if (error.response) {
                console.log('Error response:', error.response);
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Thêm Địa Chỉ</DialogTitle>
            <DialogContent>
                <Select
                    labelId="group-label"
                    id="group-select"
                    sx={{ width: '100%', fontSize: '14px' }}
                    multiple
                    value
                    onChange
                    name="categories_id"
                    required
                >
                    Items 1
                </Select>
                <TextField label="Mô tả nhóm hàng" variant="outlined" fullWidth margin="normal" value onChange />
                <Select
                    labelId="group-label"
                    id="group-select"
                    sx={{ width: '100%', fontSize: '14px' }}
                    multiple
                    value
                    onChange
                    name="categories_id"
                    required
                >
                    Location
                </Select>
                {isSuccess && <SuccessAlerts message={successMessage} />}
                {isError && <ErrorAlerts errorMessage={errorMessage} />}
            </DialogContent>
            <div style={{ padding: '16px' }}>
                <Button variant="contained" color="primary" onClick={updateLocations}>
                    lưu
                </Button>
            </div>
        </Dialog>
    );
};

export default AddLocationsForm;
