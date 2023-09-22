import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, List, ListItem, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


const BrandForm = () => {


    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <DialogContent>

                    {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
                    <Stack spacing={2} margin={2}>
                        <TextField variant="outlined" label="Tên thương hiệu" />
                        <TextField variant="outlined" label="Mô tả" />
                        <LocalizationProvider dateAdapter={AdapterDayjs}><DatePicker label="Ngày tạo" /></LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}><DatePicker label="Ngày cập nhật" /></LocalizationProvider>

                        <Button color="primary" variant="contained">Tạo</Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    {/* <Button color="success" variant="contained">Yes</Button>
                    <Button onClick={closepopup} color="error" variant="contained">Close</Button> */}
                </DialogActions>
            </div>
        </>
    );
}

export default BrandForm;