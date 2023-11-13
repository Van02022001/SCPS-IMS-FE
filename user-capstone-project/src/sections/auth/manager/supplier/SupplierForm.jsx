import {
    Button,
    DialogContent,
    Stack,
    TextField,

} from '@mui/material';
import { useState } from 'react';
// api
import { createSuppliers } from '~/data/mutation/supplier/suppliers-mutation';

const SupplierForm = () => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [taxCode, setTaxCode] = useState('');
    const [address, setAddress] = useState('');


    const handleCreateSupplier = async () => {
        const unitParams = {
            code,
            name,
            phone,
            email,
            taxCode,
            address,
        };
        try {
            const response = await createSuppliers(unitParams);
            console.log('Create supplier response:', response);
        } catch (error) {
            console.error('Error creating supplier:', error);
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
                        <Button color="primary" variant="contained" onClick={handleCreateSupplier}>
                            Tạo
                        </Button>
                    </Stack>
                </DialogContent>
            </div>
        </>
    );
};

export default SupplierForm;
