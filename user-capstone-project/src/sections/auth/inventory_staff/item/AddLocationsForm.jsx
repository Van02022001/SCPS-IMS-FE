import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Select, Typography, Grid, MenuItem, FormControl, InputLabel } from '@mui/material';

import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import { editItemLocations } from '~/data/mutation/items/item-mutation';
import { getAllLocation } from '~/data/mutation/location/location-mutation';

const AddLocationsForm = ({ open, onClose, onSave, itemId }) => {
    const [quantity, setQuantity] = useState('');
    const [toLocation_id, setToLocation_id] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false); // Add state for controlling popup visibility
    const [selectedLocationId, setSelectedLocationId] = useState('');
    // Thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handleOpenPopup = () => {
        setPopupOpen(true);
    };

    const handleClosePopup = () => {
        setPopupOpen(false);
        onClose();
    };

    const updateLocations = async () => {
        const itemLocationsParams = {
            locations: [
                {
                    quantity: quantity,
                    toLocation_id: selectedLocationId,
                },
                // other location objects if needed
            ],
        };

        try {
            const response = await editItemLocations(itemId, itemLocationsParams);

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

    useEffect(() => {
        if (popupOpen) {
            // Fetch data only when the popup is open
            getAllLocation()
                .then((response) => {
                    const data = response.data;
                    const dataArray = Array.isArray(data) ? data : [data];
                    setToLocation_id(dataArray);
                    console.log(dataArray);
                })
                .catch((error) => console.error('Error fetching locations:', error));
        }
    }, [popupOpen]); // Dependency on popupOpen

    useEffect(() => {
        // Additional effect for initial data fetching when the component mounts
        if (open) {
            getAllLocation()
                .then((response) => {
                    const data = response.data;
                    const dataArray = Array.isArray(data) ? data : [data];
                    setToLocation_id(dataArray);
                    console.log(dataArray);
                })
                .catch((error) => console.error('Error fetching locations:', error));
        }
    }, [open]);
    return (
        <Dialog open={open} onClose={handleClosePopup}>
            <DialogTitle>Thêm Địa Chỉ</DialogTitle>
            <DialogContent>
                <Grid
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ marginBottom: 4, gap: 5 }}
                >
                    <Typography variant="body1">Số lượng:</Typography>
                    <TextField
                        label="Số lượng"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </Grid>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="toLocation_id">Chọn vị trí</InputLabel>
                    <Select
                        labelId="group-label"
                        id="group-select"
                        sx={{ width: '100%', fontSize: '14px' }}
                        value={selectedLocationId}
                        onChange={(e) => setSelectedLocationId(e.target.value)}
                    >
                        {Array.isArray(toLocation_id) &&
                            toLocation_id.map((toLocation) => (
                                <MenuItem key={toLocation.id} value={toLocation.id}>
                                    {`${toLocation.binNumber} - ${toLocation.shelfNumber}- ${toLocation.warehouse.name}`}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
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
