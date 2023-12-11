import { Button, DialogContent, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import SuccessAlerts from '~/components/alert/SuccessAlert';
// api
import { createSuppliers } from '~/data/mutation/supplier/suppliers-mutation';

const CreateSupplierForm = (props) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [taxCode, setTaxCode] = useState('');
    const [address, setAddress] = useState('');
    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreateSupplier = async () => {
        const supplierParams = {
            code,
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
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.data.message);

                props.onClose(response.data);
                // // Clear the form fields after a successful creation

                console.log(response.data.message);
            }
        } catch (error) {
            console.error('Error creating supplier:', error);
            setIsError(true);
            setIsSuccess(false);
            setErrorMessage(error.response.data.message);
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
                            value={code}
                            label="Mã người bán"
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            value={name}
                            label="Tên người bán"
                            onChange={(e) => setName(e.target.value)}
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
                        {isSuccess && <SuccessAlerts message={successMessage} />}
                        {isError && <ErrorAlerts errorMessage={errorMessage} />}
                        <Button color="primary" variant="contained" onClick={handleCreateSupplier}>
                            Tạo
                        </Button>
                    </Stack>
                </DialogContent>
            </div>
        </>
    );
};

export default CreateSupplierForm;
