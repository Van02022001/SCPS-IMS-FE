import { Button, DialogContent, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
// api
import { createCategories } from '~/data/mutation/categories/categories-mutation';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';

const CreateCategoriesForm = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreateCategory = async () => {
        const categoriesParams = {
            name,
            description,
        };

        try {
            const response = await createCategories(categoriesParams);
            console.log(response.data);
            if (response.status === '200 OK') {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.data.message);

                props.onClose(response.data);

                // Clear form fields
                // setCategoryName('');
                // setCategoryDescription('');
            }
        } catch (error) {
            console.error("Can't fetch category", error.response);
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
                    {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
                    <Stack spacing={2} margin={2}>
                        <TextField
                            variant="outlined"
                            label="Tên thể loại"
                            value={name}
                            onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
                        />
                        <TextField
                            variant="outlined"
                            label="Mô tả"
                            value={description}
                            onChange={(e) => setDescription(capitalizeFirstLetter(e.target.value))}
                        />
                        {isSuccess && <SuccessAlerts message={successMessage} />}
                        {isError && <ErrorAlerts errorMessage={errorMessage} />}
                        <Button color="primary" variant="contained" onClick={handleCreateCategory}>
                            Tạo
                        </Button>
                    </Stack>
                </DialogContent>
            </div>
        </>
    );
};

export default CreateCategoriesForm;
