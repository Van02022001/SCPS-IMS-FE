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
import { useEffect, useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//icons
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';

//components
import GroupedSelect from '~/components/list-subheader/ListSubheader';
import BoxComponent from '~/components/box/BoxComponent';
import CustomizedDividers from '~/components/togglebutton/CustomizedDividers';

//ckeditor
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// form popup
import AddCategoryForm from './AddCategoryForm';
import AddOriginForm from './AddOriginForm';

// api
import { createProduct } from '~/data/mutation/product/product-mutation';
import { getAllCategories } from '~/data/mutation/categories/categories-mutation';
import { getAllUnit, getAllUnitMeasurement } from '~/data/mutation/unit/unit-mutation';
import { deleteOrigins, getAllOrigins } from '~/data/mutation/origins/origins-mutation';

const CategoryForm = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [tab1Data, setTab1Data] = useState({});
    const [tab2Data, setTab2Data] = useState({});

    // mở popup form
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
    const [openAddOriginForm, setOpenAddOriginForm] = useState(false);

    // form để call api
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [minStockLevel, setMinStockLevel] = useState('');
    const [maxStockLevel, setMaxStockLevel] = useState('');
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');

    const [categories_id, setCategories_id] = useState([]);
    const [unit_id, setUnits_id] = useState([]);
    const [origins_id, setOrigins_id] = useState([]);
    const [unit_mea_id, setUnit_mea_id] = useState([]);

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

    // hàm xử lý đóng mở popup form
    const handleOpenAddCategoryDialog = () => {
        setOpenAddCategoryDialog(true);
    };

    const handleCloseAddCategoryDialog = () => {
        setOpenAddCategoryDialog(false);
    };

    const handleOpenAddOriginForm = () => {
        setOpenAddOriginForm(true);
    };

    const handleCloseAddOriginForm = () => {
        setOpenAddOriginForm(false);
    };

    const handleDeleteOrigin = async (id) => {
        try {
            const response = await deleteOrigins(id);

            if (response.status === 202) {
                const updatedOrigins = origins_id.filter((origin) => origin.id !== id);
                setOrigins_id(updatedOrigins);
            }
        } catch (error) {
            console.error('Error delete origins:', error);
        }
    };

    // hàm create category-----------------------------------------
    const handleCreateProduct = async () => {
        const productParams = {
            name,
            description,
            minStockLevel,
            maxStockLevel,
            categories_id,
            unit_id,
            origins_id,
            length,
            width,
            height,
            unit_mea_id,
        };
        try {
            const response = await createProduct(productParams);
            console.log('Create product response:', response);
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const handleAddCategories = async () => {};

    useEffect(() => {
        getAllCategories()
            .then((respone) => {
                const data = respone.data;
                setCategories_id(data);
            })
            .catch((error) => console.error('Error fetching categories:', error));

        getAllUnit()
            .then((respone) => {
                const data = respone.data;
                setUnits_id(data);
            })
            .catch((error) => console.error('Error fetching units:', error));
        getAllUnitMeasurement()
            .then((respone) => {
                const data = respone.data;
                setUnit_mea_id(data);
            })
            .catch((error) => console.error('Error fetching units measurement:', error));
        getAllOrigins()
            .then((respone) => {
                const data = respone.data;
                setOrigins_id(data);
            })
            .catch((error) => console.error('Error fetching origins:', error));
    }, []);

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <DialogContent style={{ width: '90%' }}>
                    <Tabs value={currentTab} onChange={handleChangeTab} indicatorColor="primary" textColor="primary">
                        <Tab label="Thông tin" />
                        <Tab label="Mô tả chi tiết" />
                    </Tabs>
                    {currentTab === 0 && (
                        <div style={{ marginLeft: 100 }}>
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
                                            <TextField
                                                size="small"
                                                variant="outlined"
                                                sx={{ width: '70%' }}
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
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
                                                        value={tab1Data.categories_id}
                                                        onChange={handleTab1DataChange}
                                                        name="categories_id"
                                                    >
                                                        {categories_id.map((category) => (
                                                            <MenuItem key={category.id} value={category.id}>
                                                                {category.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    <Button
                                                        variant="outlined"
                                                        sx={{ padding: 0.8, minWidth: 0 }}
                                                        onClick={handleOpenAddCategoryDialog}
                                                    >
                                                        <AddIcon />
                                                    </Button>
                                                    <AddCategoryForm
                                                        open={openAddCategoryDialog}
                                                        onClose={handleCloseAddCategoryDialog}
                                                    />
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
                                                        value={tab1Data.origins_id}
                                                        onChange={handleTab1DataChange}
                                                        name="origins_id"
                                                    >
                                                        {origins_id.map((origin) => (
                                                            <MenuItem
                                                                sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                }}
                                                                key={origin.id}
                                                                value={origin.id}
                                                            >
                                                                {origin.name}
                                                                <IconButton
                                                                    style={{ float: 'right' }}
                                                                    onClick={() => handleDeleteOrigin(origin.id)}
                                                                >
                                                                    <CloseIcon color="outlined" />
                                                                </IconButton>{' '}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    <Button
                                                        variant="outlined"
                                                        sx={{ padding: 0.8, minWidth: 0 }}
                                                        onClick={handleOpenAddOriginForm}
                                                    >
                                                        <AddIcon />
                                                    </Button>
                                                    <AddOriginForm
                                                        open={openAddOriginForm}
                                                        onClose={handleCloseAddOriginForm}
                                                    />
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
                                    <Grid item xs={5} sx={{ marginLeft: 8 }}>
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
                        <div style={{ marginLeft: 100 }}>
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
                                                    sx={{ width: '50%', marginRight: 30 }}
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
                                                    sx={{ width: '50%', marginRight: 30 }}
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
                                        sx={{ width: '100%', border: 'none' }}
                                    />
                                </CardContent>
                            </Card>
                            <Stack spacing={4} margin={2}>
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
                </DialogContent>
                {/* <DialogActions>
                    <Button color="success" variant="contained">Yes</Button>
                    <Button color="error" variant="contained">Close</Button>
                </DialogActions> */}
            </div>
        </>
    );
};

export default CategoryForm;
