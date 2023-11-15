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
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';

const OriginForm = () => {
    const [name, setName] = useState('');
    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreateOrigins = async () => {
        const originParams = {
            name,
        };
        try {
            const response = await createOrigins(originParams);
            console.log('Create origin response:', response);
            if (response.status === "200 OK") {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.data.message);
                console.log(response.data.message);
                //clear
                setName('');
            }
        } catch (error) {
            console.error('Error creating origin:', error);
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
                            value={name}
                            label="Tên thương hiệu"
                            onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
                        />
                        {isSuccess && <SuccessAlerts message={successMessage} />}
                        {isError && <ErrorAlerts errorMessage={errorMessage} />}
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
