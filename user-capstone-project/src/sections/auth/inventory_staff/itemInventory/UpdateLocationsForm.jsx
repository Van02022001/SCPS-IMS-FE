import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Typography, Grid, IconButton } from '@mui/material';

import { editItemLocations } from '~/data/mutation/items/item-mutation';
import { getAllLocation, getLocationsByEmptyItem } from '~/data/mutation/location/location-mutation';
import CloseIcon from '@mui/icons-material/Close';
import AddLocationToWarehouse from './AddLocationToWarehouse';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';

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
    itembylocation,
    onSave,
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
    //========================== Hàm notification của trang ==================================
    const [open1, setOpen1] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Quantity is invalid, has not same with quantity of item import') {
            setErrorMessage('Số lượng sản phẩm không đúng với số lượng sản phẩm nhập kho !');
        } else if (message === 'ReceiptDetail was imported in location') {
            setErrorMessage('Số lượng của phiếu này đã được thêm vào địa chỉ !');
        } else if (message === 'The location already has the others item') {
            setErrorMessage('Vị trí đã có sản phẩm khác !');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen1(false);
        setErrorMessage('');
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}></Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="lage" />
            </IconButton>
        </React.Fragment>
    );

    //========================== Hàm notification của trang ==================================

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

        console.log(initialQuantities);

        setQuantityMap(initialQuantities);

        const remainingQuantity = Object.values(initialQuantities).reduce((acc, remaining) => acc + remaining, 0);

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

            if (response.status === '200 OK') {
                onSave && onSave(response.message);
                // Đóng form
                onClose && onClose();
            }

            onUpdate &&
                onUpdate({
                    detailId: detailId,
                    quantity: Object.values(quantityMap).reduce((acc, quantity) => acc + quantity, 0),
                    locations: locationsToUpdate,
                });

            console.log('locationsToUpdate', locationsToUpdate);

            const remainingQuantity = Object.values(locationQuantities).reduce((acc, remaining) => acc + remaining, 0);

            if (remainingQuantity === 0) {
                handleClosePopup();
            } else {
                handleOpenPopup();
            }
        } catch (error) {
            console.error('Error updating item locations:', error);
            handleErrorMessage(error.response.data.message);
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
            getLocationsByEmptyItem(itembylocation)
                .then((response) => {
                    const data = response.data;
                    const dataArray = Array.isArray(data) ? data : [data];
                    setToLocation_id(dataArray);
                })
                .catch((error) => console.error('Error fetching locations:', error));

            handleOpenPopup();
        }
    }, [open, itembylocation]);

    const handleQuantityChange = (locationId, event) => {
        // Stop event propagation to prevent hiding the input
        event.stopPropagation();

        const inputValue = event.target.value;

        // Validate if the input is a positive integer between 1 and 1000
        const isValidInput = /^(?:[1-9]\d{0,2}|1000)$/.test(inputValue);

        if (isValidInput || inputValue === '') {
            setQuantityMap((prevQuantityMap) => ({
                ...prevQuantityMap,
                [locationId]: inputValue,
            }));
        }
    };

    const handleOpenCreateLocation = () => {
        setCreateLocationFormOpen(true);
    };

    const handleCloseCreateLocationDialog = async () => {
        try {
            // Cập nhật danh sách vị trí sau khi tạo mới
            const response = await getLocationsByEmptyItem(itembylocation);
            const data = response.data;
            const dataArray = Array.isArray(data) ? data : [data];
            setToLocation_id(dataArray);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }

        // Đóng popup tạo vị trí
        setCreateLocationFormOpen(false);
    };

    const handleSaveLocation = (successMessage, newData) => {
        handleCloseCreateLocationDialog();

        setSnackbarSuccessMessage(
            successMessage === 'Create location successfully' ? 'Tạo thêm vị trí thành công!' : 'Thành công',
        );
        setSnackbarSuccessOpen(true);

        setToLocation_id((prevTags) => [...prevTags, newData]);
    };

    return (
        <>
            <Dialog open={open} maxWidth="xl">
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Hãy Chọn Địa Chỉ Trong Kho
                    <IconButton edge="start" color="inherit" onClick={handleClosePopup} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{ width: '1000px', height: '500px' }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleOpenCreateLocation}
                        sx={{ marginBottom: '20px' }}
                    >
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
                                        ...(selectedLocationsMuti.some((selected) => selected.id === toLocation.id)
                                            ? selectedLocationStyle
                                            : {}),
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={updateLocations}
                        style={{
                            position: 'absolute',
                            bottom: 16,
                            right: 40,
                        }}
                    >
                        Lưu
                    </Button>
                    <SnackbarError
                        open={open1}
                        handleClose={handleClose}
                        message={errorMessage}
                        action={action}
                        style={{ bottom: '16px', right: '16px' }}
                    />
                    <SnackbarSuccess
                        open={snackbarSuccessOpen}
                        handleClose={() => {
                            setSnackbarSuccessOpen(false);
                            setSnackbarSuccessMessage('');
                        }}
                        message={snackbarSuccessMessage}
                        style={{ bottom: '16px', right: '16px' }}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};
export default UpdateLocationsForm;
