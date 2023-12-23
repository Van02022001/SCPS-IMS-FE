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

import { editItemLocations } from '~/data/mutation/items/item-mutation';
import { getAllLocation } from '~/data/mutation/location/location-mutation';

import AddLocationToWarehouse from './AddLocationToWarehouse';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';

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

const occupiedLocationStyle = {
    borderColor: 'red',
};

const UpdateLocationsForm = ({
    open,
    onClose,
    dataReceiptDetail,
    detailId,
    onUpdate, // Pass onUpdate function from AddLocationsForm
    selectedLocations,
}) => {
    const [quantity, setQuantity] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [toLocation_id, setToLocation_id] = useState([]);

    const [showLocationSelection, setShowLocationSelection] = useState(false);
    const [locationQuantities, setLocationQuantities] = useState({});
    //state chọn muti
    const [selectedLocationsMuti, setSelectedLocationsMuti] = useState([]);
    const [quantityMap, setQuantityMap] = useState({});

    const [isCreateLocationFormOpen, setCreateLocationFormOpen] = useState(false);
    // Thông báo
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');

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

    const handleClosePopup = () => {
        setShowLocationSelection(false);
        onClose();
    };

    const handleOpenPopup = () => {
        const initialQuantities = {};
        dataReceiptDetail.details.forEach((item) => {
            initialQuantities[item.id] = item.quantity - (quantityMap[item.id] || 0);
        });

        setQuantityMap(initialQuantities);

        const remainingQuantity = Object.values(initialQuantities).reduce(
            (acc, remaining) => acc + remaining,
            0
        );

        setShowLocationSelection(remainingQuantity > 0);
    };

    const updateLocations = async () => {
        try {
            const locationsToUpdate = selectedLocationsMuti.map((location) => ({
                quantity: quantityMap[location.id],
                toLocation_id: location.id,
                shelfNumber: location.shelfNumber,
                binNumber: location.binNumber,
            }));

            const response = await editItemLocations(detailId, {
                locations: locationsToUpdate,
            });

            onUpdate && onUpdate({
                detailId: detailId,
                quantity: Object.values(quantityMap).reduce((acc, quantity) => acc + quantity, 0),
                locations: locationsToUpdate,
            });

            console.log('locationsToUpdate', locationsToUpdate);

            const remainingQuantity = Object.values(locationQuantities).reduce(
                (acc, remaining) => acc + remaining,
                0
            );

            if (remainingQuantity === 0) {
                handleClosePopup();
            } else {
                handleOpenPopup();
            }
        } catch (error) {
            console.error('Error updating item locations:', error);

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
            getAllLocation()
                .then((response) => {
                    const data = response.data;
                    const dataArray = Array.isArray(data) ? data : [data];
                    setToLocation_id(dataArray);
                })
                .catch((error) => console.error('Error fetching locations:', error));

            handleOpenPopup();
        }
    }, [open]);

    const handleQuantityChange = (locationId, event) => {
        // Stop event propagation to prevent hiding the input
        event.stopPropagation();

        setQuantityMap((prevQuantityMap) => ({
            ...prevQuantityMap,
            [locationId]: event.target.value,
        }));
    };
    const handleOpenCreateLocation = () => {
        setCreateLocationFormOpen(true);
    };

    const handleCloseCreateLocationDialog = async () => {
        try {
            // Cập nhật danh sách vị trí sau khi tạo mới
            const response = await getAllLocation();
            const data = response.data;
            const dataArray = Array.isArray(data) ? data : [data];
            setToLocation_id(dataArray);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }

        // Đóng popup tạo vị trí
        setCreateLocationFormOpen(false);
    };

    const handleSaveLocation = (successMessage) => {
        handleCloseCreateLocationDialog();

        setSnackbarSuccessMessage(successMessage === 'Create location successfully' ? 'Tạo thêm vị trí thành công!' : 'Thành công');
        setSnackbarSuccessOpen(true);
    };
    return (
        <>
            <Dialog open={open} onClose={handleClosePopup} maxWidth="md">
                <DialogTitle>Hãy Chọn Địa Chỉ Trong Kho</DialogTitle>
                <DialogContent>
                    <Button variant="outlined" color="primary" onClick={handleOpenCreateLocation}>
                        Thêm Vị Trí
                    </Button>
                    <AddLocationToWarehouse
                        open={isCreateLocationFormOpen}
                        onClose={handleCloseCreateLocationDialog}
                        onSave={handleSaveLocation}
                    />
                    <Grid container spacing={2}>
                        {/* Display a list of locations */}
                        {toLocation_id.map((toLocation) => (
                            <Grid item key={toLocation.id} xs={6} md={4} lg={3}>
                                <div
                                    style={{
                                        ...locationStyle,
                                        ...(selectedLocationsMuti.some((selected) => selected.id === toLocation.id) ? selectedLocationStyle : {}),
                                        ...(toLocation.item_quantity > 0 ? occupiedLocationStyle : {}),
                                    }}
                                    onClick={() => handleLocationClick(toLocation)}
                                >
                                    <Typography variant="body1">
                                        {`${toLocation.shelfNumber} - ${toLocation.binNumber} `}
                                    </Typography>
                                    {selectedLocationsMuti.some((selected) => selected.id === toLocation.id) && (
                                        <div>
                                            <TextField
                                                size="small"
                                                label="Số lượng"
                                                variant="outlined"
                                                fullWidth
                                                margin="normal"
                                                value={quantityMap[toLocation.id] || ''}
                                                onChange={(event) => handleQuantityChange(toLocation.id, event)}
                                                onClick={(event) => event.stopPropagation()}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                    <Button variant="contained" color="primary" onClick={updateLocations} style={{ marginTop: 20 }}>
                        Lưu
                    </Button>
                </DialogContent>
            </Dialog>
            <SnackbarSuccess
                open={snackbarSuccessOpen}
                handleClose={() => {
                    setSnackbarSuccessOpen(false);
                    setSnackbarSuccessMessage('');
                }}
                message={snackbarSuccessMessage}
                style={{ bottom: '16px', right: '16px' }}
            />
        </>
    );
};
export default UpdateLocationsForm;
