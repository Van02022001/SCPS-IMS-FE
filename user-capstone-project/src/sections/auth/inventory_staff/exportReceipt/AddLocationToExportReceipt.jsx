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
} from '@mui/material';


import { getAllLocation, getAllLocationByItem } from '~/data/mutation/location/location-mutation';
import { getExaminationItem } from '~/data/mutation/items/item-mutation';
import UpdateLocationToExportForm from './UpdateLocationToExportForm';



const AddLocationToExportReceipt = ({ open, onClose, dataReceiptDetail, details, updateDataReceiptDetail }) => {
    const [quantity, setQuantity] = useState('');
    const [toLocation_id, setToLocation_id] = useState([]);
    const [showLocationSelection, setShowLocationSelection] = useState(false);
    const [locationQuantities, setLocationQuantities] = useState({});
    const [selectedExportLocations, setSelectedExportLocations] = useState({});
    const [selectedLocationsFlag, setSelectedLocationsFlag] = useState({});


    const [showAllLocations, setShowAllLocations] = useState(false);
    const maxLocationsToShow = 2;
    // State to manage the selected locations for each detailId
    const [selectedLocations, setSelectedLocations] = useState({});

    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
    const [selectedDetailId, setSelectedDetailId] = useState(null);
    const [selectedLocationsData, setSelectedLocationsData] = useState({});

    // Thông báo

    const handleUpdateLocations = ({ detailId, locations }) => {
        console.log('Updating flag for detailId:', detailId);

        setSelectedLocationsFlag((prevFlag) => {
            console.log('Previous flag:', prevFlag);
            return {
                ...prevFlag,
                [detailId]: true,
            };
        });

        setSelectedLocations((prevSelectedLocations) => {
            console.log('Previous selected locations:', prevSelectedLocations);
            return {
                ...prevSelectedLocations,
                [detailId]: locations,
            };
        });
    };
    const handleOpenAddCategoryDialog = (detailId) => {
        setSelectedDetailId(detailId);
        setOpenAddCategoryDialog(true);
    };
    const handleCloseAddCategoryDialog = () => {
        setOpenAddCategoryDialog(false);
    };
    // const handleQuantityChange = (detailId, value) => {
    //     setQuantity((prevQuantity) => ({ ...prevQuantity, [detailId]: value }));
    // };

    // const handleLocationChange = (detailId, locationId) => {
    //     console.log('Selected location:', locationId);
    //     const selectedLocation = toLocation_id.find((location) => location.id === locationId);

    //     if (selectedLocation) {
    //         // Cập nhật state với thông tin vị trí và số lượng đã chọn
    //         setSelectedLocationsData((prevData) => ({
    //             ...prevData,
    //             [detailId]: {
    //                 fromLocation_id: locationId,
    //                 quantity: quantity[detailId] || 0,
    //             },
    //         }));
    //     }
    // };

    // const handleOpenAddCategoryDialog = (detailId) => {
    //     setSelectedDetailId(detailId);
    //     setOpenAddCategoryDialog(true);
    // };

    // const handleCloseAddCategoryDialog = () => {
    //     setOpenAddCategoryDialog(false);
    // };

    const handleClosePopup = () => {
        setShowLocationSelection(false);
        onClose();
    };

    useEffect(() => {
        console.log('Selected Locations Flag Updated:', selectedLocationsFlag);
        console.log('Location Quantities Updated:', locationQuantities);
    }, [selectedLocationsFlag, locationQuantities]);

    const handleConfirm = async () => {
        const paramReceipt = {
            receipt_id: dataReceiptDetail.id,
        };

        try {
            const response = await getExaminationItem(dataReceiptDetail.id);
            console.log('API Response:', response);
        } catch (error) {
            console.error('Error calling getExaminationItem API:', error);
        }
    };

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

            <DialogTitle>Hãy Chọn Địa Chỉ Lấy sản phẩm</DialogTitle>
            <DialogContent>
                <CardContent>
                    <Table>
                        <TableBody>
                            {details &&
                                details.map((detail) => (
                                    <TableRow key={detail.id}>
                                        <TableCell>{detail.itemName}</TableCell>
                                        <TableCell>{detail.quantity}</TableCell>
                                        <TableCell>
                                            {selectedLocations[detail.id] && selectedLocations[detail.id].length > 0 ? (
                                                <div>
                                                    {/* Hiển thị một số lượng cố định ban đầu */}
                                                    {selectedLocations[detail.id].slice(0, showAllLocations ? undefined : maxLocationsToShow).map((location) => (
                                                        <div key={location.id}>
                                                            {`${location.shelfNumber}-${location.binNumber}-${location.warehouse.name}`}

                                                            {` - Số lượng: ${location.item_quantity}`}
                                                        </div>
                                                    ))}
                                                    {/* Nếu có nhiều hơn số lượng cố định, thêm nút để xem thêm */}
                                                    {selectedLocations[detail.id].length > maxLocationsToShow && (
                                                        <button onClick={() => setShowAllLocations(!showAllLocations)}>
                                                            {showAllLocations ? 'Thu gọn' : 'Xem thêm'}
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>Vị trí chưa có!</div>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {/* Log values to check */}
                                            {console.log('Button Condition:', !locationQuantities[detail.id] < detail.quantity && !selectedLocationsFlag[detail.id])}
                                            {!locationQuantities[detail.id] < detail.quantity && !selectedLocationsFlag[detail.id] && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleOpenAddCategoryDialog(detail.id)}
                                                    disabled={selectedLocationsFlag[detail.id]}
                                                >
                                                    Chọn vị trí
                                                </Button>
                                            )}

                                        </TableCell>
                                        <UpdateLocationToExportForm
                                            open={openAddCategoryDialog}  // Use the correct state variable here
                                            onClose={handleCloseAddCategoryDialog}
                                            dataReceiptDetail={dataReceiptDetail}
                                            details={details}
                                            detailId={selectedDetailId}

                                            onUpdate={handleUpdateLocations}  // Pass the handleUpdateLocations function here
                                            selectedLocations={selectedLocations}
                                            toLocationData={toLocation_id}
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