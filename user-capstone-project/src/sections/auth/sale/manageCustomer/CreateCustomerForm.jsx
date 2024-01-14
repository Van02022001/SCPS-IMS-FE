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
    FormHelperText,
} from '@mui/material';

import capitalizeFirstLetter from '../../../../components/validation/capitalizeFirstLetter';
// api
import { createCustomer } from '~/data/mutation/customer/customer-mutation';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';
import CloseIcon from '@mui/icons-material/Close';

const CreateCustomerForm = (props) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [taxCode, setTaxCode] = useState('');
    const [address, setAddress] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [description, setDescription] = useState('');

    //thông báo
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [taxCodeError, setTaxCodeError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [typeError, setTypeError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
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
    const validateName = (value) => {
        if (!value.trim()) {
            return 'Tên Khách hàng không được để trống';
        } else if (!/^\p{Lu}/u.test(value)) {
            return 'Chữ cái đầu phải in hoa.';
        }
        return null;
    };

    const validatePhone = (value) => {
        const phoneDigits = value;

        if (!value.trim()) {
            return 'Số điện thoại không được để trống';
        } else if (value[0] !== '0') {
            return 'Số điện thoại phải bắt đầu bằng số 0.';
        } else if (phoneDigits.length !== 10) {
            return 'Số điện thoại phải có đúng 10 số.';
        }
        return null;
    };

    const validateEmail = (value) => {
        if (!value.trim()) {
            return 'Email không được để trống.';
        } else if (!/^[a-zA-Z0-9._-]+@gmail\.com$/.test(value)) {
            return 'Email phải có định dạng @gmail.com';
        }
        return null;
    };

    const validateTaxCode = (value) => {
        if (!value.trim()) {
            return 'Mã thuế không được để trống';
        } else if (!/^\p{Lu}/u.test(value)) {
            return 'Chữ cái đầu phải in hoa.';
        }
        return null;
    };

    const validateAdress = (value) => {
        if (!value.trim()) {
            return 'Địa chỉ không được để trống.';
        } else if (!/^\p{Lu}/u.test(value)) {
            return 'Chữ cái đầu phải in hoa.';
        }
        return null;
    };

    const validateDescription = (value) => {
        if (!value.trim()) {
            return 'Mô tả không được để trống.';
        } else if (!/^\p{Lu}/u.test(value)) {
            return 'Chữ cái đầu phải in hoa.';
        }
        return null;
    };

    const handleNameChange = (e) => {
        const newName = capitalizeFirstLetter(e.target.value);
        setName(newName);

        setNameError(validateName(newName));
    };

    const handlePhoneChange = (e) => {
        const newPhone = e.target.value.replace(/\D/g, '');
        setPhone(newPhone);
        setPhoneError(validatePhone(newPhone));
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value.toLowerCase().replace(/[^a-z0-9.@]/g, '');
        setEmail(newEmail);
        setEmailError(validateEmail(newEmail));
    };
    const handleTaxCodeChange = (e) => {
        const newTaxCode = capitalizeFirstLetter(e.target.value);
        setTaxCode(newTaxCode);

        setTaxCodeError(validateTaxCode(newTaxCode));
    };

    const handleAddressChange = (e) => {
        const newAddress = capitalizeFirstLetter(e.target.value);
        setAddress(newAddress);

        setAddressError(validateAdress(newAddress));
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
        setTypeError('');
    };
    const handleDescriptionChange = (e) => {
        const newDescription = capitalizeFirstLetter(e.target.value);
        setDescription(newDescription);

        setDescriptionError(validateDescription(newDescription));
    };
    //============================================================

    const handleSubmit = async () => {
        if (!selectedType) {
            setTypeError('Vui lòng chọn loại khách hàng');
            return;
        }
        try {
            const customerParams = {
                name,
                phone,
                email,
                taxCode,
                address,
                type: selectedType,
                description,
            };

            const response = await createCustomer(customerParams);
            console.log('Customer created:', response);
            if (response.status === '201 CREATED') {
                props.onClose(response.data, response.message);
                handleSuccessMessage(response.message);

                handleCloseSnackbar();
            }
        } catch (error) {
            console.log(error);
            if (error.response?.status === 400) {
                setErrorMessage('Vui lòng nhập thông tin để tạo!');
            }
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
                                            Tên khách hàng:{' '}
                                        </Typography>

                                        <TextField
                                            helperText={nameError}
                                            error={Boolean(nameError)}
                                            size="small"
                                            variant="outlined"
                                            label="Tên khách hàng"
                                            sx={{ width: '70%' }}
                                            onChange={handleNameChange}
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
                                            helperText={phoneError}
                                            error={Boolean(phoneError)}
                                            size="small"
                                            variant="outlined"
                                            label="Số điện thoại"
                                            onChange={handlePhoneChange}
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
                                            helperText={emailError}
                                            error={Boolean(emailError)}
                                            size="small"
                                            variant="outlined"
                                            label="Email"
                                            onChange={handleEmailChange}
                                            sx={{ width: '70%' }}
                                            value={email}
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
                                            helperText={taxCodeError}
                                            error={Boolean(taxCodeError)}
                                            size="small"
                                            variant="outlined"
                                            label="Mã thuế"
                                            onChange={handleTaxCodeChange}
                                            sx={{ width: '70%' }}
                                            value={taxCode}
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
                                            helperText={addressError}
                                            error={Boolean(addressError)}
                                            size="small"
                                            variant="outlined"
                                            label="Địa chỉ"
                                            onChange={handleAddressChange}
                                            sx={{ width: '70%' }}
                                            value={address}
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
                                            <Grid xs={8.5}>
                                                <Select
                                                    size="small"
                                                    labelId="group-label"
                                                    id="group-select"
                                                    sx={{ width: '98%', fontSize: '14px' }}
                                                    onChange={handleTypeChange}
                                                    value={selectedType}
                                                    error={Boolean(typeError)}
                                                >
                                                    <MenuItem value="INDIVIDUAL">Cá nhân</MenuItem>
                                                    <MenuItem value="COMPANY">Công ty</MenuItem>
                                                </Select>
                                                <FormHelperText error={Boolean(typeError)}>{typeError}</FormHelperText>
                                            </Grid>
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
                                            helperText={descriptionError}
                                            error={Boolean(descriptionError)}
                                            size="small"
                                            variant="outlined"
                                            label="Mô tả"
                                            multiline
                                            rows={4}
                                            onChange={handleDescriptionChange}
                                            value={description}
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
