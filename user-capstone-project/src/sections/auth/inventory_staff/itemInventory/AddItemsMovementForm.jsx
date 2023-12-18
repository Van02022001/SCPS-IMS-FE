import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Select,
    Typography,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';

import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import { editItemLocations } from '~/data/mutation/items/item-mutation';
import { getAllLocation, getAllLocationByItem } from '~/data/mutation/location/location-mutation';
import {
    createItemMovements,
    getItemsByMovementsHistory,
} from '~/data/mutation/items-movement/items-movement-mutation';

const AddItemsMovementForm = ({ open, onClose, onSave, itemId, itemMovementsData }) => {
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');
    const [fromLocation_id, setFromLocation_id] = useState('');
    const [toLocation_id, setToLocation_id] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false); // Add state for controlling popup visibility
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [selectedFromLocationId, setSelectedFromLocationId] = useState('');

    // Thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleClosePopup = () => {
        setPopupOpen(false);
        onClose();
    };

    console.log(itemId);

    const CreateItemMovement = async () => {
        const itemLocationsParams = {
            quantity,
            notes,
            item_id: itemId,
            fromLocation_id: selectedFromLocationId,
            toLocation_id: selectedLocationId,
        };

        try {
            const response = await createItemMovements(itemLocationsParams);

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

    // useEffect(() => {
    //     if (popupOpen) {
    //         getAllLocationByItem(itemId)
    //             .then((respone) => {
    //                 const data = respone.data;
    //                 const dataArray = Array.isArray(data) ? data : [data];
    //                 setToLocation_id(dataArray);
    //                 setFromLocation_id(dataArray);
    //                 console.log(dataArray);
    //             })
    //             .catch((error) => console.error('Error fetching categories:', error));
    //     }
    // }, [popupOpen]);

    useEffect(() => {
        if (open) {
            getAllLocationByItem(itemId)
                .then((respone) => {
                    const data = respone.data;
                    const dataArray = Array.isArray(data) ? data : [data];
                    setFromLocation_id(dataArray);
                    console.log(dataArray);
                })
                .catch((error) => console.error('Error fetching categories:', error));
        }
        getAllLocation()
            .then((respone) => {
                const data = respone.data;
                const dataArray = Array.isArray(data) ? data : [data];
                setToLocation_id(dataArray);
                console.log(dataArray);
            })
            .catch((error) => console.error('Error fetching categories:', error));
    }, [open]);

    console.log(fromLocation_id);

    return (
        <Dialog open={open} onClose={handleClosePopup}>
            <DialogTitle>Chuyển đổi vị trí sản phẩm</DialogTitle>
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
                <Grid
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ marginBottom: 4, gap: 5 }}
                >
                    <Typography variant="body1">Ghi chú:</Typography>
                    <TextField
                        label="Ghi chú"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </Grid>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="toLocation_id">Từ vị trí</InputLabel>
                    <Select
                        labelId="group-label"
                        id="group-select"
                        sx={{ width: '100%', fontSize: '14px' }}
                        value={selectedFromLocationId}
                        onChange={(e) => setSelectedFromLocationId(e.target.value)}
                    >
                        {Array.isArray(fromLocation_id) &&
                            fromLocation_id.map((item) =>
                                item.locations.map((fromLocation) => (
                                    <MenuItem key={fromLocation.id} value={fromLocation.id}>
                                        {`${fromLocation.binNumber} - ${fromLocation.shelfNumber}- ${
                                            fromLocation.warehouse ? fromLocation.warehouse.name : ''
                                        }`}
                                    </MenuItem>
                                )),
                            )}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="toLocation_id">Đến vị trí</InputLabel>
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
                <Button variant="contained" color="primary" onClick={CreateItemMovement}>
                    lưu
                </Button>
            </div>
        </Dialog>
    );
};

export default AddItemsMovementForm;
