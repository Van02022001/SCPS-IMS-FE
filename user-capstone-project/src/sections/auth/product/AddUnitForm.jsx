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
// api
import { createUnits } from '~/data/mutation/unit/unit-mutation';



const AddUnitForm = ({ open, onClose, onSave }) => {
    const [unitName, setUnitName] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handleSave = async () => {
        const unitParams = {
            name: unitName,
        }
        try {
            const response = await createUnits(unitParams);

            if (response.status === "200 OK") {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.message);
                console.log(response);
            }
        } catch (error) {
            console.error("can't feaching category", error);
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
            <DialogTitle>Thêm đơn vị</DialogTitle>
            <DialogContent sx={{ width: 500 }}>
                <TextField
                    label="Tên đơn vị"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={unitName}
                    onChange={(e) => setUnitName(capitalizeFirstLetter(e.target.value))}
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
            {/* Notification */}
            {/* <Snackbar
                open={showNotification || errorMessage.length > 0}
                autoHideDuration={6000}
                onClose={closeNotification}
            >
                {errorMessage ? (
                    <Alert onClose={closeNotification} severity="error">
                        {errorMessage}
                    </Alert>
                ) : (
                    <Alert onClose={closeNotification} severity="success">
                        Đơn vị đã được tạo thành công.
                    </Alert>
                )}
            </Snackbar> */}
        </Dialog>
    );
};

export default AddUnitForm;