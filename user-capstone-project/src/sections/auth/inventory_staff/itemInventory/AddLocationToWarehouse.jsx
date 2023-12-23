import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, Grid, MenuItem, Select, Stack, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import { createLocations } from '~/data/mutation/location/location-mutation';
import AddLocationTagForm from '../location_tag/AddLocationTagForm';
import { getAllLocation_tag } from '~/data/mutation/location_tag/location_tag-mutaion';

const AddLocationToWarehouse = ({ open, onClose, onSave }) => {
    const [shelfNumber, setShelfNumber] = useState('');
    const [binNumber, setBinNumber] = useState('');
    const [tags_id, setTags_id] = useState([]);
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
    const [tab1Data, setTab1Data] = useState({ tags_id: [] });


    const handleTab1DataChange = (event) => {
        setTab1Data({ ...tab1Data, [event.target.name]: event.target.value });
    };

    const handleCreateLocation = async () => {
        const locationParams = {
            shelfNumber,
            binNumber,
            tags_id: tab1Data.tags_id || [],
        };

        try {
            const response = await createLocations(locationParams);
            console.log('Create location response:', response);
            if (response.status === 200) {
                onSave && onSave(response.message);
                // Đóng form
                onClose && onClose();
            }
        } catch (error) {
            console.error('Error creating location:', error);
        }
    };

    const handleOpenAddCategoryDialog = () => {
        setOpenAddCategoryDialog(true);
    };
    const handleCloseAddCategoryDialog = () => {
        setOpenAddCategoryDialog(false);
    };

    useEffect(() => {
        getAllLocation_tag()
            .then((response) => {
                const data = response.data;
                setTags_id(data);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Thêm vị trí</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} margin={2}>
                        <TextField
                            variant="outlined"
                            value={shelfNumber}
                            label="Số kệ"
                            onChange={(e) => setShelfNumber(capitalizeFirstLetter(e.target.value))}
                        />
                        <TextField
                            variant="outlined"
                            value={binNumber}
                            label="Số ngăn"
                            onChange={(e) => setBinNumber(capitalizeFirstLetter(e.target.value))}
                        />
                        <Grid xs={8.5}>
                            <Select
                                size="large"
                                labelId="group-label"
                                id="group-select"
                                sx={{ width: '89%', fontSize: '14px' }}
                                value={[...tab1Data.tags_id] || []}
                                onChange={handleTab1DataChange}
                                name="tags_id"
                                multiple
                                required
                            >
                                {tags_id.map((tag) => (
                                    <MenuItem
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                        key={tag.id}
                                        value={tag.id}
                                    >
                                        {tag.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Button
                                variant="outlined"
                                sx={{ padding: 1.8, minWidth: 0 }}
                                onClick={handleOpenAddCategoryDialog}
                            >
                                <AddIcon />
                            </Button>
                        </Grid>
                        <AddLocationTagForm open={openAddCategoryDialog} onClose={handleCloseAddCategoryDialog} />
                        <Button color="primary" variant="contained" onClick={handleCreateLocation}>
                            Tạo
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddLocationToWarehouse;
