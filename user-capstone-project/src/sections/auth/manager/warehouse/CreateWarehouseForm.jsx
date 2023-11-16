import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material';

import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
// api
import { createWarehouse } from '~/data/mutation/warehouse/warehouse-mutation';

const CreateWarehouseForm = ({ open, onClose, onSave }) => {
    const [warehouseName, setWarehouseName] = useState('');
    const [warehouseAddress, setWarehouseAddress] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSave = async () => {
        const warehouseParams = {
            name: warehouseName,
            address: warehouseAddress,
        };
        try {
            const response = await createWarehouse(warehouseParams);

            if (response.status === '200 OK') {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.message);
                console.log(response);
                //clear
                setWarehouseName('');
                setWarehouseAddress('');
            }
        } catch (error) {
            console.error("can't feaching category", error);
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

    return (
        <>
            <DialogContent sx={{ width: 500 }}>
                <TextField
                    label="Tên kho"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={warehouseName}
                    onChange={(e) => setWarehouseName(capitalizeFirstLetter(e.target.value))}
                />
                <TextField
                    helperText="Địa chỉ phải có từ 1 đến 200 ký tự."
                    label="Địa chỉ kho"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={warehouseAddress}
                    onChange={(e) => setWarehouseAddress(capitalizeFirstLetter(e.target.value))}
                />
                {isSuccess && <SuccessAlerts message={successMessage} />}
                {isError && <ErrorAlerts errorMessage={errorMessage} />}
            </DialogContent>
            <div style={{ padding: '16px' }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
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
        </>
    );
};

export default CreateWarehouseForm;
