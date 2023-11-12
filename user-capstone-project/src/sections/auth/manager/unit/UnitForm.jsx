import {
    Button,
    DialogContent,
    Stack,
    TextField,

} from '@mui/material';
import { useState } from 'react';
// api
import { createUnits } from '~/data/mutation/unit/unit-mutation';

const UnitForm = () => {
    const [name, setName] = useState('');

    const handleCreateUnit = async () => {
        const unitParams = {
            name,
        };
        try {
            const response = await createUnits(unitParams);
            console.log('Create origin response:', response);
        } catch (error) {
            console.error('Error creating origin:', error);
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
                        <Button color="primary" variant="contained" onClick={handleCreateUnit}>
                            Tạo
                        </Button>
                    </Stack>
                </DialogContent>
            </div>
        </>
    );
};

export default UnitForm;
