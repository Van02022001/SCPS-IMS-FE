import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Typography, Grid, IconButton } from '@mui/material';

import { editItemLocationsExport } from '~/data/mutation/items/item-mutation';
import { getAllLocationByItem } from '~/data/mutation/location/location-mutation';
import SnackbarError from '~/components/alert/SnackbarError';
import CloseIcon from '@mui/icons-material/Close';

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
    onUpdate,
    selectedLocations,
    selectedDetailQuantity,
    onSave,
    itemId,
}) => {
    const [toLocation_id, setToLocation_id] = useState([]);

    const [showLocationSelection, setShowLocationSelection] = useState(false);
    const [locationQuantities, setLocationQuantities] = useState({});
    //state theo dõi vị trĩ
    const [selectedLocationsMuti, setSelectedLocationsMuti] = useState([]);
    const [quantityMap, setQuantityMap] = useState({});
    const [itemLocations, setItemLocations] = useState({});
    const [itemQuantities, setItemQuantities] = useState({});
    const [receiptDetailId, setReceiptDetailId] = useState(null);
    console.log(receiptDetailId, itemQuantities, itemLocations, showLocationSelection);
    //========================== Hàm notification của trang ==================================
    const [open1, setOpen1] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    console.log(itemId);
    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Số lượng sản phẩm không giống với số lượng sản phẩm xuất.') {
            setErrorMessage('Số lượng sản phẩm không giống với số lượng sản phẩm xuất !');
        } else if (message === 'ReceiptDetail was imported in location') {
            setErrorMessage('Số lượng của phiếu này đã được thêm vào địa chỉ !');
        } else if (message === 'Vị trí đã tồn tại sản phẩm khác.') {
            setErrorMessage('Vị trí đã tồn tại sản phẩm khác. !');
        } else if (message === 'Số lượng sản phẩm trong vị trí không đủ để xuất.') {
            setErrorMessage('Số lượng sản phẩm trong vị trí không đủ để xuất !');
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

    const handleClosePopup = () => {
        setQuantityMap({});
        setSelectedLocationsMuti([]);
        setItemLocations({});
        setItemQuantities({});
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

        const remainingQuantity = Object.values(initialQuantities).reduce((acc, remaining) => acc + remaining, 0);

        setShowLocationSelection(remainingQuantity > 0);
    };

    const handleQuantityChange = (locationId, event) => {
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
                receipt_detail_id: detailId,
                locations: locationsArray,
            });

            if (response.status === '200 OK') {
                onSave && onSave(response.message);
                // Đóng form
                setQuantityMap({});
                setSelectedLocationsMuti([]);
                setItemLocations({});
                setItemQuantities({});
                setShowLocationSelection(false);
                onClose && onClose();
            }

            onUpdate({
                detailId: detailId,
                quantity: Object.values(quantityMap).reduce((acc, quantity) => acc + Number(quantity), 0),
                locations: selectedLocationsMuti,
            });
            console.log('selectedLocations:', selectedLocationsMuti);
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
        }
    }, [selectedLocations]);

    useEffect(() => {
        if (open) {
            setReceiptDetailId(dataReceiptDetail.details[0].id);
            getAllLocationByItem(itemId)
                .then((response) => {
                    const data = response.data;
                    console.log(data); // In ra dữ liệu từ API
                    const dataArray = Array.isArray(data) ? data : [data];
                    setToLocation_id(dataArray);
                })
                .catch((error) => {
                    console.error('Error fetching locations:', error);
                    setToLocation_id([]);
                });

            handleOpenPopup();
        }
    }, [open, details]);

    return (
        <>
            <Dialog open={open} maxWidth="xl">
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Hãy Chọn Địa Chỉ Lấy Sản Phẩm Trong Kho
                    <IconButton edge="start" color="inherit" onClick={handleClosePopup} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Typography variant="body1" mb={2} ml={3}>
                    Số lượng thực tế: {selectedDetailQuantity}
                </Typography>
                <DialogContent style={{ width: '1000px', height: '500px' }}>
                    <Grid container spacing={2}>
                        {toLocation_id.length === 0 ? (
                            <Typography variant="body1" ml={2}>
                                Không có vị trí trong kho
                            </Typography>
                        ) : (
                            toLocation_id.map((locationData) =>
                                locationData.locations.map((location) => (
                                    <Grid item key={location.id} xs={6} md={4} lg={3}>
                                        <div
                                            key={location.id}
                                            style={{
                                                ...locationStyle,
                                                ...(selectedLocationsMuti.some(
                                                    (selected) => selected.id === location.id,
                                                )
                                                    ? selectedLocationStyle
                                                    : {}),
                                            }}
                                            onClick={() => handleLocationClick(location)}
                                        >
                                            <Typography variant="body1">
                                                {`${location.shelfNumber} - ${location.binNumber} `}
                                                <Typography variant="body1">
                                                    {`Số lượng: ${location.item_quantity} `}
                                                </Typography>
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
                                )),
                            )
                        )}
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
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UpdateLocationToExportForm;
