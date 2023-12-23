import React, { useEffect, useState } from 'react';
import { Button, DialogContent, Grid, IconButton, MenuItem, Select, Stack, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import { createLocations } from '~/data/mutation/location/location-mutation';
import AddLocationTagForm from '../location_tag/AddLocationTagForm';
import { getAllLocation_tag } from '~/data/mutation/location_tag/location_tag-mutaion';
import SnackbarError from '~/components/alert/SnackbarError';
import CloseIcon from '@mui/icons-material/Close';

const CreateLocationForm = (props) => {
    const [shelfNumber, setShelfNumber] = useState('');
    const [binNumber, setBinNumber] = useState('');
    const [tags_id, setTags_id] = useState([]);
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
    const [tab1Data, setTab1Data] = useState({ tags_id: [] });

    //thông báo
    const [errorMessage, setErrorMessage] = useState('');
    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Error during item transfer: The given id must not be null') {
            setErrorMessage('Vui lòng chọn và điền đầy đủ thông tin !');
        } else if (message === 'Error during item transfer: Item inventory not found in source warehouse') {
            setErrorMessage('Không tìm thấy vật phẩm trong kho này !');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        console.log('Closing Snackbar...');
        setOpen(false);
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

    const handleCloseSnackbar = () => {
        setOpen(false);
        setOpen1(false);
    };

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
                props.onClose(response.data);
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            console.error('Error creating location:', error);
            handleErrorMessage(error.response?.data?.message);
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
            <div style={{ textAlign: 'center' }}>
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
                        <SnackbarError
                            open={open1}
                            handleClose={handleCloseSnackbar}
                            message={errorMessage}
                            action={action}
                            style={{ bottom: '16px', right: '16px' }}
                        />
                        <Button color="primary" variant="contained" onClick={handleCreateLocation}>
                            Tạo
                        </Button>
                    </Stack>
                </DialogContent>
            </div>
        </>
    );
};

export default CreateLocationForm;
