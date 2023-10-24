import React, { useEffect, useState } from 'react';
import { Typography, Button, Tab, Tabs, Stack, Grid, TextField, FormControl, Select, MenuItem } from '@mui/material';
import { deleteOrigins, editOrigins } from '~/data/mutation/origins/origins-mutation';


const OriginDetailForm = ({ origins, originsId, onClose, isOpen, mode }) => {
    const [expandedItem, setExpandedItem] = useState(originsId);
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);

    const [editedOrigin, setEditedOrigin] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setFormHeight(1000);
        } else {
            setFormHeight(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (mode === 'create') {
            setEditedOrigin({
                name: '',
            });
        } else {
            const origin = origins.find((o) => o.id === originsId);
            console.log(origin);
            if (origin) {
                // Create a new object with only the desired fields
                const editedOrigin = {
                    name: origin.name,
                };

                setEditedOrigin(editedOrigin);

                console.log(editedOrigin);
            }
        }
    }, [originsId, origins, mode]);

    const origin = origins.find((o) => o.id === originsId);

    if (!origin) {
        return null;
    }

    const updateOrigin = async () => {
        try {
            if (editedOrigin) {
                // Define the update data
                const updateData = {
                    name: editedOrigin.name,
                };

                // Call your API to update the category
                const response = await editOrigins(originsId, updateData);

                // Handle the response as needed
                console.log('Category updated:', response);
            }
        } catch (error) {
            // Handle errors
            console.error('Error updating category:', error);
        }
    };

    const deleteOrigin = async () => {
        try {
            await deleteOrigins(originsId);
            onClose(); 
        } catch (error) {
            console.error('Error deleting origin:', error);
        }
    };

    const handleEdit = (field, value) => {
        
        setEditedOrigin((prevOrigin) => ({
            ...prevOrigin,
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
                                        value={editedOrigin ? editedOrigin.name : ''}
                                        onChange={(e) => handleEdit('name', e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>
                    <Button variant="contained" color="primary" onClick={updateOrigin}>
                        Cập nhập
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={deleteOrigin}>
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

export default OriginDetailForm;
