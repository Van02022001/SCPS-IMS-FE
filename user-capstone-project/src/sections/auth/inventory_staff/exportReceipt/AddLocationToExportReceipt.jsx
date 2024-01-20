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

import { getAllLocationByItem } from '~/data/mutation/location/location-mutation';
import { getExaminationItem, getUpdatedLocationDetails } from '~/data/mutation/items/item-mutation';
import UpdateLocationToExportForm from './UpdateLocationToExportForm';
import { useNavigate } from 'react-router-dom';

const AddLocationToExportReceipt = ({ open, onClose, dataReceiptDetail, details, updateDataReceiptDetail, onSave }) => {

    const navigate = useNavigate();

    const [showLocationSelection, setShowLocationSelection] = useState(false);
    const [locationQuantities, setLocationQuantities] = useState({});
    console.log(showLocationSelection, setLocationQuantities);
    const [selectedLocationsFlag, setSelectedLocationsFlag] = useState({});

    // State to manage the selected locations for each detailId
    const [selectedLocations, setSelectedLocations] = useState([]);

    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
    const [selectedDetailId, setSelectedDetailId] = useState(null);

    const [checkUpdateLocation, setCheckUpdateLocation] = useState(false);

    const [selectedDetailQuantity, setSelectedDetailQuantity] = useState(null);
    // Thông báo

    const handleUpdateLocations = ({ detailId, locations }) => {
        console.log('Updating flag for detailId:', detailId);

        setSelectedLocations((prevSelectedLocations) => {
            const existingIndex = prevSelectedLocations.findIndex((loc) => loc.detailId === detailId);

            if (existingIndex !== -1) {
                return prevSelectedLocations.map((loc, index) =>
                    index === existingIndex ? { ...loc, locations } : loc,
                );
            } else {
                return [...prevSelectedLocations, { detailId, locations }];
            }
        });
        setCheckUpdateLocation(true);
    };
    const handleOpenAddCategoryDialog = (detailId) => {
        setSelectedDetailId(detailId);
        const selectedDetail = dataReceiptDetail.details.find((detail) => detail.id === detailId);
        setSelectedDetailQuantity(selectedDetail ? selectedDetail.quantity : null);
        setOpenAddCategoryDialog(true);
    };
    const handleCloseAddCategoryDialog = () => {
        setOpenAddCategoryDialog(false);
    };

    const handleClosePopup = () => {
        setShowLocationSelection(false);
        onClose();
    };


    const handleConfirm = async () => {
        // const paramReceipt = {
        //     receipt_id: dataReceiptDetail.id,
        // };

        try {
            const response = await getExaminationItem(dataReceiptDetail.id);
            console.log('API Response:', response);
            if (response.status === '200 OK') {
                onSave && onSave(response.message, 'Completed');
                // Đóng form
                onClose && onClose();
                navigate('/inventory-staff/export-receipt', {
                    state: { successMessage: response.message },
                });
            }
        } catch (error) {
            console.error('Error calling getExaminationItem API:', error);
        }
    };
    const checkUpdatedDetails = async (receiptId) => {
        try {
            const response = await getUpdatedLocationDetails(receiptId);
            if (response.status === '200 OK') {
                const updatedDetailIds = response.data.map((detail) => detail.id);
                setSelectedLocationsFlag((prevFlag) => {
                    const newFlag = { ...prevFlag };
                    dataReceiptDetail.details.forEach((detail) => {
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
        // Call the function to check updated details when the component mounts
        if (dataReceiptDetail.id) {
            checkUpdatedDetails(dataReceiptDetail.id);
        }
    }, [dataReceiptDetail.id]);

    useEffect(() => {
        if (details && details.length > 0) {
            details.forEach((detail) => {
                getAllLocationByItem(detail.itemId)
                    .then((response) => {
                        setSelectedLocations((prevSelectedLocations) => ({
                            ...prevSelectedLocations,
                            [detail.id]: response.data.locations,
                        }));
                    })
                    .catch((error) => console.error('Error fetching locations:', error));
            });
        }
    }, [details]);

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
                            {dataReceiptDetail.details &&
                                dataReceiptDetail.details.map((detail) => (
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
                                        <UpdateLocationToExportForm
                                            open={openAddCategoryDialog}
                                            onClose={handleCloseAddCategoryDialog}
                                            dataReceiptDetail={dataReceiptDetail}
                                            details={details}
                                            detailId={selectedDetailId}
                                            itemId={
                                                dataReceiptDetail?.details && selectedDetailId
                                                    ? dataReceiptDetail.details.find(
                                                        (detail) => detail.id === selectedDetailId,
                                                    )?.item?.id
                                                    : null
                                            }
                                            onUpdate={handleUpdateLocations}
                                            selectedLocations={selectedLocations}
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
            </div>

        </>
    );
};

export default AddLocationToExportReceipt;
