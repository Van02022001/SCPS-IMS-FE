import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createOrigins } from '~/data/mutation/origins/origins-mutation';

const OriginForm = () => {
    const [name, setName] = useState('');

    const handleCreateOrigins = async () => {
        const originParams = {
            name,
        };
        try {
            const response = await createOrigins(originParams);
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
                            label="Tên thương hiệu"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Button color="primary" variant="contained" onClick={handleCreateOrigins}>
                            Tạo
                        </Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    {/* <Button color="success" variant="contained">Yes</Button>
                    <Button onClick={closepopup} color="error" variant="contained">Close</Button> */}
                </DialogActions>
            </div>
        </>
    );
};

export default OriginForm;
