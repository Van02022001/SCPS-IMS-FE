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

const UpdateLocationToExportForm = ({
    open,
    onClose,
    dataReceiptDetail,
    detailId,
    details,
    onUpdate, // Pass onUpdate function from AddLocationsForm
    selectedLocations,
}) => {
    const [quantity, setQuantity] = useState('');
    const [toLocation_id, setToLocation_id] = useState([]);
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [showLocationSelection, setShowLocationSelection] = useState(false);
    const [locationQuantities, setLocationQuantities] = useState({});
    const [receiptDetailId, setReceiptDetailId] = useState(null);
    // Thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleClosePopup = () => {
        setShowLocationSelection(false);
        onClose();
    };

    const handleOpenPopup = () => {
        const initialQuantities = {};
        dataReceiptDetail.details.forEach((item) => {
            initialQuantities[item.id] = item.quantity - (locationQuantities[item.id] || 0);
        });

        setLocationQuantities(initialQuantities);

        const remainingQuantity = Object.values(initialQuantities).reduce(
            (acc, remaining) => acc + remaining,
            0
        );

        setShowLocationSelection(remainingQuantity > 0);
    };

    const updateLocations = async () => {
        try {
            const response = await editItemLocations(detailId, {
                receipt_detail_id: receiptDetailId,
                locations: [
                    {
                        quantity: quantity,
                        toLocation_id: selectedLocationId,
                    },
                ],
            });
            const selectedLocation = toLocation_id.find(location => location.id === selectedLocationId);

            onUpdate({
                detailId: detailId,
                quantity: quantity,
                locations: selectedLocation,
            });

            setIsSuccess(true);
            setIsError(false);
            setSuccessMessage('Update successful!');

            // Close the popup only if there are no remaining quantities
            const remainingQuantity = Object.values(locationQuantities).reduce(
                (acc, remaining) => acc + remaining,
                0
            );

            if (remainingQuantity === 0) {
                handleClosePopup();
            } else {
                // If there are remaining quantities, update the form and keep it open
                handleOpenPopup();
            }
        } catch (error) {
            console.error('Error updating item locations:', error);
            setIsError(true);
            setIsSuccess(false);
            setErrorMessage('Error updating item locations. Please try again.');
        }
    };

    useEffect(() => {
        if (Object.keys(selectedLocations).length > 0) {
            handleClosePopup();
            // Nếu cần thực hiện các hành động khác sau khi đóng pop-up, bạn có thể thêm vào đây
        }
    }, [selectedLocations]);

    useEffect(() => {
        if (open) {
            setReceiptDetailId(dataReceiptDetail.id);
            if (details && details.length > 0) {
                details.forEach((detail) => {
                    getAllLocationByItem(detail.itemId)
                        .then((response) => {
                            const data = response.data;
                            console.log(data); // In ra dữ liệu từ API
                            const dataArray = Array.isArray(data) ? data : [data];
                            setToLocation_id(dataArray);
                        })
                        .catch((error) => console.error('Error fetching locations:', error));
                });
            }
            handleOpenPopup();
        }
    }, [open, details]);
    console.log(toLocation_id.locations);
    return (
        <>
            <Dialog open={open} onClose={handleClosePopup}>
                <DialogTitle>Hãy Chọn Địa Chỉ Trong Kho</DialogTitle>
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
                        <InputLabel id="toLocation_id">Chọn vị trí</InputLabel>
                        <Select
                            labelId="group-label"
                            id="group-select"
                            sx={{ width: '100%', fontSize: '14px' }}
                            value={selectedLocationId || ''}
                            onChange={(e) => setSelectedLocationId(e.target.value)}
                        >
                            {toLocation_id.map((locationData) => (
                                locationData.locations.map((toLocation) => (
                                    <MenuItem key={toLocation.id} value={toLocation.id}>
                                        {`${toLocation.binNumber} - ${toLocation.shelfNumber} `}
                                    </MenuItem>
                                ))
                            ))}
                        </Select>
                    </Grid>
                    {/* Display success or error messages */}
                    {isSuccess && <SuccessAlerts message={successMessage} />}
                    {isError && <ErrorAlerts errorMessage={errorMessage} />}
                    <Button variant="contained" color="primary" onClick={updateLocations}>
                        Lưu
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UpdateLocationToExportForm;
