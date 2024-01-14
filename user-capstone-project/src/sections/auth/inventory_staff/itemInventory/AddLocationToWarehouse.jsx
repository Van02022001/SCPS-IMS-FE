import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    Select,
    Stack,
    TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import { createLocations } from '~/data/mutation/location/location-mutation';
import AddLocationTagForm from '../location_tag/AddLocationTagForm';
import { getAllLocation_tag } from '~/data/mutation/location_tag/location_tag-mutaion';
import SnackbarError from '~/components/alert/SnackbarError';
import CloseIcon from '@mui/icons-material/Close';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';

const AddLocationToWarehouse = ({ open, onClose, onSave }) => {
    const [shelfNumber, setShelfNumber] = useState('');
    const [binNumber, setBinNumber] = useState('');
    const [tags_id, setTags_id] = useState([]);
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
    const [tab1Data, setTab1Data] = useState({ tags_id: [] });

    //========================== Hàm notification của trang ==================================
    const [open1, setOpen1] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Location was existed') {
            setErrorMessage('Vị trí đã tồn tại !');
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
            if (response.status === '200 OK') {
                onSave && onSave(response.message, response.data);
                // Đóng form
                onClose && onClose();
            }
        } catch (error) {
            console.error('Error creating location:', error);
            handleErrorMessage(error.response.data.message);
        }
    };

    const handleOpenAddCategoryDialog = () => {
        setOpenAddCategoryDialog(true);
    };
    const handleCloseAddCategoryDialog = () => {
        setOpenAddCategoryDialog(false);
    };

    const handleSaveCategory = (successMessage, newData) => {
        // You can handle any logic here after saving the category
        handleCloseAddCategoryDialog();
        setSnackbarSuccessMessage(
            successMessage === 'Create location tag successfully' ? 'Tạo nhãn thành công!' : 'Thành công',
        );
        setSnackbarSuccessOpen(true);

        setTags_id((prevTags) => [...prevTags, newData]);
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
            <Dialog open={open} onClose={onClose} maxWidth="xl">
                <DialogTitle>Thêm vị trí</DialogTitle>
                <DialogContent style={{ width: '500px' }}>
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
                        <Grid xs={12}>
                            <Select
                                size="large"
                                labelId="group-label"
                                id="group-select"
                                sx={{ width: '86.5%', fontSize: '14px' }}
                                value={[...tab1Data.tags_id] || []}
                                onChange={handleTab1DataChange}
                                name="tags_id"
                                multiple
                                required
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 300,
                                        },
                                    },
                                }}
                            >
                                {tags_id.map((tag) => (
                                    <MenuItem
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                        key={tag && tag.id}
                                        value={tag && tag.id}
                                    >
                                        {tag && tag.name}
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
                        <AddLocationTagForm
                            open={openAddCategoryDialog}
                            onClose={handleCloseAddCategoryDialog}
                            onSave={handleSaveCategory}
                        />
                        <Button color="primary" variant="contained" onClick={handleCreateLocation}>
                            Tạo
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
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddLocationToWarehouse;
