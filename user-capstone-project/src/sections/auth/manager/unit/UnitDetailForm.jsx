import React, { useEffect, useState } from 'react';
import { Typography, Button, Tab, Tabs, Stack, Grid, TextField, FormControl, Select, MenuItem } from '@mui/material';
import { deleteOrigins, editOrigins } from '~/data/mutation/origins/origins-mutation';


const UnitDetailForm = ({ units, unitsId, onClose, isOpen, mode }) => {
    const [expandedItem, setExpandedItem] = useState(unitsId);
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);

    const [editedUnit, setEditedUnit] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setFormHeight(1000);
        } else {
            setFormHeight(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (mode === 'create') {
            setEditedUnit({
                name: '',
            });
        } else {
            const unit = units.find((o) => o.id === unitsId);
            console.log(unit);
            if (unit) {
                // Create a new object with only the desired fields
                const editedUnit = {
                    name: unit.name,
                };

                setEditedUnit(editedUnit);
            }
        }
    }, [units, unitsId, mode]);

    const unit = units.find((o) => o.id === unitsId);

    if (!unit) {
        return null;
    }

    const updateUnit = async () => {
        try {
            if (editedUnit) {
                // Define the update data
                const updateData = {
                    name: editedUnit.name,
                };

                // Call your API to update the category
                const response = await editOrigins(unitsId, updateData);

                // Handle the response as needed
                console.log('Category updated:', response);
            }
        } catch (error) {
            // Handle errors
            console.error('Error updating unit:', error);
        }
    };

    const deleteUnit = async () => {
        try {
            await deleteOrigins(unitsId);
            onClose();
        } catch (error) {
            console.error('Error deleting unit:', error);
        }
    };

    const handleEdit = (field, value) => {

        setEditedUnit((prevUnit) => ({
            ...prevUnit,
            [field]: value,
        }));
    };
    const handleSave = () => {
        // Xử lý lưu
    };

    const handleDelete = () => {
        // Xử lý xóa
    };

    return (
        <div
            id="productDetailForm"
            className="ProductDetailForm"
            style={{
                backgroundColor: 'white',
                zIndex: 999,
            }}
        >
            {selectedTab === 0 && (
                <div>
                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Tên thương hiệu:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Tên thương hiệu"
                                        sx={{ width: '70%' }}
                                        value={editedUnit ? editedUnit.name : ''}
                                        onChange={(e) => handleEdit('name', e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>
                    <Button variant="contained" color="primary" onClick={updateUnit}>
                        Cập nhập
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={deleteUnit}>
                        Xóa
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleDelete}>
                        Hủy bỏ
                    </Button>
                </div>
            )}
            {selectedTab === 1 && (
                <div style={{ flex: 1 }}>{/* Hiển thị nội dung cho tab "Lịch sử thanh toán" ở đây */}</div>
            )}
        </div>
    );
};

export default UnitDetailForm;
