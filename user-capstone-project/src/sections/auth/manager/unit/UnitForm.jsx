import { Button, DialogContent, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
// api
import { createUnits } from '~/data/mutation/unit/unit-mutation';

const UnitForm = () => {
    const [name, setName] = useState('');
    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreateUnit = async () => {
        const unitParams = {
            name,
        };
        try {
            const response = await createUnits(unitParams);
            console.log('Create origin response:', response);
            if (response.status === '200 OK') {
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
                            label="Tên đơn vị"
                            onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
                        />
                        {isSuccess && <SuccessAlerts message={successMessage} />}
                        {isError && <ErrorAlerts errorMessage={errorMessage} />}
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
