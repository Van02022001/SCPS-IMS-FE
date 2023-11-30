import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
} from '@mui/material';
// api
import { createOrigins } from '~/data/mutation/origins/origins-mutation';

const AddOriginItemForm = ({ open, onClose, onSave }) => {
    const [originName, setOriginName] = useState('');


    const handleSave = async () => {
        const originParams = {
            name: originName,
        }
        try {
            const respone = await createOrigins(originParams);
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
            <DialogTitle>Thêm xuất sứ</DialogTitle>
            <DialogContent sx={{ width: 500 }}>
                <TextField
                    label="Tên xuất xứ"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={originName}
                    onChange={(e) => setOriginName(e.target.value)}
                />
            </DialogContent>
            <div style={{ padding: '16px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                >
                    Tạo thêm
                </Button>
            </div>
        </Dialog>
    );
};

export default AddOriginItemForm;