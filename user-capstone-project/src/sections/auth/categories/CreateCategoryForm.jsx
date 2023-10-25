import { Button, DialogContent, Stack, TextField, } from "@mui/material";
import { useState } from "react";
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
// api
import { createCategories } from "~/data/mutation/categories/categories-mutation";


const CreateCategoriesForm = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [isSuccess, setIsSuccess] = useState(false); // New state for success message
    const [isError, setIsError] = useState(false);

    const handleSave = async () => {
        const categoriesParams = {
            name: categoryName,
            description: categoryDescription,
        };
        try {
            const response = await createCategories(categoriesParams);
            if (response.status === 200) {
                setIsSuccess(true);
                setIsError(false);
            } else {
                if (response.data && response.data.message) {

                    setIsError(response.data.message);
                } else if (Array.isArray(response.data) && response.data.length > 0) {
                    // If there are specific error details, display them
                    const errorMessages = response.data.map((error) => error.message).join(', ');
                    setIsError(`Validation errors: ${errorMessages}`);
                } else {
                    // Use the default error message
                    setIsError('An error occurred.');
                }
                setIsSuccess(false);
            }
        } catch (error) {
            console.error("Can't fetch category", error);
            setIsError(true);
            setIsSuccess(false);
        }
    };

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <DialogContent>
                    {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
                    <Stack spacing={2} margin={2}>
                        <TextField variant="outlined" label="Tên thể loại" onChange={(e) => setCategoryName(e.target.value)} />
                        <TextField variant="outlined" label="Mô tả" onChange={(e) => setCategoryDescription(e.target.value)} />
                        <Button color="primary" variant="contained" onClick={handleSave}>Tạo</Button>
                    </Stack>
                    {isSuccess && <SuccessAlerts />}
                    {isError && <ErrorAlerts errorMessage={isError} />}
                </DialogContent>
            </div>
        </>
    );
}

export default CreateCategoriesForm;