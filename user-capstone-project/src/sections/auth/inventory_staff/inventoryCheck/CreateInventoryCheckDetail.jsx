import React, { useEffect, useState } from 'react';
import {
    TextField,
    TableRow,
    TableCell,
    TableBody,
    Table,
    DialogContent,
    List,
    ListItem,
    TableHead,
} from '@mui/material';

const CreateInventoryCheckDetail = ({ inventoryCheckData, inventoryCheckId, onClose, isOpen, mode, onUpdateQuantities, onUpdateQuantitiesFromDetail }) => {
    const [formHeight, setFormHeight] = useState(0);
    // const [itemsCheckData, setItemsCheckData] = useState([]);
    const [updatedQuantities, setUpdatedQuantities] = useState([]);
    const [updatedQuantitiesFromDetail, setUpdatedQuantitiesFromDetail] = useState([]);

    const [locationInfo, setLocationInfo] = useState({});

    const [editedItem, setEditedItem] = useState({});
    const [selectedItemCheckDetailId, setSelectedItemCheckDetailId] = useState(null);


    const handleQuantityChange = (locationId, event) => {
        const value = parseInt(event.target.value, 10);

        setUpdatedQuantitiesFromDetail((prevQuantities) => {
            // Kiểm tra xem locationId đã tồn tại trong mảng chưa
            const existingItemIndex = prevQuantities.findIndex((item) => item.locationId === locationId);

            if (value === 0) {
                // Nếu giá trị là 0, loại bỏ phần tử từ mảng nếu đã tồn tại
                if (existingItemIndex !== -1) {
                    const updatedQuantities = [...prevQuantities];
                    updatedQuantities.splice(existingItemIndex, 1);
                    return updatedQuantities;
                }
            } else {
                // Nếu locationId đã tồn tại, cập nhật giá trị
                if (existingItemIndex !== -1) {
                    const updatedQuantities = [...prevQuantities];
                    updatedQuantities[existingItemIndex] = { locationId, quantity: value };
                    return updatedQuantities;
                } else {
                    // Nếu locationId chưa tồn tại, thêm phần tử mới vào mảng
                    return [...prevQuantities, { locationId, quantity: value }];
                }
            }
        });
    };

    useEffect(() => {
        console.log(updatedQuantitiesFromDetail, "Bên detail nè");
        onUpdateQuantitiesFromDetail(updatedQuantitiesFromDetail);
    }, [updatedQuantitiesFromDetail]);

    useEffect(() => {
        if (isOpen) {
            setFormHeight(1000);
        } else {
            setFormHeight(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (mode === 'create') {
            console.log('Creating editedItem...');
            setEditedItem({
                description: 0,
                details: [
                    {
                        itemId: 0,
                        actualQuantity: 0,
                        note: "string",
                        locationQuantities: [
                            {
                                locationId: 0,
                                quantity: 0
                            }
                        ]
                    }
                ],
            });
        } else {
            const item = inventoryCheckData.find((o) => o.id === inventoryCheckId);
            if (item) {
                const editedItem = {
                    description: 'Mô tả',
                    details: [
                        {
                            itemId: item.id,
                            actualQuantity: item.quantity,
                            note: 'Mô tả chi tiết',
                            locationQuantities: item.locations.map((location) => ({
                                locationId: location.id,
                                quantity: location.item_quantity,
                            })),
                        },
                    ],
                };

                // Lưu thông tin shelfNumber và binNumber vào locationInfo state
                setLocationInfo(
                    item.locations.reduce((acc, location) => {
                        acc[location.id] = {
                            shelfNumber: location.shelfNumber,
                            binNumber: location.binNumber,
                        };
                        return acc;
                    }, {})
                );

                console.log('Created editedItem:', editedItem);
                setEditedItem(editedItem);
            }
        }
    }, [inventoryCheckData, inventoryCheckId, mode]);


    return (
        <>
            <DialogContent>
                <List>
                    {editedItem?.details?.map((itemDetail) => (
                        <ListItem key={itemDetail.itemId}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Vị trí</TableCell>
                                        <TableCell>Số lượng hiện tại</TableCell>
                                        <TableCell>Số lượng thực tế</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {itemDetail?.locationQuantities?.map((locationQuantity) => (
                                        <TableRow key={locationQuantity.locationId}>
                                            <TableCell>{`${locationInfo[locationQuantity.locationId]?.shelfNumber}, ${locationInfo[locationQuantity.locationId]?.binNumber}`}</TableCell>
                                            <TableCell>{locationQuantity.quantity}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    label="Số lượng thực tế"
                                                    type="number"
                                                    value={updatedQuantitiesFromDetail.find(item => item.locationId === locationQuantity.locationId)?.quantity || 0}
                                                    onChange={(event) => handleQuantityChange(locationQuantity.locationId, event)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </>
    );
};

export default CreateInventoryCheckDetail;
