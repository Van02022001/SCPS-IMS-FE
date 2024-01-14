import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Tab,
    Tabs,
    Stack,
    Grid,
    TextField,
    FormControl,
    Select,
    MenuItem,
    CardContent,
    Card,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
// icons
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
//notification
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// api
import { editSubCategory, editStatusCategory } from '~/data/mutation/subCategory/subCategory-mutation';
import { getAllCategories } from '~/data/mutation/categories/categories-mutation';
import { getAllUnit, getAllUnitMeasurement } from '~/data/mutation/unit/unit-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import { editSubCategorysMeta, getAllSubCategoryMeta } from '~/data/mutation/subCategoryMeta/subCategoryMeta-mutation';
import { getItemsBySubCategory } from '~/data/mutation/items/item-mutation';
//Thông báo
import CustomDialog from '~/components/alert/ConfirmDialog';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';

const SubCategoryInventoryDetailForm = ({
    subCategory,
    subCategorytatus,
    subCategoryId,
    updateSubCategoryInList,
    updateSubCategoryStatusInList,
    onClose,
    isOpen,
    mode,
}) => {
    const [tab1Data, setTab1Data] = useState({ categories_id: [] });
    const [tab2Data, setTab2Data] = useState({});
    const [tab3Data, setTab3Data] = useState({});

    // const [expandedItem, setExpandedItem] = useState(subCategoryId);
    const [formHeight, setFormHeight] = useState(0);
    const [currentTab, setCurrentTab] = useState(0);

    const [categories_id, setCategories_id] = useState([]);
    const [unit_id, setUnits_id] = useState([]);
    const [unit_mea_id, setUnit_mea_id] = useState([]);
    const [subCategoryMeta, setSubCategoryMeta] = useState([]);
    const [itemsDetail, setItemsDetail] = useState([]);

    const [editedSubCategory, setEditedSubCategory] = useState(null);
    const [editSubCategoryMeta, setEditSubCategoryMeta] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('');
    // form
    const [openAddSubCategoryMetaForm, setOpenAddSubCategoryMetaForm] = useState(false);

    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [confirmOpen1, setConfirmOpen1] = useState(false);
    const [confirmOpen2, setConfirmOpen2] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Update sub category status successfully.') {
            setSuccessMessage('Cập nhập trạng thái danh mục thành công');
        } else if (message === 'Update sub category successfully.') {
            setSuccessMessage('Cập nhập danh mục thành công');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Category name was existed') {
            setErrorMessage('Tên thể loại đã tồn tại !');
        } else if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ');
        } else if (message === '404 NOT_FOUND') {
            setErrorMessage('Mô tả quá dài');
        } else if (message === 'Sub category name was existed') {
            setErrorMessage('Tên đã tồn tại !');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setOpen1(false);
        setSuccessMessage('');
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
    const handleConfirmClose1 = () => {
        setConfirmOpen1(false);
    };

    const handleConfirmUpdate1 = () => {
        setConfirmOpen1(false);
        updateSubCategory();
    };

    const handleConfirm1 = () => {
        setConfirmOpen1(true);
    };

    const handleConfirmUpdateStatus2 = () => {
        setConfirmOpen2(false);
        updateSubCategoryStatus();
    };

    const handleConfirm2 = () => {
        setConfirmOpen2(true);
    };

    //========================== Hàm notification của trang ==================================

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

    const handleOpenAddSubCategoryMetaForm = () => {
        setOpenAddSubCategoryMetaForm(true);
    };

    const handleCloseAddSubCategoryMetaForm = () => {
        setOpenAddSubCategoryMetaForm(false);
    };

    useEffect(() => {
        if (isOpen) {
            setFormHeight(1000);
        } else {
            setFormHeight(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (mode === 'create') {
            const defaultUnitId = unit_id.find((unit) => unit.name === 'Cái').id;
            setEditedSubCategory({
                name: '',
                description: '',
                minStockLevel: 0,
                maxStockLevel: 0,
                categories_id: [],
                unit_id: defaultUnitId,
                length: 0,
                width: 0,
                height: 0,
                diameter: 0,
                unit_mea_id: 0,
            });
        } else {
            const subCategorys = subCategory.find((o) => o.id === subCategoryId);
            console.log(subCategorys);
            if (subCategorys) {
                const categoryIds = subCategorys.categories
                    ? subCategorys.categories.map((category) => category.id)
                    : [];
                const unitId = subCategorys.unit ? subCategorys.unit.id : 0;
                const unitMeaId = subCategorys.size.unitMeasurement ? subCategorys.size.unitMeasurement.id : 0;

                const editedSubCategory = {
                    name: subCategorys.name,
                    description: subCategorys.description,
                    categories_id: categoryIds,
                    unit_id: unitId,
                    length: subCategorys.size.length ? subCategorys.size.length : 0,
                    width: subCategorys.size ? subCategorys.size.width : 0,
                    height: subCategorys.size ? subCategorys.size.height : 0,
                    diameter: subCategorys.size ? subCategorys.size.diameter : 0,
                    unit_mea_id: unitMeaId,
                };

                setEditedSubCategory(editedSubCategory);
                setCurrentStatus(subCategorys.status);
            }
        }
    }, [subCategoryId, subCategory, mode]);

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
        getAllUnitMeasurement().then((respone) => {
            const data = respone.data;
            setUnit_mea_id(data);
        });
        // getAllSubCategoryMeta(subCategoryId)
        //     .then((respone) => {
        //         const data = respone.data;
        //         setSubCategoryMeta(data);
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching subcategory meta:', error);
        //         setSubCategoryMeta(null);
        //     });

        getItemsBySubCategory(subCategoryId)
            .then((respone) => {
                const data = respone.data;
                setItemsDetail(data);
            })

            .catch((error) => console.error('Error fetching units measurement:', error));
    }, []);

    // useEffect(() => {
    //     if (mode === 'create') {

    //         setEditSubCategoryMeta({
    //             key: '',
    //             description: '',

    //         });
    //     } else {
    //         if (subCategoryMeta) {
    //             const editedSubCategoryMeta = {
    //                 key: subCategoryMeta.key ? subCategoryMeta.key : '',
    //                 description: subCategoryMeta.description ? subCategoryMeta.description : '',
    //             };
    //             setEditSubCategoryMeta(editedSubCategoryMeta);
    //         }
    //     }
    // }, [subCategoryMeta]);

    const subCategorys = subCategory.find((o) => o.id === subCategoryId);

    if (!subCategorys) {
        return null;
    }

    const updateSubCategory = async () => {
        if (!editedSubCategory) {
            return;
        }
        try {
            const response = await editSubCategory(subCategoryId, editedSubCategory);

            if (response.status === '200 OK') {
                setSuccessMessage(response.message);
                handleSuccessMessage(response.message);
            }

            updateSubCategoryInList(response.data);
            console.log('Product updated:', response.message);
        } catch (error) {
            console.error('An error occurred while updating the product:', error);
            handleErrorMessage(error.response?.data?.message);
        }
    };

    const updateSubCategoryStatus = async () => {
        try {
            let newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

            const response = await editStatusCategory(subCategoryId, newStatus);

            if (response.status === '200 OK') {
                setSuccessMessage(response.message);
                handleSuccessMessage(response.message);
            }

            updateSubCategoryStatusInList(subCategoryId, newStatus);
            setCurrentStatus(newStatus);

            console.log('Product status updated:', response);
        } catch (error) {
            console.error('Error updating category status:', error);
            handleErrorMessage(error.response.data.message)
            if (error.response) {
                console.log('Error response:', error.response);
            }
        }
    };

    const handleClear = () => { };

    const handleEdit = (field, value) => {
        console.log(`Field: ${field}, Value: ${value}`);
        if (field === 'categories_id') {
            const categoryIds = value.map(Number).filter(Boolean);
            setEditedSubCategory((prevProduct) => ({
                ...prevProduct,
                [field]: categoryIds,
            }));
        } else if (field === 'unit_id' || field === 'unit_mea_id') {
            const id = parseInt(value);
            setEditedSubCategory((prevProduct) => ({
                ...prevProduct,
                [field]: id,
            }));
        } else {
            setEditedSubCategory((prevProduct) => ({
                ...prevProduct,
                [field]: value,
            }));
        }
    };

    const handleEditSubCategoryMeta = (field, value) => {
        setEditSubCategoryMeta((prevSubCategoryMeta) => ({
            ...prevSubCategoryMeta,
            [field]: value,
        }));
    };


    return editedSubCategory ? (
        <div
            id="productDetailForm"
            className="ProductDetailForm"
            style={{
                backgroundColor: 'white',
                zIndex: 999,
            }}
        >
            <Tabs value={currentTab} onChange={handleChangeTab} indicatorColor="primary" textColor="primary">
                <Tab label="Thông tin" />
                <Tab label="Thông tin thêm" />
                {/* <Tab label="Tồn kho" /> */}
            </Tabs>

            {currentTab === 0 && (
                <div>
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
                                    <Typography variant="body1">Tên sản phẩm:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Tên sản phẩm"
                                        sx={{ width: '70%' }}
                                        value={editedSubCategory ? editedSubCategory.name : ''}
                                        onChange={(e) => handleEdit('name', capitalizeFirstLetter(e.target.value))}
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
                                    <Typography variant="body1">Mô tả:</Typography>
                                    <TextField
                                        id="outlined-multiline-static"
                                        multiline
                                        rows={4}
                                        size="small"
                                        variant="outlined"
                                        label="Mô tả"
                                        sx={{ width: '70%' }}
                                        value={editedSubCategory ? editedSubCategory.description : ''}
                                        onChange={(e) => handleEdit('description', capitalizeFirstLetter(e.target.value))}
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
                                    <Typography variant="body1">Ngày tạo:</Typography>
                                    <TextField
                                        disabled
                                        size="small"
                                        variant="outlined"
                                        label="Ngày tạo"
                                        sx={{ width: '70%' }}
                                        value={subCategorys.createdAt}
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
                                    <Typography variant="body1">Ngày cập nhập:</Typography>
                                    <TextField
                                        disabled
                                        size="small"
                                        variant="outlined"
                                        label="Ngày cập nhập"
                                        sx={{ width: '70%' }}
                                        value={subCategorys.updatedAt}
                                    />
                                </Grid>
                            </Grid>

                            {/* 5 field bên phải*/}
                            <Grid item xs={6}>
                                <div style={{ marginLeft: 30 }}>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="body1">Trạng thái:</Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Trạng thái"
                                            sx={{ width: '70%' }}
                                            value={currentStatus === 'Active' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
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
                                            Nhóm hàng:{' '}
                                        </Typography>
                                        <Grid xs={8.5}>
                                            <Select
                                                size="small"
                                                labelId="group-label"
                                                id="group-select"
                                                sx={{ width: '100%', fontSize: '14px' }}
                                                multiple
                                                value={editedSubCategory.categories_id}
                                                onChange={(e) => handleEdit('categories_id', e.target.value)}
                                                name="categories_id"
                                            >
                                                {categories_id.map((category) => (
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
                                        <Typography variant="body1">Đơn vị:</Typography>
                                        <Select
                                            size="small"
                                            variant="outlined"
                                            label="Đơn vị"
                                            sx={{ width: '70%' }}
                                            value={editedSubCategory.unit_id}
                                            onChange={(e) => handleEdit('unit_id', e.target.value)}
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
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>

                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="body1">Đơn vị đo lường:</Typography>
                                        <Select
                                            size="small"
                                            variant="outlined"
                                            label="Đơn vị đo lường"
                                            sx={{ width: '70%' }}
                                            value={editedSubCategory.unit_mea_id}
                                            onChange={(e) => handleEdit('unit_mea_id', e.target.value)}
                                        >
                                            {unit_mea_id.map((unitMeaId) => (
                                                <MenuItem
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                    key={unitMeaId.id}
                                                    value={unitMeaId.id}
                                                >
                                                    {unitMeaId.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
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
                                        <div style={{ display: 'flex' }}>
                                            <FormControl sx={{ m: 0.2 }} variant="standard">
                                                <TextField
                                                    id="demo-customized-textbox"
                                                    label="Chiều dài"
                                                    value={editedSubCategory ? editedSubCategory.length : 0}
                                                    onChange={(e) => handleEdit('length', e.target.value)}
                                                />
                                            </FormControl>
                                            <FormControl sx={{ m: 0.2 }} variant="standard">
                                                <TextField
                                                    id="demo-customized-textbox"
                                                    label="Chiều rộng"
                                                    value={editedSubCategory ? editedSubCategory.width : 0}
                                                    onChange={(e) => handleEdit('width', e.target.value)}
                                                />
                                            </FormControl>
                                            <FormControl sx={{ m: 0.2 }} variant="standard">
                                                <TextField
                                                    id="demo-customized-textbox"
                                                    label="Chiều cao"
                                                    value={editedSubCategory ? editedSubCategory.height : 0}
                                                    onChange={(e) => handleEdit('height', e.target.value)}
                                                />
                                            </FormControl>
                                            <FormControl sx={{ m: 0.2 }} variant="standard">
                                                <TextField
                                                    id="demo-customized-textbox"
                                                    label="Đường kính"
                                                    value={editedSubCategory ? editedSubCategory.diameter : 0}
                                                    onChange={(e) => handleEdit('diameter', e.target.value)}
                                                />
                                            </FormControl>
                                        </div>
                                    </Grid>
                                </div>
                            </Grid>
                        </Grid>
                    </Stack>

                    <div>
                        <Card sx={{ marginTop: 5 }}>
                            <CardContent>
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            <TableRow
                                                variant="subtitle1"
                                                sx={{
                                                    fontSize: '20px',
                                                    backgroundColor: '#f0f1f3',
                                                    height: 50,
                                                    textAlign: 'start',
                                                    fontFamily: 'bold',
                                                    padding: '10px 0 0 20px',
                                                }}
                                            >
                                                <TableCell>Mã sản phẩm</TableCell>
                                                <TableCell>Số lượng</TableCell>
                                                <TableCell>Đơn giá</TableCell>
                                                <TableCell>Thương hiệu</TableCell>
                                                <TableCell>Nhà cung cấp</TableCell>
                                                <TableCell>Xuất xứ</TableCell>
                                                <TableCell>Thẻ kho</TableCell>
                                                <TableCell>Tồn kho</TableCell>
                                            </TableRow>
                                            {itemsDetail.map((items) => {
                                                return (
                                                    <TableRow key={items.id}>
                                                        <TableCell>{items.code}</TableCell>
                                                        <TableCell>{items.quantity}</TableCell>
                                                        <TableCell>
                                                            {items.pricing !== null ? (
                                                                <div>{items.pricing.price}</div>
                                                            ) : (
                                                                'Chưa có'
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{items.brand.name}</TableCell>
                                                        <TableCell>{items.supplier.name}</TableCell>
                                                        <TableCell>{items.origin.name}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {currentTab === 1 && (
                <div style={{ flex: 1 }}>
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
                            Mô tả sơ lược
                        </Typography>
                        <CardContent>
                            <TextField
                                id="outlined-multiline-static"
                                multiline
                                rows={4}
                                defaultValue="Mô tả sơ lược"
                                sx={{ width: '100%', border: 'none' }}
                                value={editSubCategoryMeta ? editSubCategoryMeta.key : ''}
                                onChange={(e) => handleEditSubCategoryMeta('key', e.target.value)}
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
                                defaultValue="Mô tả"
                                sx={{ width: '100%', border: 'none' }}
                                value={editSubCategoryMeta ? editSubCategoryMeta.description : ''}
                                onChange={(e) => handleEditSubCategoryMeta('description', capitalizeFirstLetter(e.target.value))}
                            />
                        </CardContent>
                    </Card>

                </div>
            )}
        </div>
    ) : null;
};

export default SubCategoryInventoryDetailForm;
