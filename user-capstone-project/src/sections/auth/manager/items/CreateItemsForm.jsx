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
} from '@mui/material';
import React, { useEffect, useState } from 'react';
//icons
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
//components
import BoxComponent from '~/components/box/BoxComponent';
// form popup

// api
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
// import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
import { createItem } from '~/data/mutation/items/item-mutation';
import { getAllSubCategoryActive } from '~/data/mutation/subCategory/subCategory-mutation';
import { getAllBrands } from '~/data/mutation/brand/brands-mutation';
import { getAllOrigins } from '~/data/mutation/origins/origins-mutation';
import { getAllSuppliers } from '~/data/mutation/supplier/suppliers-mutation';
import AddBrandItemForm from './AddBrandItemForm';
import AddOriginItemForm from './AddOriginItemForm';
import AddSupplierFrom from './AddSupplierFrom';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';


const CreateItemsForm = (props) => {
    const [open, setOpen] = React.useState(false);
    const [currentTab, setCurrentTab] = useState(0);
    const [tab1Data, setTab1Data] = useState({ sub_category_id: [], brand_id: [], supplier_id: [], origin_id: [] });
    const [tab2Data, setTab2Data] = useState({});

    //=====================================mở popup form
    const [openAddSuplierForm, setOpenAddSuplierForm] = useState(false);
    const [openAddOriginForm, setOpenAddOriginForm] = useState(false);
    const [openAddBrandForm, setOpenAddBrandForm] = useState(false);

    // form để call api
    const [minStockLevel, setMinStockLevel] = useState([]);
    const [maxStockLevel, setMaxStockLevel] = useState([]);
    const [sub_category_id, setSub_category_id] = useState([]);
    const [brand_id, setBrands_id] = useState([]);
    const [supplier_id, setSuppliers_id] = useState([]);
    const [origin_id, setOrigins_id] = useState([]);

    //thông báo
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');

    const handleTab1DataChange = (event) => {
        // Cập nhật dữ liệu cho tab 1 tại đây
        setTab1Data({ ...tab1Data, [event.target.name]: event.target.value });
        console.log('setTab1Data: ', setTab1Data);
    };

    const handleTab2DataChange = (event) => {
        // Cập nhật dữ liệu cho tab 2 tại đây
        setTab2Data({ ...tab2Data, [event.target.name]: event.target.value });
    };

    const handleChangeTab = (event, newValue) => {
        setCurrentTab(newValue);
    };

    //======================================================== hàm xử lý đóng mở popup form========================================================
    const handleOpenAddBrandForm = () => {
        setOpenAddBrandForm(true);
    };
    const handleCloseAddBrandForm = () => {
        setOpenAddBrandForm(false);
    };

    const handleOpenAddOriginForm = () => {
        setOpenAddOriginForm(true);
    };

    const handleCloseAddOriginForm = () => {
        setOpenAddOriginForm(false);
    };

    const handleOpenAddSuplierForm = () => {
        setOpenAddSuplierForm(true);
    };

    const handleCloseAddSuplierForm = () => {
        setOpenAddSuplierForm(false);
    };

    const handleSaveBrand = (successMessage) => {
        handleCloseAddBrandForm();

        console.log(successMessage);
        setSnackbarSuccessMessage(successMessage === 'Create brand successfully' ? 'Tạo thể loại thành công!' : 'Thành công');
        setSnackbarSuccessOpen(true);
    };

    const handleSaveOrigin = (successMessage) => {
        handleCloseAddOriginForm();

        setSnackbarSuccessMessage(successMessage === 'Create origin successfully' ? 'Tạo thể loại thành công!' : 'Thành công');
        setSnackbarSuccessOpen(true);
    };

    const handleSaveSupplier = (successMessage) => {
        handleCloseAddSuplierForm();

        setSnackbarSuccessMessage(successMessage === 'Create supplier successfully' ? 'Tạo thể loại thành công!' : 'Thành công');
        setSnackbarSuccessOpen(true);
    };
    //================================================================================================================

    //========================== Hàm notification của trang ==================================
    const handleMessage = (message) => {
        setOpen(true);
        // Đặt logic hiển thị nội dung thông báo từ API ở đây
        if (message === 'Update SubCategory status successfully.') {
            setMessage('Cập nhập trạng thái danh mục thành công')
        } else if (message === 'Update SubCategory successfully.') {
            setMessage('Cập nhập danh mục thành công')
            console.error('Error message:', errorMessage);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);

    };
    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="lage" />
            </IconButton>
        </React.Fragment>
    );
    //============================================================
    // hàm create category-----------------------------------------
    const handleCreateItem = async () => {
        if (parseInt(minStockLevel) < 5) {
            setIsError(true);
            setIsSuccess(false);
            if (isError) {
                setErrorMessage('Số lượng tồn kho tối thiểu phải nhập ít nhất là 5');
            }
            return;
        }

        const itemParams = {
            minStockLevel,
            maxStockLevel,
            sub_category_id: tab1Data.sub_category_id,
            brand_id: tab1Data.brand_id,
            supplier_id: tab1Data.supplier_id,
            origin_id: tab1Data.origin_id,
        };
        try {
            const response = await createItem(itemParams);
            if (response.status === "200 OK") {
                // setIsSuccess(true);
                // setIsError(false);
                // setSuccessMessage(response.data.message);
                handleMessage(response.message);
                props.onClose(response.data, response.message);

            }
        } catch (error) {
            console.error('Error creating product:', error.response.status);
            setIsError(true);
            setIsSuccess(false);
            if (error.response?.data?.message === "Min stock cannot be greater than max stock") {
                setErrorMessage('Số lượng tồn kho tối thiểu không thể lớn hơn lượng hàng tồn kho tối đa');
            }
        }
    };

    const handleClear = () => {
        setMinStockLevel('');
        setMaxStockLevel('');
        // setSub_category_id([]);
        // setBrands_id([]);
        // setSuppliers_id([]);
        // setOrigins_id([]);
    };


    useEffect(() => {
        getAllSubCategoryActive()
            .then((respone) => {
                const data = respone.data;
                setSub_category_id(data);
            })
            .catch((error) => console.error('Error fetching sub_categories:', error));

        getAllBrands()
            .then((respone) => {
                const data = respone.data;
                setBrands_id(data);
            })
            .catch((error) => console.error('Error fetching brands:', error));
        getAllOrigins()
            .then((respone) => {
                const data = respone.data;
                setOrigins_id(data);
            })
            .catch((error) => console.error('Error fetching brands:', error));
        getAllSuppliers()
            .then((respone) => {
                const data = respone.data;
                setSuppliers_id(data);
            })
            .catch((error) => console.error('Error fetching brands:', error));
    }, [openAddOriginForm, openAddBrandForm]);

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
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            spacing={1}
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{ marginBottom: 4, gap: 5 }}
                                        >
                                            <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                                Danh mục sản phẩm:{' '}
                                            </Typography>
                                            <Grid xs={8.5}>
                                                <Select
                                                    size="small"
                                                    labelId="group-label"
                                                    id="group-select"
                                                    sx={{ width: '90%', fontSize: '14px' }}
                                                    value={tab1Data.sub_category_id}
                                                    onChange={handleTab1DataChange}
                                                    name="sub_category_id"
                                                >
                                                    {sub_category_id.map((category) => (
                                                        <MenuItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Grid>
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
                                                Thương hiệu:{' '}
                                            </Typography>
                                            <Grid xs={8.5}>
                                                <Select
                                                    size="small"
                                                    labelId="group-label"
                                                    id="group-select"
                                                    sx={{ width: '82%', fontSize: '14px' }}
                                                    value={tab1Data.brand_id}
                                                    onChange={handleTab1DataChange}
                                                    name="brand_id"
                                                >
                                                    {brand_id.map((brand) => (
                                                        <MenuItem key={brand.id} value={brand.id}>
                                                            {brand.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <Button
                                                    variant="outlined"
                                                    sx={{ padding: 0.8, minWidth: 0 }}
                                                    onClick={handleOpenAddBrandForm}
                                                >
                                                    <AddIcon />
                                                </Button>
                                                <AddBrandItemForm
                                                    open={openAddBrandForm}
                                                    onClose={handleCloseAddBrandForm}
                                                    onSave={handleSaveBrand}
                                                />
                                            </Grid>
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
                                                Nhà cung cấp:{' '}
                                            </Typography>
                                            <Grid xs={8.5}>
                                                <Select
                                                    size="small"
                                                    labelId="group-label"
                                                    id="group-select"
                                                    sx={{ width: '82%', fontSize: '14px' }}
                                                    value={tab1Data.supplier_id}
                                                    onChange={handleTab1DataChange}
                                                    name="supplier_id"
                                                >
                                                    {supplier_id.map((supplier) => (
                                                        <MenuItem key={supplier.id} value={supplier.id}>
                                                            {supplier.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <Button
                                                    variant="outlined"
                                                    sx={{ padding: 0.8, minWidth: 0 }}
                                                    onClick={handleOpenAddSuplierForm}
                                                >
                                                    <AddIcon />
                                                </Button>
                                                <AddSupplierFrom
                                                    open={openAddSuplierForm}
                                                    onClose={handleCloseAddSuplierForm}
                                                    onSave={handleSaveSupplier}
                                                />
                                            </Grid>
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
                                                Nguồn gốc:{' '}
                                            </Typography>
                                            <Grid xs={8.5}>
                                                <Select
                                                    size="small"
                                                    labelId="group-label"
                                                    id="group-select"
                                                    sx={{ width: '82%', fontSize: '14px' }}
                                                    value={tab1Data.origin_id}
                                                    onChange={handleTab1DataChange}
                                                    name="origin_id"
                                                >
                                                    {origin_id.map((origin) => (
                                                        <MenuItem key={origin.id} value={origin.id}>
                                                            {origin.name}
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
                                                <AddOriginItemForm
                                                    open={openAddOriginForm}
                                                    onClose={handleCloseAddOriginForm}
                                                    onSave={handleSaveOrigin}
                                                />
                                            </Grid>
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
                                                Định mức tồn:{' '}
                                            </Typography>
                                            <div style={{ display: 'flex' }}>
                                                <FormControl sx={{ m: 0.2 }} variant="standard">
                                                    <TextField
                                                        id="demo-customized-textbox"
                                                        label="Ít nhất"
                                                        helperText="Ít nhất phải 5"
                                                        value={minStockLevel}
                                                        onChange={(e) => setMinStockLevel(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormControl sx={{ m: 0.2 }} variant="standard">
                                                    <TextField
                                                        id="demo-customized-textbox"
                                                        label="Nhiều nhất"
                                                        value={maxStockLevel}
                                                        onChange={(e) => setMaxStockLevel(e.target.value)}
                                                    />
                                                </FormControl>
                                            </div>
                                        </Grid>
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
                                        onClick={handleCreateItem}
                                    >
                                        Lưu
                                    </Button>
                                    <Snackbar
                                        open={open}
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
                </DialogContent>
            </div>
            <SnackbarSuccess
                open={snackbarSuccessOpen}
                handleClose={() => setSnackbarSuccessOpen(false)}
                message={snackbarSuccessMessage}
                style={{ bottom: '16px', right: '16px' }}
            />
        </>
    );
};

export default CreateItemsForm;
