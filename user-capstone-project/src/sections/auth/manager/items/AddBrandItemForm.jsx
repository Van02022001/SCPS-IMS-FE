import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,

} from '@mui/material';
import { useState } from 'react';

import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
// api
import { createBrands } from '~/data/mutation/brand/brands-mutation';

const AddBrandItemForm = ({ open, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    //thông báo

    const handleSave = async () => {
        const originParams = {
            name,
            description,
        }
        try {
            const respone = await createBrands(originParams);
            console.log(respone);
            onSave && onSave();
            // Đóng form
            onClose && onClose();
        } catch (error) {
            console.error("can't feaching category", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Thêm thương hiệu</DialogTitle>
            <DialogContent sx={{ width: 500 }}>
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
                    <Button color="primary" variant="contained" onClick={handleSave}>
                        Tạo thêm
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default AddBrandItemForm;