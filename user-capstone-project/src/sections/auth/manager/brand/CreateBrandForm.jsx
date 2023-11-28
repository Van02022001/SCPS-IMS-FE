import {
    Button,
    DialogContent,
    Stack,
    TextField,

} from '@mui/material';
import { useState } from 'react';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
// api
import { createBrands } from '~/data/mutation/brand/brands-mutation';

const BrandForm = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handleCreateBrand = async () => {
        const unitParams = {
            name,
            description,
        };
        try {
            const response = await createBrands(unitParams);
            console.log('Create brand response:', response.data);
            if (response.status === "200 OK") {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.data.message);
                props.onClose(response.data);
                //clear
                // setName('');
                // setDescription('');

            }
        } catch (error) {
            console.error('Error creating brand:', error);
            setIsError(true);
            setIsSuccess(false);
            if (error.response?.data?.message === 'Invalid request') {
                setErrorMessage('Yêu cầu không hợp lệ');
            }
            if (error.response?.data?.error === '404 NOT_FOUND') {
                setErrorMessage('Mô tả quá dài');
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
                        <TextField
                            variant="outlined"
                            value={description}
                            multiline
                            rows={3}
                            label="Mô tả"
                            onChange={(e) => setDescription(capitalizeFirstLetter(e.target.value))}
                        />
                        {isSuccess && <SuccessAlerts message={successMessage} />}
                        {isError && <ErrorAlerts errorMessage={errorMessage} />}
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