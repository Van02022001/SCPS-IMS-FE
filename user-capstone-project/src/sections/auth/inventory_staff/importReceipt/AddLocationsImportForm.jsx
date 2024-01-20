import React, { useEffect, useState } from 'react';
import {
    DialogTitle,
    DialogContent,
    Button,
    Table,
    TableBody,
    TableRow,
    TableCell,
    CardContent,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getExaminationItem, getUpdatedLocationDetails } from '~/data/mutation/items/item-mutation';
import { getAllLocation } from '~/data/mutation/location/location-mutation';

import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';
import UpdateLocationsImportForm from './UpdateLocationsImportForm';
import { useNavigate } from 'react-router-dom';

const AddLocationsImportForm = ({ open, onClose, importReceipst, onUpdate, onSave }) => {
    const navigate = useNavigate();
    const [toLocation_id, setToLocation_id] = useState([]);
    const [locationQuantities, setLocationQuantities] = useState({});
    console.log(setLocationQuantities);
    const [selectedLocationsFlag, setSelectedLocationsFlag] = useState({});
    // State to manage the selected locations for each detailId
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [checkUpdateLocation, setCheckUpdateLocation] = useState(false);
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
    const [selectedDetailId, setSelectedDetailId] = useState(null);

    const [selectedDetailQuantity, setSelectedDetailQuantity] = useState(null);
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
        } else if (message === 'Các sản phẩm chưa được cập nhật hết vị trí.') {
            setErrorMessage('Các sản phẩm chưa được cập nhật hết vị trí !');
        } else if (message === 'ReceiptDetail was imported in location') {
            setErrorMessage('Số lượng của phiếu này đã được thêm vào địa chỉ !');
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

    const handleUpdateLocations = ({ detailId, locations }) => {
        console.log('Updating flag for detailId:', detailId);

        setSelectedLocations((prevSelectedLocations) => {
            const existingIndex = prevSelectedLocations.findIndex((loc) => loc.detailId === detailId);

            if (existingIndex !== -1) {
                // If detailId already exists, update the locations
                return prevSelectedLocations.map((loc, index) =>
                    index === existingIndex ? { ...loc, locations } : loc,
                );
            } else {
                // If detailId doesn't exist, add a new entry
                return [...prevSelectedLocations, { detailId, locations }];
            }
        });
        setCheckUpdateLocation(true);
    };

    const handleOpenAddCategoryDialog = (detailId) => {
        setSelectedDetailId(detailId);
        const selectedDetail = importReceipst.details.find((detail) => detail.id === detailId);
        setSelectedDetailQuantity(selectedDetail ? selectedDetail.quantity : null);
        setOpenAddCategoryDialog(true);
    };

    const handleCloseAddCategoryDialog = () => {
        setOpenAddCategoryDialog(false);
    };
    console.log(importReceipst);

    const handleClosePopup = () => {
        onClose();
        // const message = 'Lưu để xác nhận và đóng';
        // setOpen1(true);
        // setErrorMessage(message);
    };

    useEffect(() => {
        console.log('Selected Locations Flag Updated:', selectedLocationsFlag);
        console.log('Location Quantities Updated:', locationQuantities);
    }, [selectedLocationsFlag, locationQuantities]);

    const handleConfirm = async () => {

        try {
            const response = await getExaminationItem(importReceipst.id);
            console.log('API Response:', response);
            if (response.status === '200 OK') {
                onSave && onSave(response.message, 'Completed');
                // Đóng form
                onClose && onClose();
                navigate('/inventory-staff/import-receipt', {
                    state: { successMessage: response.message },
                });
            }
        } catch (error) {
            console.error('Error calling getExaminationItem API:', error);
            handleErrorMessage(error.response.data.message);
        }
    };
    const checkUpdatedDetails = async (receiptId) => {
        try {
            const response = await getUpdatedLocationDetails(receiptId);
            if (response.status === '200 OK') {
                const updatedDetailIds = response.data.map((detail) => detail.id);
                setSelectedLocationsFlag((prevFlag) => {
                    const newFlag = { ...prevFlag };
                    importReceipst.details.forEach((detail) => {
                        newFlag[detail.id] = updatedDetailIds.includes(detail.id);
                    });
                    return newFlag;
                });
            }
        } catch (error) {
            console.error('Error calling getUpdatedDetails API:', error);
        }
    };

    useEffect(() => {
        getAllLocation()
            .then((response) => {
                const data = response.data;
                const dataArray = Array.isArray(data) ? data : [data];
                setToLocation_id(dataArray);
            })
            .catch((error) => console.error('Error fetching locations:', error));
    }, []);

    useEffect(() => {
        // Call the function to check updated details when the component mounts
        if (importReceipst.id) {
            checkUpdatedDetails(importReceipst.id);
        }
    }, [importReceipst.id]);

    const handleSaveLocation = (successMessage) => {
        setSnackbarSuccessMessage(
            successMessage === 'Update item locations successfully' ? 'Cập nhật vị trí thành công!' : 'Thành công',
        );
        setSnackbarSuccessOpen(true);
    };

    return (
        <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Hãy Chọn Địa Chỉ Trong Kho
                <IconButton edge="start" color="inherit" onClick={handleClosePopup} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <CardContent>
                    <Table>
                        <TableBody>
                            {importReceipst.details &&
                                importReceipst.details.map((detail) => (
                                    <TableRow key={detail.id}>
                                        <TableCell>{detail.itemName}</TableCell>
                                        <TableCell>{detail.quantity}</TableCell>
                                        <TableCell>
                                            {console.log('selectedLocations:', selectedLocations)}

                                            {selectedLocationsFlag[detail.id] || checkUpdateLocation ? (
                                                <div>Vị trí đã được cập nhật.</div>
                                            ) : (
                                                <div>Vị trí chưa có hoặc chưa cập nhật!</div>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {!locationQuantities[detail.id] > 0 &&
                                                !selectedLocationsFlag[detail.id] &&
                                                selectedLocations.find((loc) => loc.detailId === detail.id) ===
                                                undefined && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleOpenAddCategoryDialog(detail.id)}
                                                        disabled={selectedLocationsFlag[detail.id]}
                                                    >
                                                        {selectedLocationsFlag[detail.id]
                                                            ? 'Đã cập nhật'
                                                            : 'Chọn vị trí'}
                                                    </Button>
                                                )}
                                        </TableCell>
                                        <UpdateLocationsImportForm
                                            open={openAddCategoryDialog}
                                            onClose={handleCloseAddCategoryDialog}
                                            dataReceiptDetail={importReceipst}
                                            itembylocation={selectedDetailId}
                                            detailId={selectedDetailId}
                                            itemId={
                                                importReceipst?.details && selectedDetailId
                                                    ? importReceipst.details.find(
                                                        (detail) => detail.id === selectedDetailId,
                                                    )?.item?.id
                                                    : null
                                            }
                                            onUpdate={handleUpdateLocations}
                                            selectedLocations={selectedLocations[selectedDetailId] || []}
                                            toLocationData={toLocation_id}
                                            onSave={handleSaveLocation}
                                            selectedDetailQuantity={selectedDetailQuantity}
                                        />
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </DialogContent>
            <div style={{ padding: '16px' }}>
                <Button variant="contained" color="primary" onClick={handleConfirm}>
                    Lưu
                </Button>
                <SnackbarSuccess
                    open={snackbarSuccessOpen}
                    handleClose={() => {
                        setSnackbarSuccessOpen(false);
                        setSnackbarSuccessMessage('');
                    }}
                    message={snackbarSuccessMessage}
                    style={{ bottom: '16px', right: '16px' }}
                />
                <SnackbarError
                    open={open1}
                    handleClose={handleClose}
                    message={errorMessage}
                    action={action}
                    style={{ bottom: '16px', right: '16px' }}
                />
            </div>
        </>
    );
};

export default AddLocationsImportForm;
