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
    CardContent,
    Table,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';

import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import { editItemLocations } from '~/data/mutation/items/item-mutation';
import { getAllLocation } from '~/data/mutation/location/location-mutation';
import InventorySelection from './InventorySelection';

const UpdateLocationsForm = ({ open, onClose, dataReceiptDetail, detailId }) => {
    const [quantity, setQuantity] = useState('');
    const [toLocation_id, setToLocation_id] = useState([]);
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [showLocationSelection, setShowLocationSelection] = useState(false);
    const [locationQuantities, setLocationQuantities] = useState({});
    const [popupOpen, setPopupOpen] = useState(false);

    const [openAddLocationDialog, setOpenAddLocationDialog] = useState(false);

    // Thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleOpenAddLocationDialog = () => {
        setOpenAddLocationDialog(true);
    };

    const handleCloseAddLocationDialog = () => {
        setOpenAddLocationDialog(false);
    };

    const handleOpenPopup = () => {
        setShowLocationSelection(true);
        const initialQuantities = {};
        dataReceiptDetail.details.forEach((item) => {
            initialQuantities[item.id] = item.quantity; // Số lượng đã nhập ban đầu
        });
        setLocationQuantities(initialQuantities);

        // Kiểm tra xem có nút chọn vị trí cần hiển thị không
        // if (selectedItemId) {
        const remainingQuantity = dataReceiptDetail.details.reduce(
            (acc, item) => acc - (locationQuantities[item.id] || 0),
            quantity,
        );

        if (remainingQuantity <= 0) {
            // Ẩn nút khi đã nhập hết số lượng
            setShowLocationSelection(false);
        }
        // }
    };

    const handleClosePopup = () => {
        setShowLocationSelection(false);
        onClose();
        // setSelectedItemId(null);
    };

    const handleOpenLocationSelection = (itemId) => {
        // setSelectedItemId(itemId);
        handleOpenPopup();
    };

    const updateLocations = async () => {

        const remainingQuantity = dataReceiptDetail.details.reduce(
            (acc, detail) => acc - (locationQuantities[detail.id] || 0),
            quantity,
        );

        if (remainingQuantity < 0) {
            console.log('Số lượng nhập vào vị trí vượt quá!');
            return;
        }

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
            const response = await editItemLocations(detailId, itemLocationsParams);

            if (response.status === '200 OK') {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.message);
                setLocationQuantities((prevQuantities) => ({
                    ...prevQuantities,
                    [dataReceiptDetail.details[0].id]: quantity,
                }));
            }

            // updateItemInList(response.data);
            console.log('Item updated:', response);
        } catch (error) {
            console.error('An error occurred while updating the item:', error);
            setIsError(true);
            setIsSuccess(false);
            if (error.response?.data?.message === 'Receipt Detail not found') {
                setErrorMessage('Không tìm thấy chi tiết phiếu !');
            }
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
                })
                .catch((error) => console.error('Error fetching locations:', error));
        }
    }, [open]);

    console.log(dataReceiptDetail.details);

    console.log('Detail ID in UpdateLocationsForm:', detailId);

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

export default UpdateLocationsForm;
