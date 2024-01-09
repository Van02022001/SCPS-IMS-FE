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
    IconButton,
} from '@mui/material';

import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import { editItemLocations } from '~/data/mutation/items/item-mutation';
import {
    getAllLocation,
    getAllLocationByItem,
    getLocationsByEmptyItem,
} from '~/data/mutation/location/location-mutation';
import {
    createItemMovements,
    getItemsByMovementsHistory,
} from '~/data/mutation/items-movement/items-movement-mutation';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import CloseIcon from '@mui/icons-material/Close';
import SnackbarError from '~/components/alert/SnackbarError';

const AddItemsMovementForm = ({ open, onClose, onSave, itemId, itemMovementsData }) => {
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');
    const [fromLocation_id, setFromLocation_id] = useState('');
    const [toLocation_id, setToLocation_id] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false); // Add state for controlling popup visibility
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [selectedFromLocationId, setSelectedFromLocationId] = useState('');

    //========================== Hàm notification của trang ==================================
    const [open1, setOpen1] = React.useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');

    const handleErrorMessage = (message) => {
        setOpen1(true);
        setErrorMessage(message);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Receipt is not in the approved state for processing') {
            setErrorMessage('Phiếu không ở trạng thái được phê duyệt để xử lý !');
        } else if (message === 'location has already contains others item') {
            setErrorMessage('vị trí đã chứa mục khác!');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen1(false);
        setSuccessMessage('');
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
            }

            // updateItemInList(response.data);
            console.log('Item updated:', response);
        } catch (error) {
            console.error('An error occurred while updating the item:', error);
            handleErrorMessage(error.response?.data?.message || 'Đã xảy ra lỗi');
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
        getLocationsByEmptyItem(itemId)
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
                        onChange={(e) => setNotes(capitalizeFirstLetter(e.target.value))}
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
                <SnackbarError
                    open={open1}
                    handleClose={handleClose}
                    message={errorMessage}
                    action={action}
                    style={{ bottom: '16px', right: '16px' }}
                />
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
