import React, { useState } from 'react';
import { Grid, Button, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';

const InventorySelection = () => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [quantity, setQuantity] = useState(0);

    const handleSlotClick = (slot) => {
        if (slot.isFull) {
            // Nếu ô đã đầy, không làm gì cả
            return;
        }
        setSelectedSlot(slot);
    };

    const handleSave = () => {
        // Xử lý khi lưu số lượng vào ô đã chọn
        console.log(`Saved ${quantity} items to slot ${selectedSlot.id}`);
        setSelectedSlot(null);
    };

    const slots = [
        { id: 1, isFull: false },
        { id: 2, isFull: true },
        // ...Thêm các ô khác
    ];

    return (
        <>
            <Grid container spacing={1}>
                {slots.map((slot) => (
                    <Grid item key={slot.id}>
                        <Button
                            variant="outlined"
                            color={slot.isFull ? 'error' : 'default'}
                            onClick={() => handleSlotClick(slot)}
                        >
                            {slot.id}
                        </Button>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={!!selectedSlot} onClose={() => setSelectedSlot(null)}>
                <DialogTitle>Chọn số lượng</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Số lượng"
                        variant="outlined"
                        fullWidth
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Lưu
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default InventorySelection;