import {
    Button,
    DialogContent,
    FormControl,
    Grid,
    MenuItem,
    Select,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
    IconButton,
    FormHelperText,
} from '@mui/material';

import React, { useEffect, useState } from 'react';
//icons
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';

//components
// import BoxComponent from '~/components/box/BoxComponent';

// form popup
import AddCategoryForm from './AddCategoryForm';
import AddUnitForm from './AddUnitForm';

// api
import { createSubCategory } from '~/data/mutation/subCategory/subCategory-mutation';
import { getAllCategoriesActive } from '~/data/mutation/categories/categories-mutation';
import { getAllUnit, getAllUnitMeasurement } from '~/data/mutation/unit/unit-mutation';
import { getAllOrigins } from '~/data/mutation/origins/origins-mutation';

import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import SnackbarError from '~/components/alert/SnackbarError';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';

const CreateSubCategoryForm = (props) => {
    const [openSubAddCategory, setOpenSubAddCategory] = React.useState(false);
    const [currentTab, setCurrentTab] = useState(0);
    const [tab1Data, setTab1Data] = useState({ categories_id: [] });
    const [tab2Data, setTab2Data] = useState({});

    // mở popup form
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
    // const [openAddOriginForm, setOpenAddOriginForm] = useState(false);
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

    const [nameError, setNameError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);
    const [categoriesError, setCategoriesError] = useState(null);
    const [UnitError, setUnitError] = useState(null);
    const [unitMeaError, setUnitMeaError] = useState(null);
    //thông báo
    const [message, setMessage] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [open1, setOpen1] = React.useState(false);
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');
    //========================== Hàm notification của trang ==================================
    const handleMessage = (message) => {
        setOpenSubAddCategory(true);
        // Đặt logic hiển thị nội dung thông báo từ API ở đây
        if (message === 'Create sub category successfully.') {
            setMessage('Tạo mới sản phẩm thành công !');
        } else if (message === 'Update SubCategory successfully.') {
            setMessage('Cập nhập danh mục thành công');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Sub category name was existed') {
            setErrorMessage('Tên danh mục đã tồn tại !');
        } else if (message === 'unit_mea_id: Unit of measurement id is required') {
            setErrorMessage('Vui lòng chọn đơn vị đo lường !');
        } else if (message === 'unit_id: Required field') {
            setErrorMessage('Vui lòng chọn đơn vị !');
        } else if (message === 'name: size must be between 1 and 100') {
            setErrorMessage('Tên phải từ 1 - 100 ký tự !');
        } else if (message === 'description: Required field') {
            setErrorMessage('Vui lòng nhập mô tả !');
        } else if (message === 'description: The first letter must be uppercase.') {
            setErrorMessage('Chữ cái đầu của mô tả phải viết hoa !');
        } else if (message === 'SubCategory must have at least one category') {
            setErrorMessage('Vui lòng chọn nhóm hàng !');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSubAddCategory(false);
        setOpen1(false);
        setErrorMessage('');
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}></Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="lage" />
            </IconButton>
        </React.Fragment>
    );

    const handleCloseSnackbar = () => {
        setOpen1(false);
    };
    //============================================================

    const handleTab1DataChange = (event) => {
        const { name, value } = event.target;

        if (name === 'categories_id') {
            setCategoriesError(null);
        } else if (name === 'unit_id') {
            setUnitError(null);
        } else if (name === 'unit_mea_id') {
            setUnitMeaError(null);
        }

        if (name === 'categories_id') {
            setCategoriesError(null);
            setTab1Data((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else if (name === 'unit_id') {
            setUnitError(null);
            setTab1Data((prevData) => ({
                ...prevData,
                [name]: [value],
            }));
        } else if (name === 'unit_mea_id') {
            setUnitMeaError(null);
            setTab1Data((prevData) => ({
                ...prevData,
                [name]: [value],
            }));
        } else {
            setTab1Data((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // const handleTab2DataChange = (event) => {
    //     // Cập nhật dữ liệu cho tab 2 tại đây
    //     setTab2Data({ ...tab2Data, [event.target.name]: event.target.value });
    // };

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
    const handleSaveCategory = (successMessage) => {
        handleCloseAddCategoryDialog();

        setSnackbarSuccessMessage(
            successMessage === 'Create category successfully' ? 'Tạo nhóm hàng thành công!' : 'Thành công',
        );
        setSnackbarSuccessOpen(true);
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

    const handleCloseAddUnitForm = () => {
        setOpenAddUnitForm(false);
    };
    const handleSaveUnit = (successMessage) => {
        handleCloseAddUnitForm();

        setSnackbarSuccessMessage(
            successMessage === 'Create unit successfully' ? 'Tạo đơn vị thành công!' : 'Thành công',
        );
        setSnackbarSuccessOpen(true);
    };

    // hàm create category-----------------------------------------
    const handleCreateProduct = async () => {
        if (!tab1Data.categories_id || !tab1Data.categories_id.length) {
            setCategoriesError('Vui lòng chọn ít nhất một nhóm hàng');
            return;
        } else if (!tab1Data.unit_id || !tab1Data.unit_id.length) {
            setUnitError('Vui lòng chọn đơn vị');
            return;
        } else if (!tab1Data.unit_mea_id || !tab1Data.unit_mea_id.length) {
            setUnitMeaError('Vui lòng chọn đơn vị đo lường');
            return;
        }
        const parsedUnitId = parseInt(tab1Data.unit_id) || 0;
        const parsedUnitMeaId = parseInt(tab1Data.unit_mea_id) || 0;
        const productParams = {
            name,
            description,
            // minStockLevel,
            // maxStockLevel,
            categories_id: tab1Data.categories_id,
            unit_id: parsedUnitId,
            length,
            width,
            height,
            diameter,
            unit_mea_id: parsedUnitMeaId,
        };
        try {
            const response = await createSubCategory(productParams);
            if (response.status === '200 OK') {
                handleMessage(response.message);
                props.onClose(response.data, response.message); // Call the callback function
            }
        } catch (error) {
            console.error('Error creating product:', error.response);

            const errorMessage = error.response?.data?.message || error.response?.data?.data?.[0];

            handleErrorMessage(errorMessage);
        }
    };

    const handleClear = () => {
        setName('');
        setDescription('');
        setLength('');
        setWidth('');
        setHeight('');
        setDiameter('');
        // setCategories_id([]);
        // setUnits_id([]);
        // setOrigins_id([]);
        // setUnit_mea_id([]);
    };

    const validateName = (value) => {
        if (!value.trim()) {
            return 'Tên danh mục không được để trống';
        } else if (!/^\p{Lu}/u.test(value)) {
            return 'Chữ cái đầu phải in hoa.';
        }

        return null;
    };

    const validateDescription = (value) => {
        if (!value.trim()) {
            return 'Mô tả danh mục không được để trống.';
        }
        return null;
    };

    const handleNameChange = (e) => {
        const newName = capitalizeFirstLetter(e.target.value);
        setName(newName);

        setNameError(validateName(newName));
    };

    const handleDescriptionChange = (e) => {
        const newDescription = capitalizeFirstLetter(e.target.value);
        setDescription(newDescription);

        setDescriptionError(validateDescription(newDescription)); // Implement validateDescription function
    };

    useEffect(() => {
        getAllCategoriesActive()
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
    }, [openAddUnitForm, openAddCategoryDialog]);

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <DialogContent style={{ width: '90%' }}>
                    <Tabs value={currentTab} onChange={handleChangeTab} indicatorColor="primary" textColor="primary">
                        <Tab label="Thông tin" />
                        {/* <Tab label="Mô tả chi tiết" /> */}
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
                                                Tên danh mục:{' '}
                                            </Typography>
                                            <TextField
                                                helperText={nameError}
                                                error={Boolean(nameError)}
                                                size="small"
                                                variant="outlined"
                                                label="Tên hàng"
                                                sx={{ width: '70%' }}
                                                value={name}
                                                onChange={handleNameChange}
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
                                                Mô tả về danh mục:{' '}
                                            </Typography>
                                            <TextField
                                                id="outlined-multiline-static"
                                                helperText={descriptionError}
                                                error={Boolean(descriptionError)}
                                                multiline
                                                rows={4}
                                                size="small"
                                                label="Mô tả"
                                                variant="outlined"
                                                sx={{ width: '70%' }}
                                                value={description}
                                                onChange={handleDescriptionChange}
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
                                                        multiple
                                                        value={[...tab1Data.categories_id]}
                                                        onChange={handleTab1DataChange}
                                                        name="categories_id"
                                                        required
                                                        error={Boolean(categoriesError)}
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
                                                        onSave={handleSaveCategory}
                                                    />
                                                    <FormHelperText error={Boolean(categoriesError)}>
                                                        {categoriesError}
                                                    </FormHelperText>
                                                </Grid>
                                            </Grid>
                                        </FormControl>

                                        <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                            <Grid
                                                container={1}
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
                                                        required
                                                        error={Boolean(UnitError)}
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
                                                        onClose={handleCloseAddUnitForm}
                                                        onSave={handleSaveUnit}
                                                    />
                                                    <FormHelperText error={Boolean(setUnitError)}>
                                                        {UnitError}
                                                    </FormHelperText>
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
                                                        error={Boolean(unitMeaError)}
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
                                                    <FormHelperText error={Boolean(setUnitMeaError)}>
                                                        {unitMeaError}
                                                    </FormHelperText>
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
                                                        onChange={(e) =>
                                                            setLength(
                                                                Math.min(
                                                                    Number(e.target.value.replace(/[^0-9.-]/g, '')),
                                                                    1000,
                                                                ),
                                                            )
                                                        }
                                                        inputProps={{
                                                            max: 1000,
                                                            step: 1,
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormControl sx={{ m: 0.2 }} variant="standard">
                                                    <TextField
                                                        id="demo-customized-textbox"
                                                        label="Chiều rộng"
                                                        value={width}
                                                        onChange={(e) =>
                                                            setWidth(
                                                                Math.min(
                                                                    Number(e.target.value.replace(/[^0-9.-]/g, '')),
                                                                    1000,
                                                                ),
                                                            )
                                                        }
                                                        inputProps={{
                                                            max: 1000,
                                                            step: 1,
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormControl sx={{ m: 0.2 }} variant="standard">
                                                    <TextField
                                                        id="demo-customized-textbox"
                                                        label="Chiều cao"
                                                        value={height}
                                                        onChange={(e) =>
                                                            setHeight(
                                                                Math.min(
                                                                    Number(e.target.value.replace(/[^0-9.-]/g, '')),
                                                                    1000,
                                                                ),
                                                            )
                                                        }
                                                        inputProps={{
                                                            max: 1000,
                                                            step: 1,
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormControl sx={{ m: 0.2 }} variant="standard">
                                                    <TextField
                                                        id="demo-customized-textbox"
                                                        label="Đường kính"
                                                        value={diameter}
                                                        onChange={(e) =>
                                                            setDiameter(
                                                                Math.min(
                                                                    Number(e.target.value.replace(/[^0-9.-]/g, '')),
                                                                    1000,
                                                                ),
                                                            )
                                                        }
                                                        inputProps={{
                                                            max: 1000,
                                                            step: 1,
                                                        }}
                                                    />
                                                </FormControl>
                                            </div>
                                        </Grid>

                                        {/* Thêm các trường khác ở đây */}
                                    </Grid>
                                </Grid>
                                {/* <Grid container spacing={2} sx={{ gap: '20px' }}>
                                    <BoxComponent />
                                    <BoxComponent />
                                    <BoxComponent />
                                </Grid> */}

                                <Grid container spacing={1} sx={{ gap: '20px' }}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        onClick={handleCreateProduct}
                                        disabled={Boolean(nameError || descriptionError)}
                                    >
                                        Lưu
                                    </Button>
                                    <Snackbar
                                        open={openSubAddCategory}
                                        autoHideDuration={6000}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        message={message}
                                        action={action}
                                        style={{ bottom: '16px', right: '16px' }}
                                    />
                                    <SnackbarError
                                        open={open1}
                                        handleClose={handleCloseSnackbar}
                                        message={errorMessage}
                                        action={action}
                                        style={{ bottom: '16px', right: '16px' }}
                                    />
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

                    {/* {currentTab === 1 && (
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
                    )} */}
                </DialogContent>
            </div>
            <SnackbarSuccess
                open={snackbarSuccessOpen}
                handleClose={() => {
                    setSnackbarSuccessOpen(false);
                    setSnackbarSuccessMessage('');
                }}
                message={snackbarSuccessMessage}
                style={{ bottom: '16px', right: '16px' }}
            />
        </>
    );
};

export default CreateSubCategoryForm;
