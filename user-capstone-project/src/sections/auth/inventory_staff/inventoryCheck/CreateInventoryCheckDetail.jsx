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
    ListItemText,
    TableHead,
    DialogActions,
    Button,
} from '@mui/material';
import { getItemByWarehouse } from '~/data/mutation/items/item-mutation';
import { createInventoryCheck } from '~/data/mutation/inventoryCheck/InventoryCheck-mutation';

const CreateInventoryCheckDetail = ({ inventoryCheckData, inventoryCheckId, onClose, isOpen, mode, }) => {
    const [formHeight, setFormHeight] = useState(0);
    const [itemsCheckData, setItemsCheckData] = useState([]);
    const [updatedQuantities, setUpdatedQuantities] = useState({});
    const [locationInfo, setLocationInfo] = useState({});

    const [editedItem, setEditedItem] = useState({});

    const handleQuantityChange = (locationId, event) => {
        const value = event.target.value;
        setUpdatedQuantities((prevQuantities) => ({
            ...prevQuantities,
            [locationId]: value,
        }));
    };
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
    console.log(editedItem, "editedItem");



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
                                            <TableCell>{`Kệ: ${locationInfo[locationQuantity.locationId]?.shelfNumber}, Ngăn: ${locationInfo[locationQuantity.locationId]?.binNumber}`}</TableCell>
                                            <TableCell>{locationQuantity.quantity}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    label="Số lượng thực tế"
                                                    type="number"
                                                    value={updatedQuantities[locationQuantity.locationId] || ''}
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
