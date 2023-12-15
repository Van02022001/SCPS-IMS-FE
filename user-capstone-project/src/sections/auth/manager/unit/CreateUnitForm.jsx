import { Button, DialogContent, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
// api
import { createUnits } from '~/data/mutation/unit/unit-mutation';

const CreateUnitForm = (props) => {
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

                props.onClose(response.data, response.message);
                //clear
            }
        } catch (error) {
            console.error('Error creating origin:', error);
            setIsError(true);
            setIsSuccess(false);
            if (error.response?.data?.message === 'Invalid request') {
                setErrorMessage('Yêu cầu không hợp lệ');
            }
        }
    };

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <DialogContent>

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

export default CreateUnitForm;
