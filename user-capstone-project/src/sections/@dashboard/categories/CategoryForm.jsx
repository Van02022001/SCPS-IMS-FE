import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, Select, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


const CategoryForm = () => {
    const [currentTab, setCurrentTab] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <DialogContent>
                    <Tabs value={currentTab} onChange={handleChangeTab} indicatorColor="primary" textColor="primary">
                        <Tab label="Thông tin" />
                        <Tab label="Mô tả chi tiết" />
                    </Tabs>
                    {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} >
                                <TextField variant="outlined" label="Mã hàng" sx={{ width: "70%", marginBottom: 2 }} />
                                <TextField variant="outlined" label="Mã vạch" sx={{ width: "70%", marginBottom: 2 }} />
                                <TextField variant="outlined" label="Tên hàng" sx={{ width: "70%", marginBottom: 2 }} />
                                <FormControl variant="outlined" sx={{ width: "70%", marginBottom: 2 }}>
                                    <InputLabel id="group-label">Nhóm hàng</InputLabel>
                                    <Select
                                        labelId="group-label"
                                        id="group-select"
                                        label="Nhóm hàng"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="option1">Option 1</MenuItem>
                                        <MenuItem value="option2">Option 2</MenuItem>
                                        <MenuItem value="option3">Option 3</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" sx={{ width: "70%", marginBottom: 2 }}>
                                    <InputLabel id="group-label">Thương hiệu</InputLabel>
                                    <Select
                                        labelId="group-label"
                                        id="group-select"

                                        label="Thương hiệu"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="option1">Option 1</MenuItem>
                                        <MenuItem value="option2">Option 2</MenuItem>
                                        <MenuItem value="option3">Option 3</MenuItem>
                                    </Select>
                                </FormControl>
                                <LocalizationProvider dateAdapter={AdapterDayjs}><DatePicker label="Ngày tạo" sx={{ width: "70%", marginBottom: 2 }} /></LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}><DatePicker label="Ngày cập nhật" sx={{ width: "70%", marginBottom: 2 }} /></LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField variant="outlined" label="Giá tiền" sx={{ width: "70%", marginBottom: 2 }} />
                                <TextField variant="outlined" label="Giá bán" sx={{ width: "70%", marginBottom: 2 }} />
                                <TextField variant="outlined" label="Tồn kho" sx={{ width: "70%", marginBottom: 2 }} />
                                {/* Thêm các trường khác ở đây */}
                            </Grid>
                        </Grid>
                        <Button color="primary" variant="contained">Tạo</Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    {/* <Button color="success" variant="contained">Yes</Button>
                    <Button onClick={closepopup} color="error" variant="contained">Close</Button> */}
                </DialogActions>
            </div >
        </>
    );
}

export default CategoryForm;