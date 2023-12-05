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

const AddLocationsForm = ({ open, onClose, dataReceiptDetail }) => {
    const [quantity, setQuantity] = useState('');
    const [toLocation_id, setToLocation_id] = useState([]);
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [showLocationSelection, setShowLocationSelection] = useState(false);
    const [locationQuantities, setLocationQuantities] = useState({});
    const [popupOpen, setPopupOpen] = useState(false);

    const [openSelectLocationDialog, setOpenSelectLocationDialog] = useState(false);



    // Thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    console.log('Data Receipt Detail in AddLocationsForm:', dataReceiptDetail);
    const handleOpenSelectLocationDialog = () => {
        setOpenSelectLocationDialog(true);
    };

    const handleCloseSelectLocationDialog = () => {
        setOpenSelectLocationDialog(false);
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
            quantity
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
        const receiptDetailId = dataReceiptDetail.details[0].id;

        const remainingQuantity = dataReceiptDetail.details.reduce(
            (acc, item) => acc - (locationQuantities[item.id] || 0),
            quantity
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
            const response = await editItemLocations(receiptDetailId, itemLocationsParams);

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
        <>
            <Dialog open={open} onClose={handleClosePopup}>
                <DialogTitle>Hãy Chọn Địa Chỉ Trong Kho</DialogTitle>
                <DialogContent>
                    {/* <Grid
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
                    </Grid> */}

                    {/* Display item details */}
                    <CardContent>
                        <Table>
                            <TableBody>
                                <TableRow
                                    variant="subtitle1"
                                    sx={{
                                        fontSize: '20px',
                                        backgroundColor: '#f0f1f3',
                                        height: 50,
                                        textAlign: 'start',
                                        fontFamily: 'bold',
                                        padding: '10px 0 0 20px',
                                    }}
                                >
                                    <TableCell>Tên sản phẩm</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell>Vị trí kho</TableCell>
                                </TableRow>
                                {dataReceiptDetail.details && dataReceiptDetail.details.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.itemName}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>
                                            {locationQuantities[item.id] < item.quantity && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleOpenLocationSelection(item.id)}
                                                >
                                                    Chọn vị trí
                                                </Button>
                                            )}
                                            {/* Assuming itemId is available elsewhere in your state */}
                                            {!locationQuantities[item.id] && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleOpenLocationSelection()}
                                                //itemId
                                                >
                                                    Chọn vị trí
                                                </Button>

                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {/* Location selection */}
                    {showLocationSelection && (
                        <>
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
                        </>
                    )}

                    {/* Display success or error messages */}
                    {isSuccess && <SuccessAlerts message={successMessage} />}
                    {isError && <ErrorAlerts errorMessage={errorMessage} />}
                </DialogContent>
                {/* Button to show location selection */}
                {/* {!showLocationSelection && (
                <div style={{ padding: '16px' }}>
                    <Button variant="contained" color="primary" onClick={handleOpenPopup}>
                        Chọn Vị Trí
                    </Button>
                </div>
            )} */}
                {!showLocationSelection && (
                    <div style={{ padding: '16px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ main: '#1976D2' }} // You can adjust the color as needed
                            onClick={() => handleOpenLocationSelection()}
                        //item.id
                        >
                            Chọn vị trí
                        </Button>
                        {/* <InventorySelection
                            open={openSelectLocationDialog}
                            onClose={handleCloseSelectLocationDialog}
                        /> */}
                    </div>
                )}
                {/* Button to update locations */}
                {showLocationSelection && (
                    <div style={{ padding: '16px' }}>
                        <Button variant="contained" color="primary" onClick={updateLocations}>
                            Lưu
                        </Button>
                    </div>
                )}
                <div style={{ padding: '16px' }}>
                    <Button variant="contained" color="primary" onClick={updateLocations}>
                        Lưu
                    </Button>
                </div>
            </Dialog>
        </>
    );
};

export default AddLocationsForm;
