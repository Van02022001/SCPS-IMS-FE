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
} from '@mui/material';
import SuccessAlerts from '../../../../components/alert/SuccessAlert';
import ErrorAlerts from '../../../../components/alert/ErrorAlert';
import capitalizeFirstLetter from '../../../../components/validation/capitalizeFirstLetter';
// api
import { createCustomer } from '~/data/mutation/customer/customer-mutation';




const CreateCustomerForm = ({ onClose, onSave }) => {
    const [open, openchange] = useState(false);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [taxCode, setTaxCode] = useState('');
    const [address, setAddress] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');


    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


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
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage('Tạo thành công');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            setIsError(true);
            setIsSuccess(false);
            if (error.response?.data?.message === 'Email already exists.') {
                setErrorMessage('Email đã tồn tại.');
            } else if (error.response?.data?.message === 'Phone already exists.') {
                setErrorMessage('Phone đã tồn tại.');
            }
            if (error.response) {
                console.error('Error response:', error.response);
            }
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
                            {isSuccess && <SuccessAlerts message={successMessage} />}
                            {isError && <ErrorAlerts errorMessage={errorMessage} />}
                            <Button color="primary" variant="contained" onClick={handleSubmit}>
                                Tạo
                            </Button>
                        </Stack>
                    </div>
                </DialogContent>
            </div>
        </>
    );
};

export default CreateCustomerForm;