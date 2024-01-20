import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Tab,
    Tabs,
    Stack,
    Grid,
    TextField,
    Select,
    MenuItem,
    IconButton,
} from '@mui/material';

import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import { editLocations } from '~/data/mutation/location/location-mutation';
import { getAllLocation_tag } from '~/data/mutation/location_tag/location_tag-mutaion';
import CloseIcon from '@mui/icons-material/Close';
import CustomDialog from '~/components/alert/ConfirmDialog';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';

const LocationDetailForm = ({ locations, locationsId, onClose, isOpen, mode, updateLocationInList }) => {
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [tags_id, setTags_id] = useState([]);
    const [editedLocation, setEditedLocation] = useState(null);

    //thông báo
    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [confirmOpen1, setConfirmOpen1] = useState(false);
    const [confirmOpen2, setConfirmOpen2] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Update location successfully') {
            setSuccessMessage('Cập nhập vị trí thành công !');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === '404 NOT_FOUND') {
            setErrorMessage('Mô tả quá dài');
        } else if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Location was existed') {
            setErrorMessage('Vị trí đã tồn tại !');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setOpen1(false);
        setSuccessMessage('');
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
    const handleConfirmClose1 = () => {
        setConfirmOpen1(false);
    };

    const handleConfirmUpdate1 = () => {
        setConfirmOpen1(false);
        updateLocation();
    };

    const handleConfirm1 = () => {
        setConfirmOpen1(true);
    };

    //========================== Hàm notification của trang ==================================

    useEffect(() => {
        if (isOpen) {
            setFormHeight(1000);
        } else {
            setFormHeight(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (mode === 'create') {
            // const defaultTagsId = tags_id.find((tag) => tag.name === 'Ống').id;
            setEditedLocation({
                shelfNumber: '',
                binNumber: '',
                tags_id: [], // Set tags_id to null initially (not selected)
            });
        } else {
            const location = locations.find((o) => o.id === locationsId);
            console.log(location);
            if (location) {
                const tagIds = location.tags ? location.tags.map((tag) => tag.id) : [];
                // Create a new object with only the desired fields
                const editedLocation = {
                    shelfNumber: location.shelfNumber,
                    binNumber: location.binNumber,
                    tags_id: tagIds,
                };

                setEditedLocation(editedLocation);
            }
        }
    }, [locations, locationsId, mode]);

    useEffect(() => {
        getAllLocation_tag()
            .then((response) => {
                const data = response.data;
                console.log('Tags data:', data);
                setTags_id(data);
            })
            .catch((error) => console.error('Error fetching tags_id:', error));
    }, []);

    const location = locations.find((o) => o.id === locationsId);

    if (!location) {
        return null;
    }

    const updateLocation = async () => {
        try {
            if (editedLocation) {
                // Define the update data
                const updateData = {
                    shelfNumber: editedLocation.shelfNumber,
                    binNumber: editedLocation.binNumber,
                    tags_id: editedLocation.tags_id,
                };

                // Call your API to update the Location
                const response = await editLocations(locationsId, updateData);
                if (response.status === '200 OK') {
                    handleSuccessMessage(response.message);
                    updateLocationInList(response.data)
                }
                // Handle the response as needed
                console.log('Location updated:', response);
            }
        } catch (error) {
            // Handle errors
            console.log('Location updated:', error);
            handleErrorMessage(error.response.data.message);
        }
    };

    const handleEdit = (field, value) => {
        if (field === 'tags_id') {
            const tagId = value.map(Number).filter(Boolean);
            setEditedLocation((prevProduct) => ({
                ...prevProduct,
                [field]: tagId,
            }));
        } else {
            setEditedLocation((prevLocation) => ({
                ...prevLocation,
                [field]: value,
            }));
        }
    };
    const handleSave = () => {
        // Xử lý lưu
    };

    const handleDelete = () => {
        // Xử lý xóa
    };

    console.log('editedLocation', editedLocation);

    return (
        <div
            id="LocationDetailForm"
            className="LocationDetailForm"
            style={{
                backgroundColor: 'white',
                zIndex: 999,
            }}
        >
            {selectedTab === 0 && (
                <div>
                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Số kệ:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Số kệ"
                                        sx={{ width: '70%' }}
                                        value={editedLocation ? editedLocation.shelfNumber : ''}
                                        onChange={(e) =>
                                            handleEdit('shelfNumber', capitalizeFirstLetter(e.target.value))
                                        }
                                    />
                                </Grid>

                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Số ngăn:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Số ngăn"
                                        sx={{ width: '70%' }}
                                        value={editedLocation ? editedLocation.binNumber : ''}
                                        onChange={(e) => handleEdit('binNumber', capitalizeFirstLetter(e.target.value))}
                                    />
                                </Grid>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                        Nhãn:{' '}
                                    </Typography>
                                    <Grid xs={8.5}>
                                        <Select
                                            size="small"
                                            labelId="group-label"
                                            id="group-select"
                                            sx={{ width: '99%', fontSize: '14px', marginLeft: 1 }}
                                            value={editedLocation ? editedLocation.tags_id : []}
                                            onChange={(e) => handleEdit('tags_id', e.target.value)}
                                            name="tags_id"
                                            multiple
                                        >
                                            {tags_id.map((tag) => (
                                                <MenuItem key={tag.id} value={tag.id}>
                                                    {tag.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>
                    <Button variant="contained" color="primary" onClick={handleConfirm1}>
                        Cập nhập
                    </Button>
                    {/* Thông báo confirm */}
                    <CustomDialog
                        open={confirmOpen1}
                        onClose={handleConfirmClose1}
                        title="Thông báo!"
                        content="Bạn có chắc muốn cập nhật không?"
                        onConfirm={handleConfirmUpdate1}
                        confirmText="Xác nhận"
                    />
                    <SnackbarSuccess
                        open={open}
                        handleClose={handleClose}
                        message={successMessage}
                        action={action}
                        style={{ bottom: '16px', right: '16px' }}
                    />
                    <SnackbarError
                        open={open1}
                        handleClose={handleClose}
                        message={errorMessage}
                        action={action}
                        style={{ bottom: '16px', right: '16px' }}
                    />
                </div>
            )}
            {selectedTab === 1 && (
                <div style={{ flex: 1 }}>{/* Hiển thị nội dung cho tab "Lịch sử thanh toán" ở đây */}</div>
            )}
        </div>
    );
};

export default LocationDetailForm;
