import {
    Button,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
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
import InputBase from '@mui/material/InputBase';
import { useEffect, useState } from 'react';
//icons
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

//components
import BoxComponent from '~/components/box/BoxComponent';

//ckeditor
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// form popup
import AddCategoryForm from './AddCategoryForm';
import AddUnitForm from './AddUnitForm';

// api
import { createProduct } from '~/data/mutation/subCategory/subCategory-mutation';
import { getAllCategories } from '~/data/mutation/categories/categories-mutation';
import { deleteUnits, getAllUnit, getAllUnitMeasurement } from '~/data/mutation/unit/unit-mutation';
import { deleteOrigins, getAllOrigins } from '~/data/mutation/origins/origins-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';

const CategoryForm = (props) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [tab1Data, setTab1Data] = useState({ categories_id: [] });
    const [tab2Data, setTab2Data] = useState({});

    // mở popup form
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
    const [openAddOriginForm, setOpenAddOriginForm] = useState(false);
    const [openAddUnitForm, setOpenAddUnitForm] = useState(false);

    // form để call api
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    // const [minStockLevel, setMinStockLevel] = useState('');
    // const [maxStockLevel, setMaxStockLevel] = useState('');
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [diameter, setDiameter] = useState('');
    const [categories_id, setCategories_id] = useState([]);
    const [unit_id, setUnits_id] = useState([]);
    const [origins_id, setOrigins_id] = useState([]);
    const [unit_mea_id, setUnit_mea_id] = useState([]);

    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

    // const handleOpenAddOriginForm = () => {
    //     setOpenAddOriginForm(true);
    // };

    // const handleCloseAddOriginForm = () => {
    //     setOpenAddOriginForm(false);
    // };

    const handleOpenAddUnitForm = () => {
        setOpenAddUnitForm(true);
    };

    const handleCloseAddUnitFormm = () => {
        setOpenAddUnitForm(false);
    };
    // Hàm delete của trang ---------------------------------------------------------------------
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

    const handleDeleteUnit = async (id) => {
        try {
            const response = await deleteUnits(id);

            if (response.status === 202) {
                const updatedUnits = unit_id.filter((unit) => unit.id !== id);
                setUnits_id(updatedUnits);
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
            // minStockLevel,
            // maxStockLevel,
            categories_id: tab1Data.categories_id,
            unit_id: tab1Data.unit_id,
            length,
            width,
            height,
            diameter,
            unit_mea_id: tab1Data.unit_mea_id,
        };
        try {
            const response = await createProduct(productParams);
            if (response.status === '200 OK') {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.message);

                props.onClose(response.data); // Call the callback function
            }
        } catch (error) {
            console.error('Error creating product:', error);
            setIsError(true);
            setIsSuccess(false);
            setErrorMessage(error.response?.data?.message);
            if (error.response) {
                console.error('Error response:', error.response);
            }
        }
    };

    const handleClear = () => {
        setName('');
        setDescription('');
        // setMinStockLevel('');
        // setMaxStockLevel('');
        setLength('');
        setWidth('');
        setHeight('');
        setDiameter('');
        setCategories_id([]);
        setUnits_id([]);
        setOrigins_id([]);
        setUnit_mea_id([]);
    };

    const handleAddCategories = async () => { };

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
                                                Tên hàng hóa:{' '}
                                            </Typography>
                                            <TextField
                                                size="small"
                                                variant="outlined"
                                                label="Tên hàng"
                                                sx={{ width: '70%' }}
                                                value={name}
                                                onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
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
                                                Mô tả về hàng hóa:{' '}
                                            </Typography>
                                            <TextField
                                                id="outlined-multiline-static"
                                                multiline
                                                rows={4}
                                                size="small"
                                                label="Mô tả"
                                                variant="outlined"
                                                sx={{ width: '70%' }}
                                                value={description}
                                                onChange={(e) => setDescription(capitalizeFirstLetter(e.target.value))}
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
                                                        multiple // Thêm thuộc tính multiple để cho phép chọn nhiều giá trị
                                                        value={[...tab1Data.categories_id]}
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
                                                    Đơn vị:{' '}
                                                </Typography>
                                                <Grid xs={8.5}>
                                                    <Select
                                                        size="small"
                                                        labelId="group-label"
                                                        id="group-select"
                                                        sx={{ width: '90%', fontSize: '14px' }}
                                                        value={tab1Data.unit_id}
                                                        onChange={handleTab1DataChange}
                                                        name="unit_id"
                                                    >
                                                        {unit_id.map((unit) => (
                                                            <MenuItem
                                                                sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                }}
                                                                key={unit.id}
                                                                value={unit.id}
                                                            >
                                                                {unit.name}
                                                                {/* <IconButton
                                                                    style={{ float: 'right' }}
                                                                    onClick={() => handleDeleteUnit(unit.id)}
                                                                >
                                                                    <CloseIcon color="outlined" />
                                                                </IconButton>{' '} */}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    <Button
                                                        variant="outlined"
                                                        sx={{ padding: 0.8, minWidth: 0 }}
                                                        onClick={handleOpenAddUnitForm}
                                                    >
                                                        <AddIcon />
                                                    </Button>
                                                    <AddUnitForm
                                                        open={openAddUnitForm}
                                                        onClose={handleCloseAddUnitFormm}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </FormControl>

                                    </Grid>
                                    <Grid item xs={5} sx={{ marginLeft: 8 }}>

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
                                                    Đơn vị đo lường:{' '}
                                                </Typography>
                                                <Grid xs={8.5}>
                                                    <Select
                                                        size="small"
                                                        labelId="group-label"
                                                        id="group-select"
                                                        sx={{ width: '98%', fontSize: '16px' }}
                                                        value={tab1Data.unit_mea_id}
                                                        onChange={handleTab1DataChange}
                                                        name="unit_mea_id"
                                                    >
                                                        {unit_mea_id.map((unit_mea) => (
                                                            <MenuItem key={unit_mea.id} value={unit_mea.id}>
                                                                {unit_mea.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {/* <Button
                                                        variant="outlined"
                                                        sx={{ padding: 0.8, minWidth: 0 }}
                                                        onClick={handleOpenAddCategoryDialog}
                                                    >
                                                        <AddIcon />
                                                    </Button> */}
                                                    <AddCategoryForm
                                                        open={openAddCategoryDialog}
                                                        onClose={handleCloseAddCategoryDialog}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </FormControl>

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
                                            <div style={{ display: 'flex' }}>
                                                <FormControl sx={{ m: 0.2 }} variant="standard">
                                                    <TextField
                                                        id="demo-customized-textbox"
                                                        label="Chiều dài"
                                                        value={length}
                                                        onChange={(e) => setLength(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormControl sx={{ m: 0.2 }} variant="standard">
                                                    <TextField
                                                        id="demo-customized-textbox"
                                                        label="Chiều rộng"
                                                        value={width}
                                                        onChange={(e) => setWidth(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormControl sx={{ m: 0.2 }} variant="standard">
                                                    <TextField
                                                        id="demo-customized-textbox"
                                                        label="Chiều cao"
                                                        value={height}
                                                        onChange={(e) => setHeight(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormControl sx={{ m: 0.2 }} variant="standard">
                                                    <TextField
                                                        id="demo-customized-textbox"
                                                        label="Đường kính"
                                                        value={diameter}
                                                        onChange={(e) => setDiameter(e.target.value)}
                                                    />
                                                </FormControl>
                                            </div>
                                        </Grid>

                                        {/* Thêm các trường khác ở đây */}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ gap: '20px' }}>
                                    <BoxComponent />
                                    <BoxComponent />
                                    <BoxComponent />
                                </Grid>
                                {isSuccess && <SuccessAlerts message={successMessage} />}
                                {isError && <ErrorAlerts errorMessage={errorMessage} />}
                                <Grid container spacing={1} sx={{ gap: '20px' }}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        onClick={handleCreateProduct}
                                    >
                                        Lưu
                                    </Button>
                                    <Button
                                        color="error"
                                        variant="outlined"
                                        startIcon={<ClearIcon />}
                                        onClick={handleClear}
                                    >
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
            </div>
        </>
    );
};

export default CategoryForm;

{/* <Grid
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
                                        {/* <Grid
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
                                        </Grid> */}

//  {/* <Card sx={{ minWidth: 275, marginTop: 5 }} spacing={2}>
//                                 <Typography
//                                     variant="subtitle1"
//                                     sx={{
//                                         fontSize: '18px',
//                                         backgroundColor: '#f0f1f3',
//                                         height: 50,
//                                         textAlign: 'start',
//                                         padding: '10px 0 0 20px',
//                                     }}
//                                 >
//                                     Định mức tồn
//                                 </Typography>
//                                 <CardContent>
//                                     <Grid container spacing={2}>
//                                         <Grid item xs={6}>
//                                             <Grid
//                                                 container
//                                                 direction="row"
//                                                 justifyContent="space-between"
//                                                 alignItems="center"
//                                             >
//                                                 <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
//                                                     Ít nhất
//                                                     <Button sx={{ padding: 0, minWidth: 0, marginLeft: 1 }}>
//                                                         <ErrorOutlineIcon color="disabled" />
//                                                     </Button>
//                                                 </Typography>
//                                                 <TextField
//                                                     size="small"
//                                                     variant="outlined"
//                                                     sx={{ width: '50%', marginRight: 30 }}
//                                                     placeholder="0"
//                                                     value={minStockLevel}
//                                                     onChange={(e) => setMinStockLevel(e.target.value)}
//                                                 />
//                                             </Grid>
//                                         </Grid>
//                                         <Grid item xs={6}>
//                                             <Grid
//                                                 container
//                                                 direction="row"
//                                                 justifyContent="space-between"
//                                                 alignItems="center"
//                                             >
//                                                 <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
//                                                     Nhiều nhất
//                                                     <Button sx={{ padding: 0, minWidth: 0, marginLeft: 1 }}>
//                                                         <ErrorOutlineIcon color="disabled" />
//                                                     </Button>
//                                                 </Typography>
//                                                 <TextField
//                                                     size="small"
//                                                     variant="outlined"
//                                                     sx={{ width: '50%', marginRight: 30 }}
//                                                     placeholder="999,999,999"
//                                                     value={maxStockLevel}
//                                                     onChange={(e) => setMaxStockLevel(e.target.value)}
//                                                 />
//                                             </Grid>
//                                         </Grid>
//                                     </Grid>
//                                 </CardContent>
//                             </Card> */}

// <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                             <Grid
//                                                 container
//                                                 spacing={1}
//                                                 direction="row"
//                                                 justifyContent="space-between"
//                                                 alignItems="center"
//                                                 sx={{ marginBottom: 4, gap: 5 }}
//                                             >
//                                                 <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
//                                                     Ngày tạo:{' '}
//                                                 </Typography>
//                                                 <DatePicker
//                                                     sx={{
//                                                         width: '70%',
//                                                         '& .MuiInputBase-input': {
//                                                             fontSize: '1rem',
//                                                             padding: '10px',
//                                                         },
//                                                     }}
//                                                 />
//                                             </Grid>
//                                         </LocalizationProvider>
//                                         <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                             <Grid
//                                                 container
//                                                 spacing={1}
//                                                 direction="row"
//                                                 justifyContent="space-between"
//                                                 alignItems="center"
//                                                 sx={{ marginBottom: 4, gap: 5 }}
//                                             >
//                                                 <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
//                                                     Ngày cập nhật:{' '}
//                                                 </Typography>
//                                                 <DatePicker
//                                                     sx={{
//                                                         width: '70%',
//                                                         '& .MuiInputBase-input': {
//                                                             fontSize: '1rem',
//                                                             padding: '10px',
//                                                         },
//                                                     }}
//                                                 />
//                                             </Grid>
//                                         </LocalizationProvider>