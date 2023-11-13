import { Button, DialogContent, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
// api
import { createCategories } from '~/data/mutation/categories/categories-mutation';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';

const CreateCategoriesForm = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSave = async () => {
        const categoriesParams = {
            name: categoryName,
            description: categoryDescription,
        };
        try {
            const response = await createCategories(categoriesParams);

            console.log(response.status);
            if (response.status === 200) {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.data.message);
            }
        } catch (error) {
            console.error("Can't fetch category", error);
            setIsError(true);
            setIsSuccess(false);
            setErrorMessage(error.response.data.message);
            if (error.response) {
                console.log('Error response:', error.response);
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
                            value={categoryName}
                            onChange={(e) => setCategoryName(capitalizeFirstLetter(e.target.value))}
                        />
                        <TextField
                            variant="outlined"
                            label="Mô tả"
                            value={categoryDescription}
                            onChange={(e) => setCategoryDescription(capitalizeFirstLetter(e.target.value))}
                        />
                        {isSuccess && <SuccessAlerts message={successMessage} />}
                        {isError && <ErrorAlerts errorMessage={errorMessage} />}
                        <Button color="primary" variant="contained" onClick={handleSave}>
                            Tạo
                        </Button>
                    </Stack>
                </DialogContent>
            </div>
        </>
    );
};

export default CreateCategoriesForm;
