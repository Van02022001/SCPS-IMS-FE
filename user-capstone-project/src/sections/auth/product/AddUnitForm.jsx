import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
} from '@mui/material';
import { createUnits } from '~/data/mutation/unit/unit-mutation';
// api


const AddUnitForm = ({ open, onClose, onSave }) => {
    const [unitName, setUnitName] = useState('');


    const handleSave = async () => {
        const unitParams = {
            name: unitName,
        }
        try {
            const respone = await createUnits(unitParams);
            console.log(respone);
        } catch (error) {
            console.error("can't feaching category", error);
        }
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Thêm đơn vị</DialogTitle>
            <DialogContent sx={{ width: 500 }}>
                <TextField
                    label="Tên đơn vị"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                />
            </DialogContent>
            <div style={{ padding: '16px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                >
                    lưu
                </Button>
            </div>
        </Dialog>
    );
};

export default AddUnitForm;