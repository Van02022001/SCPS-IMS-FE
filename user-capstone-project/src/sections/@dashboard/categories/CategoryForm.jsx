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
    Card,
    CardContent,
} from '@mui/material';
import { useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//icons
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

//components
import GroupedSelect from '~/components/list-subheader/ListSubheader';
import BoxComponent from '~/components/box/BoxComponent';
import CustomizedDividers from '~/components/togglebutton/CustomizedDividers';

//ckeditor
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CategoryForm = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [tab1Data, setTab1Data] = useState({});
    const [tab2Data, setTab2Data] = useState({});

    const handleTab1DataChange = (event) => {
        // Cập nhật dữ liệu cho tab 1 tại đây
        setTab1Data({ ...tab1Data, [event.target.name]: event.target.value });
    };

    const handleTab2DataChange = (event) => {
        // Cập nhật dữ liệu cho tab 2 tại đây
        setTab2Data({ ...tab2Data, [event.target.name]: event.target.value });
    };

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
                    {currentTab === 0 && (
                        // Hiển thị giao diện cho tab "Thông tin"
                        <div>
                            {/* <TextField
                                name="field1"
                                value={tab1Data.field1}
                                onChange={handleTab1DataChange}
                            /> */}
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
                                            <GroupedSelect></GroupedSelect>
                                        </Grid>

                                        {/* Thêm các trường khác ở đây */}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ gap: '20px' }}>
                                    <BoxComponent />
                                    <BoxComponent />
                                    <BoxComponent />
                                </Grid>
                                <Grid container spacing={1} sx={{ gap: '20px' }}>
                                    <Button color="primary" variant="contained" startIcon={<SaveIcon />}>
                                        Lưu
                                    </Button>
                                    <Button color="primary" variant="outlined" startIcon={<ClearIcon />}>
                                        Hủy
                                    </Button>
                                </Grid>
                            </Stack>
                        </div>
                    )}

                    {currentTab === 1 && (
                        // Hiển thị giao diện cho tab "Mô tả chi tiết"
                        <div>
                            {/* Các trường dữ liệu cho tab "Mô tả chi tiết" */}
                            <Card sx={{ minWidth: 275, marginTop: 5 }} spacing={2}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontSize: '18px',
                                        backgroundColor: '#f0f1f3',
                                        height: 50,
                                        textAlign: 'start',
                                        padding: '10px 0 0 20px',
                                    }}
                                >
                                    Định mức tồn
                                </Typography>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                                    Ít nhất
                                                    <Button sx={{ padding: 0, minWidth: 0, marginLeft: 1 }}>
                                                        <ErrorOutlineIcon color="disabled" />
                                                    </Button>
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ width: '50%' }}
                                                    placeholder="0"
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                                    Nhiều nhất
                                                    <Button sx={{ padding: 0, minWidth: 0, marginLeft: 1 }}>
                                                        <ErrorOutlineIcon color="disabled" />
                                                    </Button>
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ width: '50%' }}
                                                    placeholder="999,999,999"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                            <Card sx={{ minWidth: 275, marginTop: 5 }} spacing={2}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontSize: '18px',
                                        backgroundColor: '#f0f1f3',
                                        height: 50,
                                        textAlign: 'start',
                                        padding: '10px 0 0 20px',
                                    }}
                                >
                                    Mô tả
                                </Typography>
                                <CardContent>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data=""
                                        onReady={(editor) => {
                                            // You can store the "editor" and use when it is needed.
                                            console.log('Editor is ready to use!', editor);
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            console.log({ event, editor, data });
                                        }}
                                        onBlur={(event, editor) => {
                                            console.log('Blur.', editor);
                                        }}
                                        onFocus={(event, editor) => {
                                            console.log('Focus.', editor);
                                        }}
                                    />
                                </CardContent>
                            </Card>
                            <Card sx={{ minWidth: 275, marginTop: 5 }} spacing={2}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontSize: '18px',
                                        backgroundColor: '#f0f1f3',
                                        height: 50,
                                        textAlign: 'start',
                                        padding: '10px 0 0 20px',
                                    }}
                                >
                                    Mẫu ghi chú (hóa đơn, đặt hàng)
                                </Typography>
                                <CardContent>
                                    <TextField
                                        id="outlined-multiline-static"
                                        multiline
                                        rows={4}
                                        defaultValue="Default Value"
                                        sx={{width: "100%", border: "none"}}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    )}
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
