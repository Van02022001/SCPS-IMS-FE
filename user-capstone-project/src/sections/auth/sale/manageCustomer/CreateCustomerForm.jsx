import React, { useState } from 'react';
import {
    DialogContent,
    TextField,
    Button,
    Grid,
    Typography,
    Stack,
    FormControl,
    Select,
    MenuItem,
    IconButton,
} from '@mui/material';
import SuccessAlerts from '../../../../components/alert/SuccessAlert';
import ErrorAlerts from '../../../../components/alert/ErrorAlert';
import capitalizeFirstLetter from '../../../../components/validation/capitalizeFirstLetter';
// api
import { createCustomer } from '~/data/mutation/customer/customer-mutation';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';
import CloseIcon from '@mui/icons-material/Close';

const CreateCustomerForm = ({ onClose, onSave }) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [taxCode, setTaxCode] = useState('');
    const [address, setAddress] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');

    //thông báo
    //========================== Hàm notification của trang ==================================
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [open1, setOpen1] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Create unit successfully') {
            setSuccessMessage('Tạo thành công');
        } else if (message === 'Update SubCategory successfully.') {
            setSuccessMessage('Cập nhập danh mục thành công');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Email already in use!') {
            setErrorMessage('Email đã tồn tại !');
        } else if (message === 'Phone number already in use!!') {
            setErrorMessage('Số điện thoại đã được sử dụng !');
        } else if (message === 'Tax code already in use!') {
            setErrorMessage('Tax code đã tồn tại !');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        console.log('Closing Snackbar...');
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
    const handleCloseSnackbar = () => {
        setOpen(false);
        setOpen1(false);
    };
    //============================================================

    const handleSubmit = async () => {
        try {
            const customerParams = {
                code,
                name,
                phone,
                email,
                taxCode,
                address,
                type,
                description,
            };

            const response = await createCustomer(customerParams);
            console.log('Customer created:', response);
            if (response.status === '200 OK') {
                handleSuccessMessage(response.message);
                handleCloseSnackbar();
            }
        } catch (error) {
            console.error('Error creating user:', error);
            handleErrorMessage(error.response?.data?.message);
        }
    };
    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <DialogContent style={{ width: '90%' }}>
                    <div style={{ marginLeft: 100 }}>
                        <Stack spacing={4} margin={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Mã:{' '}
                                        </Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Mã"
                                            sx={{ width: '70%' }}
                                            onChange={(e) => setCode(capitalizeFirstLetter(e.target.value))}
                                            value={code}
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
                                            Tên khách hàng:{' '}
                                        </Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Tên khách hàng"
                                            sx={{ width: '70%' }}
                                            onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
                                            value={name}
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
                                            Số điện thoại:{' '}
                                        </Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Số điện thoại"
                                            onChange={(e) => setPhone(e.target.value)}
                                            sx={{ width: '70%' }}
                                            value={phone}
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
                                            Email:{' '}
                                        </Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Email"
                                            onChange={(e) => setEmail(e.target.value)}
                                            sx={{ width: '70%' }}
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
                                            Mã thuế:{' '}
                                        </Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Mã thuế"
                                            onChange={(e) => setTaxCode(capitalizeFirstLetter(e.target.value))}
                                            sx={{ width: '70%' }}
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
                                            Địa chỉ:{' '}
                                        </Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Địa chỉ"
                                            onChange={(e) => setAddress(e.target.value)}
                                            sx={{ width: '70%' }}
                                        />
                                    </Grid>

                                    <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                        <Grid
                                            container
                                            spacing={1}
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{ marginBottom: 4, gap: 5 }}
                                        >
                                            <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                                Loại khách hàng:{' '}
                                            </Typography>

                                            <Select
                                                size="small"
                                                labelId="group-label"
                                                id="group-select"
                                                sx={{ width: '70%', fontSize: '14px' }}
                                                onChange={(e) => setType(e.target.value)}
                                            >
                                                <MenuItem value="INDIVIDUAL">Cá nhân</MenuItem>
                                                <MenuItem value="COMPANY">Công ty</MenuItem>
                                            </Select>
                                        </Grid>
                                    </FormControl>

                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Mô tả:{' '}
                                        </Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Mô tả"
                                            onChange={(e) => setDescription(e.target.value)}
                                            sx={{ width: '70%' }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Button color="primary" variant="contained" onClick={handleSubmit}>
                                Tạo
                            </Button>
                            <SnackbarSuccess
                                open={open}
                                handleClose={handleCloseSnackbar}
                                message={successMessage}
                                action={action}
                                style={{ bottom: '16px', right: '16px' }}
                            />
                            <SnackbarError
                                open={open1}
                                handleClose={handleCloseSnackbar}
                                message={errorMessage}
                                action={action}
                                style={{ bottom: '16px', right: '16px' }}
                            />
                        </Stack>
                    </div>
                </DialogContent>
            </div>
        </>
    );
};

export default CreateCustomerForm;
