import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Table,
    TableBody,
    TableRow,
    TableCell,
    CardContent,
} from '@mui/material';

import { getExaminationItem } from '~/data/mutation/items/item-mutation';
import { getAllLocation } from '~/data/mutation/location/location-mutation';
import InventorySelection from './InventorySelection';
import UpdateLocationsForm from './UpdateLocationsForm';

const AddLocationsForm = ({ open, onClose, dataReceiptDetail, updateDataReceiptDetail, onUpdate }) => {
    const [quantity, setQuantity] = useState('');
    const [toLocation_id, setToLocation_id] = useState([]);
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [showLocationSelection, setShowLocationSelection] = useState(false);
    const [locationQuantities, setLocationQuantities] = useState({});

    const [selectedLocationsFlag, setSelectedLocationsFlag] = useState({});
    const [openUpdateLocationsForm, setOpenUpdateLocationsForm] = useState(false);

    // State to manage the selected locations for each detailId
    const [selectedLocations, setSelectedLocations] = useState({});

    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
    const [selectedDetailId, setSelectedDetailId] = useState(null);

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

        // Update selectedLocations for the specific detailId
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

    // const handleOpenPopup = () => {
    //     setShowLocationSelection(true);
    //     // Fetch locations when opening the popup
    //     getAllLocation()
    //         .then((response) => {
    //             const data = response.data;
    //             const dataArray = Array.isArray(data) ? data : [data];
    //             setToLocation_id(dataArray);
    //         })
    //         .catch((error) => console.error('Error fetching locations:', error));

    //     const initialQuantities = {};
    //     dataReceiptDetail.details.forEach((item) => {
    //         initialQuantities[item.id] = item.quantity;
    //     });
    //     setLocationQuantities(initialQuantities);
    // };

    const handleClosePopup = () => {
        setShowLocationSelection(false);
        onClose();
    };

    // const handleUpdate = ({ detailId, quantity, locations }) => {
    //     updateDataReceiptDetail((prevData) => {
    //         const updatedDetails = prevData.details.map((detail) => {
    //             if (detail.id === detailId) {
    //                 setSelectedLocationsFlag((prevFlag) => ({
    //                     ...prevFlag,
    //                     [detailId]: true,
    //                 }));

    //                 // Update selectedLocations for the specific detailId
    //                 setSelectedLocations((prevSelectedLocations) => {
    //                     return {
    //                         ...prevSelectedLocations,
    //                         [detailId]: locations,
    //                     };
    //                 });

    //                 return {
    //                     ...detail,
    //                     quantity: quantity,
    //                     locations: locations,
    //                 };
    //             }
    //             return detail;
    //         });

    //         return {
    //             ...prevData,
    //             details: updatedDetails,
    //         };
    //     });
    // };
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
        getAllLocation()
            .then((response) => {
                const data = response.data;
                const dataArray = Array.isArray(data) ? data : [data];
                setToLocation_id(dataArray);
            })
            .catch((error) => console.error('Error fetching locations:', error));
    }, []);

    return (
        <>
            <Dialog open={open} onClose={handleClosePopup}>
                <DialogTitle>Hãy Chọn Địa Chỉ Trong Kho</DialogTitle>
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
                                                {/* Log values to check */}
                                                {console.log('locationQuantities:', locationQuantities)}
                                                {console.log('selectedLocationsFlag:', selectedLocationsFlag)}
                                                {console.log('selectedLocations:', selectedLocations)}

                                                {/* Debugging log */}
                                                {console.log('Is flag true?', selectedLocationsFlag[detail.id])}

                                                {selectedLocations[detail.id] && (
                                                    <div>
                                                        {`${selectedLocations[detail.id].shelfNumber}`}-{`${selectedLocations[detail.id].binNumber}`}-{`${selectedLocations[detail.id].warehouse.name}`}


                                                    </div>
                                                )}
                                                {!selectedLocationsFlag[detail.id] && <div>Vị trí chưa có hay cập nhập!</div>}
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
                                            <UpdateLocationsForm
                                                open={openAddCategoryDialog}  // Use the correct state variable here
                                                onClose={handleCloseAddCategoryDialog}
                                                dataReceiptDetail={dataReceiptDetail}
                                                details={dataReceiptDetail.details}
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
            </Dialog>
        </>
    );
};



export default AddLocationsForm;
