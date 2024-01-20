import { Button, DialogContent, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
// api
import { createSuppliers } from '~/data/mutation/supplier/suppliers-mutation';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';
import CloseIcon from '@mui/icons-material/Close';
const CreateSupplierForm = (props) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [taxCode, setTaxCode] = useState('');
    const [address, setAddress] = useState('');

    const [codeError, setCodeError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [phoneError, setPhoneError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [taxCodeError, setTaxCodeError] = useState(null);
    const [addressError, setAddressError] = useState(null);
    //thông báo
    const [open1, setOpen1] = React.useState(false);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');

    const handleMessage = (message) => {
        // Đặt logic hiển thị nội dung thông báo từ API ở đây
        if (message === 'Create sub category successfully.') {
            setMessage('Tạo mới sản phẩm thành công !');
        } else if (message === 'Update SubCategory successfully.') {
            setMessage('Cập nhập danh mục thành công');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Sub category name was existed') {
            setErrorMessage('Tên hàng hóa đã tồn tại !');
        } else if (message === 'unit_mea_id: Unit of measurement id is required') {
            setErrorMessage('Vui lòng chọn đơn vị đo lường !');
        } else if (message === 'unit_id: Required field') {
            setErrorMessage('Vui lòng chọn đơn vị !');
        } else if (message === 'name: size must be between 1 and 100') {
            setErrorMessage('Tên phải từ 1 - 100 ký tự !');
        } else if (message === 'description: Required field') {
            setErrorMessage('Vui lòng nhập mô tả !');
        } else if (message === 'description: The first letter must be uppercase.') {
            setErrorMessage('Chữ cái đầu của mô tả phải viết hoa !');
        } else if (message === 'SubCategory must have at least one category') {
            setErrorMessage('Vui lòng chọn nhóm hàng !');
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

    const validateName = (value) => {
        if (!value.trim()) {
            return "Tên hàng hóa không được để trống"
        } else if (!/^\p{Lu}/u.test(value)) {
            return "Chữ cái đầu phải in hoa.";
        }

        return null;
    };

    const validateDescription = (value) => {
        if (!value.trim()) {
            return "Mô tả hàng hóa không được để trống.";
        }
        return null;
    };

    const handleCodeChange = (e) => {
        const newCode = capitalizeFirstLetter(e.target.value);
        setCode(newCode);

        setCodeError(validateDescription(newCode));
    };

    const handleNameChange = (e) => {
        const newName = capitalizeFirstLetter(e.target.value);
        setName(newName);

        setNameError(validateName(newName));
    };

    const handleCloseSnackbar = () => {
        setOpen1(false);
    };

    const handleCreateSupplier = async () => {
        const supplierParams = {
            name,
            phone,
            email,
            taxCode,
            address,
        };
        try {
            const response = await createSuppliers(supplierParams);
            console.log('Create supplier response:', response);
            if (response.status === '201 CREATED') {
                handleMessage(response.message);

                props.onClose(response.data, response.message);
                // // Clear the form fields after a successful creation

                console.log(response.data.message);
            }
        } catch (error) {
            handleErrorMessage(error.response?.data?.message)
            if (error.response) {
                console.log('Error response:', error.response.data.message);
            }
        }
    };

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <DialogContent>
                    {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
                    <Stack spacing={2} margin={2}>
                        <TextField
                            variant="outlined"
                            value={name}
                            label="Tên người bán"
                            onChange={handleNameChange}
                        />
                        <TextField
                            variant="outlined"
                            value={phone}
                            label="Số điện thoại"
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            value={email}
                            label="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            value={taxCode}
                            label="taxCode"
                            onChange={(e) => setTaxCode(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            value={address}
                            label="Địa chỉ"
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <Button color="primary" variant="contained" onClick={handleCreateSupplier}>
                            Tạo
                        </Button>
                        <SnackbarError
                            open={open1}
                            handleClose={handleCloseSnackbar}
                            message={errorMessage}
                            action={action}
                            style={{ bottom: '16px', right: '16px' }}
                        />
                    </Stack>
                </DialogContent>
            </div>
            <SnackbarSuccess
                open={snackbarSuccessOpen}
                handleClose={() => setSnackbarSuccessOpen(false)}
                message={snackbarSuccessMessage}
                style={{ bottom: '16px', right: '16px' }}
            />
        </>
    );
};

export default CreateSupplierForm;
