import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//icons
import AddIcon from '@mui/icons-material/Add';
import GroupedSelect from '~/components/list-subheader/ListSubheader';

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
                            <Grid item xs={6}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                        Mã hàng:{' '}
                                    </Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Mã hàng tự động"
                                        sx={{ width: '70%' }}
                                    />
                                </Grid>

                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                        Tên hàng:{' '}
                                    </Typography>
                                    <TextField size="small" variant="outlined" sx={{ width: '70%' }} />
                                </Grid>
                                <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Nhóm hàng:{' '}
                                        </Typography>
                                        <Grid xs={8.5}>
                                            <Select
                                                size="small"
                                                labelId="group-label"
                                                id="group-select"
                                                sx={{ width: '90%', fontSize: '14px' }}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value="option1">Option 1</MenuItem>
                                                <MenuItem value="option2">Option 2</MenuItem>
                                                <MenuItem value="option3">Option 3</MenuItem>
                                            </Select>
                                            <Button variant="outlined" sx={{ padding: 0.8, minWidth: 0 }}>
                                                <AddIcon />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                                <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Thương hiệu:{' '}
                                        </Typography>
                                        <Grid xs={8.5}>
                                            <Select
                                                size="small"
                                                labelId="group-label"
                                                id="group-select"
                                                sx={{ width: '90%', fontSize: '14px' }}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value="option1">Option 1</MenuItem>
                                                <MenuItem value="option2">Option 2</MenuItem>
                                                <MenuItem value="option3">Option 3</MenuItem>
                                            </Select>
                                            <Button variant="outlined" sx={{ padding: 0.8, minWidth: 0 }}>
                                                <AddIcon />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Ngày tạo:{' '}
                                        </Typography>
                                        <DatePicker
                                            sx={{
                                                width: '70%',
                                                '& .MuiInputBase-input': {
                                                    fontSize: '1rem',
                                                    padding: '10px',
                                                },
                                            }}
                                        />
                                    </Grid>
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Ngày cập nhật:{' '}
                                        </Typography>
                                        <DatePicker
                                            sx={{
                                                width: '70%',
                                                '& .MuiInputBase-input': {
                                                    fontSize: '1rem',
                                                    padding: '10px',
                                                },
                                            }}
                                        />
                                    </Grid>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={4} sx={{ marginLeft: 8 }}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 2 }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                        Giá tiền:{' '}
                                    </Typography>
                                    <TextField size="small" variant="outlined" sx={{ width: '70%' }} />
                                </Grid>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 2 }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                        Giá bán:{' '}
                                    </Typography>
                                    <TextField size="small" variant="outlined" sx={{ width: '70%' }} />
                                </Grid>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 2 }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                        Tồn kho:{' '}
                                    </Typography>
                                    <TextField size="small" variant="outlined" sx={{ width: '70%' }} />
                                </Grid>

                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 2 }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                        Kích thước:{' '}
                                    </Typography>
                                    <GroupedSelect ></GroupedSelect>
                                </Grid>

                                {/* Thêm các trường khác ở đây */}
                            </Grid>
                        </Grid>
                        <Button color="primary" variant="contained">
                            Tạo
                        </Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    {/* <Button color="success" variant="contained">Yes</Button>
                    <Button onClick={closepopup} color="error" variant="contained">Close</Button> */}
                </DialogActions>
            </div>
        </>
    );
};

export default CategoryForm;
