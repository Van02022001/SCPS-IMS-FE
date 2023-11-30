import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
} from '@mui/material';

import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import { createSubCategoryMeta } from '~/data/mutation/subCategoryMeta/subCategoryMeta-mutation';
// api




const AddSubCategoryMetaForm = ({ subCategoryMetaId, open, onClose, onSave }) => {
    const [key, setKey] = useState('');
    const [description, setDescription] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handleSave = async () => {
        const subCategoryMetaParams = {
            key: key,
            description: description,
        }
        try {
            const response = await createSubCategoryMeta(subCategoryMetaId, subCategoryMetaParams);

            if (response.status === "200 OK") {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.message);
                console.log(response);
                onSave && onSave();
                // Đóng form
                onClose && onClose();
            }
        } catch (error) {
            console.error("can't feaching sub category", error);
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
            <DialogTitle>Thêm thẻ mô tả</DialogTitle>
            <DialogContent sx={{ width: 500 }}>
                <TextField
                    label="Mô tả sơ lược"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={key}
                    onChange={(e) => setKey(capitalizeFirstLetter(e.target.value))}
                />
                <TextField
                    label="Mô tả chi tiết thêm"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(capitalizeFirstLetter(e.target.value))}
                />
                {isSuccess && <SuccessAlerts message={successMessage} />}
                {isError && <ErrorAlerts errorMessage={errorMessage} />}
            </DialogContent>
            <div style={{ padding: '16px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                >
                    lưu
                </Button>
            </div>
        </Dialog>
    );
};

export default AddSubCategoryMetaForm;