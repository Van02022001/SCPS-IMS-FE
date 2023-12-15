import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Typography,
    Grid,
} from '@mui/material';

import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import { editItemLocationsExport } from '~/data/mutation/items/item-mutation';
import { getAllLocationByItem } from '~/data/mutation/location/location-mutation';
const locationStyle = {
    border: '3px solid #ccc',
    borderRadius: '8px',
    boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)',
    padding: '10px',
    cursor: 'pointer',
    transition: 'border-color 0.3s',
};

const selectedLocationStyle = {
    borderColor: 'green',
};


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

    const [showLocationSelection, setShowLocationSelection] = useState(false);
    const [locationQuantities, setLocationQuantities] = useState({});
    const [receiptDetailId, setReceiptDetailId] = useState(null);
    //state theo dõi vị trĩ
    const [selectedLocationsMuti, setSelectedLocationsMuti] = useState([]);
    const [quantityMap, setQuantityMap] = useState({});
    // Thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleClosePopup = () => {
        setShowLocationSelection(false);
        onClose();
    };

    const handleLocationClick = (location) => {
        const isSelected = selectedLocationsMuti.some((selected) => selected.id === location.id);

        if (isSelected) {
            setSelectedLocationsMuti(selectedLocationsMuti.filter((selected) => selected.id !== location.id));
        } else {
            setSelectedLocationsMuti([...selectedLocationsMuti, location]);
            // Only show location selection if the location is not occupied
            if (location.item_quantity === 0) {
                setShowLocationSelection(true);
            }
        }
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

    const handleQuantityChange = (locationId, event) => {
        // Stop event propagation to prevent hiding the input
        event.stopPropagation();

        setQuantityMap((prevQuantityMap) => ({
            ...prevQuantityMap,
            [locationId]: event.target.value,
        }));
    };

    const updateLocations = async () => {
        try {
            const locationsArray = selectedLocationsMuti.map((selectedLocation) => ({
                fromLocation_id: selectedLocation.id,
                quantity: quantityMap[selectedLocation.id] || 0,
            }));

            const response = await editItemLocationsExport({
                receipt_detail_id: receiptDetailId,
                locations: locationsArray,
            });

            onUpdate({
                detailId: detailId,
                quantity: Object.values(quantityMap).reduce((acc, quantity) => acc + Number(quantity), 0),
                locations: selectedLocationsMuti,
            });

            console.log('selectedLocations:', selectedLocationsMuti);
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
        }
    }, [selectedLocations]);

    useEffect(() => {
        if (open) {
            setReceiptDetailId(dataReceiptDetail.details[0].id);
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
            <Dialog open={open} onClose={handleClosePopup} maxWidth="md">
                <DialogTitle>Hãy Chọn Địa Chỉ Lấy Sản Phẩm Trong Kho</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {toLocation_id.map((locationData) => (
                            locationData.locations.map((location) => (
                                <Grid item key={location.id} xs={6} md={4} lg={3}>
                                    <div
                                        key={location.id}
                                        style={{
                                            ...locationStyle,
                                            ...(selectedLocationsMuti.some((selected) => selected.id === location.id) ? selectedLocationStyle : {}),
                                        }}
                                        onClick={() => handleLocationClick(location)}
                                    >
                                        <Typography variant="body1">
                                            {`${location.shelfNumber} - ${location.binNumber} - `}
                                            {`Số lượng: ${location.item_quantity} `}
                                            <Grid
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                sx={{ marginBottom: 4, gap: 5 }}
                                            >
                                                <TextField
                                                    size="small"
                                                    label="Số lượng"
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    value={quantityMap[location.id] || ''}
                                                    onChange={(event) => handleQuantityChange(location.id, event)}
                                                    onClick={(event) => event.stopPropagation()}
                                                />
                                            </Grid>
                                        </Typography>
                                    </div>
                                </Grid>
                            ))
                        ))}
                    </Grid>
                    <Button variant="contained" color="primary" onClick={updateLocations} style={{ marginTop: 20 }}>
                        Lưu
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UpdateLocationToExportForm;
