import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Tab,
    Tabs,
    Stack,
    Grid,
    TextField,
    FormControl,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import { deleteOrigins, editOrigins } from '~/data/mutation/origins/origins-mutation';
import { deleteBrands, editBrands } from '~/data/mutation/brand/brands-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import { editLocations } from '~/data/mutation/location/location-mutation';
import { getAllLocation_tag } from '~/data/mutation/location_tag/location_tag-mutaion';

const LocationDetailForm = ({ locations, locationsId, onClose, isOpen, mode }) => {
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [tags_id, setTags_id] = useState([]);

    //thông báo
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [editedLocation, setEditedLocation] = useState(null);

    const handleConfirmClose = () => {
        setConfirmOpen(false);
    };

    const handleConfirmUpdate = () => {
        setConfirmOpen(false);
        updateLocation();
    };

    const handleConfirm = () => {
        setConfirmOpen(true);
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
            setEditedLocation({
                shelfNumber: '',
                binNumber: '',
                tags_id: null, // Set tags_id to null initially (not selected)
            });
        } else {
            const location = locations.find((o) => o.id === locationsId);

            if (location) {
                const tagIds = location.tags_id ? location.tags_id.map((tag) => tag.id) : null;
                // Create a new object with only the desired fields
                const editedLocation = {
                    shelfNumber: location.shelfNumber,
                    binNumber: location.binNumber,
                    tags_id: tagIds,
                };

                setEditedLocation(editedLocation);
            } else {
                // Handle the case when location is null or undefined
                setEditedLocation(null);
            }
        }
    }, [locations, locationsId, mode]);

    useEffect(() => {
        getAllLocation_tag()
            .then((respone) => {
                const data = respone.data;
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
                    setIsSuccess(true);
                    setIsError(false);
                    setSuccessMessage(response.message);
                }
                // Handle the response as needed
                console.log('Location updated:', response);
            }
        } catch (error) {
            // Handle errors
            console.error('Error updating brand:', error);
            setIsError(true);
            setIsSuccess(false);
            if (error.response?.data?.message === 'Invalid request') {
                setErrorMessage('Yêu cầu không hợp lệ');
            }
            if (error.response?.data?.error === '404 NOT_FOUND') {
                setErrorMessage('Mô tả quá dài');
            }
        }
    };

    const handleEdit = (field, value) => {
        setEditedLocation((prevLocation) => ({
            ...prevLocation,
            [field]: value,
        }));
    };
    const handleSave = () => {
        // Xử lý lưu
    };

    const handleDelete = () => {
        // Xử lý xóa
    };

    console.log('Location:', location);
    console.log('Tags:', tags_id);

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
                                        Ống:{' '}
                                    </Typography>
                                    <Grid xs={8.5}>
                                        <Select
                                            size="small"
                                            labelId="group-label"
                                            id="group-select"
                                            sx={{ width: '100%', fontSize: '14px' }}
                                            value={editedLocation?.tags_id || []}
                                            onChange={(e) => handleEdit('tags_id', e.target.value)}
                                            name="tags_id"
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
                    {isSuccess && <SuccessAlerts />}
                    {isError && <ErrorAlerts errorMessage={errorMessage} />}
                    <Button variant="contained" color="primary" onClick={handleConfirm}>
                        Cập nhập
                    </Button>
                    {/* Thông báo confirm */}
                    <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                        <DialogTitle>Thông báo!</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Bạn có chắc muốn cập nhật không?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleConfirmClose} color="primary">
                                Hủy
                            </Button>
                            <Button onClick={handleConfirmUpdate} color="primary" autoFocus>
                                Xác nhận
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
            {selectedTab === 1 && (
                <div style={{ flex: 1 }}>{/* Hiển thị nội dung cho tab "Lịch sử thanh toán" ở đây */}</div>
            )}
        </div>
    );
};

export default LocationDetailForm;
