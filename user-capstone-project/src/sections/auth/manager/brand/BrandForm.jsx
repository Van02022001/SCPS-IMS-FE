import {
    Button,
    DialogContent,
    Stack,
    TextField,

} from '@mui/material';
import { useState } from 'react';
// api
import { createBrands } from '~/data/mutation/brand/brands-mutation';

const BrandForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');


    const handleCreateBrand = async () => {
        const unitParams = {
            name,
            description,
        };
        try {
            const response = await createBrands(unitParams);
            console.log('Create brand response:', response);
        } catch (error) {
            console.error('Error creating brand:', error);
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
                            label="Tên đơn vị"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            value={description}
                            multiline
                            rows={3}
                            label="Mô tả"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <Button color="primary" variant="contained" onClick={handleCreateBrand}>
                            Tạo
                        </Button>
                    </Stack>
                </DialogContent>
            </div>
        </>
    );
};

export default BrandForm;
