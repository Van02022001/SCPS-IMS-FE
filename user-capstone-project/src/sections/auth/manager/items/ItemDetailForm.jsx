import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Tab,
    Tabs,
    Stack,
    Grid,
    TextField,
    CardContent,
    Card,
    TableContainer,
    TableRow,
    TableCell,
    TableBody,
    Table,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    FormControl,
    Snackbar,
    TablePagination,
} from '@mui/material';

// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { editItem, editStatusItem, getItemsByPriceHistory } from '~/data/mutation/items/item-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import { getAllSubCategory } from '~/data/mutation/subCategory/subCategory-mutation';
import { getAllBrands } from '~/data/mutation/brand/brands-mutation';
import { getAllOrigins } from '~/data/mutation/origins/origins-mutation';
import { getAllSuppliers } from '~/data/mutation/supplier/suppliers-mutation';
//icons
import AddIcon from '@mui/icons-material/Add';
import CustomDialog from '~/components/alert/ConfirmDialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';
import dayjs from 'dayjs';

const ItemDetailForm = ({ items, itemId, onClose, isOpen, updateItemInList, mode, updateItemStatusInList }) => {
    const [expandedItem, setExpandedItem] = useState(itemId);
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [tab1Data, setTab1Data] = useState({ categories_id: [] });

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const [editedItem, setEditedItem] = useState({});

    const [sub_category_id, setSub_category_id] = useState([]);
    const [brand_id, setBrand_id] = useState([]);
    const [supplier_id, setSupplier_id] = useState([]);
    const [origin_id, setOrigin_id] = useState([]);
    const [itemPriceData, setItemPriceData] = useState([]);
    const [currentStatus, setCurrentStatus] = useState('');
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);

    //thông báo
    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [confirmOpen1, setConfirmOpen1] = useState(false);
    const [confirmOpen2, setConfirmOpen2] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Update item status successfully') {
            setSuccessMessage('Cập nhập trạng thái sản phẩm thành công !');
        } else if (message === 'Update item successfully') {
            setSuccessMessage('Cập nhập sản phẩm thành công !');
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Category name was existed') {
            setErrorMessage('Tên thể loại đã tồn tại !');
        } else if (message === 'Update category successfully') {
            setErrorMessage('Cập nhập thể loại thành công !');
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
        updateItems();
    };

    const handleConfirm1 = () => {
        setConfirmOpen1(true);
    };

    const handleConfirmUpdateStatus2 = () => {
        setConfirmOpen2(false);
        updateItemStatus();
    };

    const handleConfirm2 = () => {
        setConfirmOpen2(true);
    };

    //========================== Hàm notification của trang ==================================

    useEffect(() => {
        if (isOpen) {
            setFormHeight(1000);
        } else {
            setFormHeight(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (mode === 'create') {
            setEditedItem({
                minStockLevel: 0,
                maxStockLevel: 0,
                sub_category_id: [],
                brand_id: [],
                supplier_id: [],
                origin_id: [],
            });
        } else {
            const item = items.find((o) => o.id === itemId);
            console.log(item, 'Itemss day');
            if (item) {
                const editedItem = {
                    minStockLevel: item.minStockLevel,
                    maxStockLevel: item.maxStockLevel,
                    sub_category_id: item.subCategory.id,
                    brand_id: item.brand.id,
                    supplier_id: item.supplier.id,
                    origin_id: item.origin.id,
                };

                setEditedItem(editedItem);
                // setCurrentStatus(item.status);
                console.log(editedItem, 'Itemss day');
            }
        }
    }, [items, itemId, mode]);

    useEffect(() => {
        getAllSubCategory()
            .then((respone) => {
                const data = respone.data;
                setSub_category_id(data);
            })
            .catch((error) => console.error('Error fetching Sub_category:', error));

        getAllBrands()
            .then((respone) => {
                const data = respone.data;
                setBrand_id(data);
            })
            .catch((error) => console.error('Error fetching Brands:', error));
        getAllSuppliers()
            .then((respone) => {
                const data = respone.data;
                setSupplier_id(data);
            })
            .catch((error) => console.error('Error fetching Supplier:', error));
        getAllOrigins()
            .then((respone) => {
                const data = respone.data;
                setOrigin_id(data);
            })
            .catch((error) => console.error('Error fetching Origins:', error));
        getItemsByPriceHistory(itemId)
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => {
                        return dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss').diff(
                            dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'),
                        );
                    });
                    setItemPriceData(sortedData);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => console.error('Error fetching Items:', error));
    }, []);

    const item = items.find((o) => o.id === itemId);

    if (!item) {
        return null;
    }

    const handleSave = () => {
        // Xử lý lưu
    };

    const updateItemStatus = async () => {
        try {
            let newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

            const response = await editStatusItem(itemId, newStatus);

            if (response.status === '200 OK') {
                handleSuccessMessage(response.message);
            }

            // Sử dụng hàm để cập nhật trạng thái trong danh sách categories trong CategoryPage
            updateItemStatusInList(itemId, newStatus);
            setCurrentStatus(newStatus);

            console.log('Item status updated:', response);
        } catch (error) {
            console.error('Error updating category status:', error);
            setErrorMessage(error.response.data.message);
            if (error.response) {
                console.log('Error response:', error.response);
            }
        }
    };

    const handleDelete = () => {
        // Xử lý xóa
    };

    const updateItems = async () => {
        if (!editedItem) {
            return;
        }
        try {
            const response = await editItem(itemId, editedItem);

            if (response.status === '200 OK') {
                setSuccessMessage(response.message);
                handleSuccessMessage(response.message);
            }

            updateItemInList(response.data);
            console.log('Item updated:', response);
        } catch (error) {
            console.error('An error occurred while updating the item:', error);
            setErrorMessage(error.response.data.message);
            if (error.response) {
                console.log('Error response:', error.response);
            }
            handleErrorMessage(error.response.data.message);
        }
    };
    const handleEdit = (field, value) => {
        console.log(`Field: ${field}, Value: ${value}`);
        if (field === 'sub_category_id') {
            const subCategoryIds = Array.isArray(value) ? value[0] : value;
            setEditedItem((prevItems) => ({
                ...prevItems,
                [field]: subCategoryIds,
            }));
        } else {
            setEditedItem((prevItems) => ({
                ...prevItems,
                [field]: value,
            }));
        }
    };

    // hàm xử lý đóng mở popup form
    const handleOpenAddCategoryDialog = () => {
        setOpenAddCategoryDialog(true);
    };

    const handleCloseAddCategoryDialog = () => {
        setOpenAddCategoryDialog(false);
    };

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return (
        <div
            id="itemDetailForm"
            className="ItemDetailForm"
            style={{
                backgroundColor: 'white',
                zIndex: 999,
            }}
        >
            <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)}>
                <Tab label="Thông tin" />
                <Tab label="Lịch sử giá mua" />
            </Tabs>

            {selectedTab === 0 && (
                <div style={{ marginLeft: 50 }}>
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
                                    <Typography variant="body1">Mã sản phẩm:</Typography>
                                    <TextField
                                        disabled
                                        size="small"
                                        variant="outlined"
                                        label="Mã sản phẩm"
                                        sx={{ width: '65%', marginRight: 5 }}
                                        value={item.code}
                                    />
                                </Grid>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 2 }}
                                >
                                    <Typography variant="body1">Danh mục sản phẩm:</Typography>
                                    <Grid xs={8.5}>
                                        <Select
                                            size="small"
                                            labelId="group-label"
                                            id="group-select"
                                            label="Danh mục"
                                            sx={{ width: '91%', fontSize: '14px' }}
                                            value={editedItem.sub_category_id ? editedItem.sub_category_id : ''}
                                            onChange={(e) => handleEdit('sub_category_id', e.target.value)}
                                            name="sub_category_id"
                                        >
                                            {sub_category_id.map((subCategory) => (
                                                <MenuItem key={subCategory.id} value={subCategory.id}>
                                                    {subCategory.name}
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
                                    <Typography variant="body1">Thương hiệu:</Typography>
                                    <Grid xs={8.5}>
                                        <Select
                                            size="small"
                                            labelId="group-label"
                                            id="group-select"
                                            label="Chi nhánh"
                                            sx={{ width: '91%', fontSize: '14px' }}
                                            value={editedItem.brand_id ? editedItem.brand_id : ''}
                                            onChange={(e) => handleEdit('brand_id', e.target.value)}
                                            name="brand_id"
                                        >
                                            {brand_id.map((brand) => (
                                                <MenuItem key={brand.id} value={brand.id}>
                                                    {brand.name}
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
                                    <Typography variant="body1">Nhà cung cấp:</Typography>
                                    <Grid xs={8.5}>
                                        <Select
                                            size="small"
                                            labelId="group-label"
                                            id="group-select"
                                            label="Nhà cung cấp"
                                            sx={{ width: '91%', fontSize: '14px' }}
                                            value={editedItem.supplier_id ? editedItem.supplier_id : ''}
                                            onChange={(e) => handleEdit('supplier_id', e.target.value)}
                                            name="supplier_id"
                                        >
                                            {supplier_id.map((supplier) => (
                                                <MenuItem key={supplier.id} value={supplier.id}>
                                                    {supplier.name}
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
                                    <Typography variant="body1">Người tạo:</Typography>
                                    <TextField
                                        disabled
                                        size="small"
                                        variant="outlined"
                                        label="Người tạo"
                                        sx={{ width: '65%', marginRight: 5 }}
                                        value={
                                            item.createdBy.firstName +
                                            ' ' +
                                            item.createdBy.middleName +
                                            ' ' +
                                            item.createdBy.lastName
                                        }
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
                                    <Typography variant="body1">Nguồn gốc:</Typography>
                                    <Grid xs={8.5}>
                                        <Select
                                            size="small"
                                            labelId="group-label"
                                            id="group-select"
                                            label="Nguồn gốc"
                                            sx={{ width: '91%', fontSize: '14px' }}
                                            value={editedItem.origin_id ? editedItem.origin_id : ''}
                                            onChange={(e) => handleEdit('origin_id', e.target.value)}
                                            name="origin_id"
                                        >
                                            {origin_id.map((origin) => (
                                                <MenuItem key={origin.id} value={origin.id}>
                                                    {origin.name}
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
                                    <Typography variant="body1">Vị trí :</Typography>
                                    <div style={{ display: 'flex', width: '71%', alignItems: 'center' }}>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Vị trí"
                                            disabled
                                            multiline
                                            sx={{ width: '91%', marginRight: 1 }}
                                            value={
                                                item.locations
                                                    ? item.locations
                                                          .map(
                                                              (location) =>
                                                                  `${location.binNumber} - ${location.shelfNumber} - ${location.warehouse.name}`,
                                                          )
                                                          .join(',\n')
                                                    : ''
                                            }
                                        />
                                    </div>
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
                                        sx={{ width: '65%', marginRight: 5 }}
                                        value={item.createdAt}
                                    />
                                </Grid>
                            </Grid>
                            {/* 5 field bên phải*/}
                            <Grid item xs={6}>
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
                                        disabled
                                        size="small"
                                        variant="outlined"
                                        label="Trạng thái"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={item.status === 'Active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
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
                                    <Typography variant="body1">Số lượng:</Typography>
                                    <TextField
                                        disabled
                                        size="small"
                                        variant="outlined"
                                        label="Số lượng"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={item.quantity}
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
                                    <Typography variant="body1">Hàng có sẵn:</Typography>
                                    <TextField
                                        disabled
                                        size="small"
                                        variant="outlined"
                                        label="Hàng có sẵn"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={item.available}
                                    />
                                </Grid>
                                {/* <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Giá bán :</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Giá bán"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={item.pricing !== null ? item.pricing.price : 'Chưa có'}
                                    />
                                </Grid> */}
                                {/* <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Giá nhập:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Giá nhập"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={item.purchasePrice !== null ? item.purchasePrice.price : 'Chưa có'}
                                    />
                                </Grid> */}
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Đã bán:</Typography>
                                    <TextField
                                        disabled
                                        size="small"
                                        variant="outlined"
                                        label="Đã bán"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={item.sold}
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
                                    <Typography variant="body1">Hàng trả lại:</Typography>
                                    <TextField
                                        disabled
                                        size="small"
                                        variant="outlined"
                                        label="Hàng trả lại"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={item.defective}
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
                                    <Typography variant="body1">Ngày cập nhật:</Typography>
                                    <TextField
                                        disabled
                                        size="small"
                                        variant="outlined"
                                        label="Ngày cập nhật"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={item.updatedAt}
                                    />
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
                                    <div style={{ display: 'flex', marginRight: 50, gap: 25 }}>
                                        <FormControl sx={{ m: 0.2 }} variant="standard">
                                            <TextField
                                                id="demo-customized-textbox"
                                                label="Ít nhất"
                                                sx={{ width: '106%' }}
                                                value={editedItem.minStockLevel}
                                                onChange={(e) => handleEdit('minStockLevel', e.target.value)}
                                                name="minStockLevel"
                                            />
                                        </FormControl>
                                        <FormControl sx={{ m: 0.2 }} variant="standard">
                                            <TextField
                                                id="demo-customized-textbox"
                                                label="Nhiều nhất"
                                                sx={{ width: '106%' }}
                                                value={editedItem.maxStockLevel}
                                                onChange={(e) => handleEdit('maxStockLevel', e.target.value)}
                                                name="maxStockLevel"
                                            />
                                        </FormControl>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>

                    <div>
                        <Stack spacing={4} margin={2}>
                            <Grid container spacing={1} sx={{ gap: '20px' }}>
                                <Button variant="contained" color="primary" onClick={handleConfirm1}>
                                    Cập nhật
                                </Button>
                                {/* Thông báo confirm */}
                                <CustomDialog
                                    open={confirmOpen1}
                                    onClose={handleConfirmClose1}
                                    title="Thông báo!"
                                    content="Bạn có chắc muốn cập nhật không?"
                                    onConfirm={handleConfirmUpdate1}
                                    confirmText="Xác nhận"
                                />

                                <Button variant="contained" color="error" onClick={handleConfirm2}>
                                    Thay đổi trạng thái
                                </Button>
                                {/* Thông báo confirm */}
                                <CustomDialog
                                    open={confirmOpen2}
                                    onClose={handleConfirmClose1}
                                    title="Thông báo!"
                                    content="Bạn có chắc muốn cập nhật không?"
                                    onConfirm={handleConfirmUpdateStatus2}
                                    confirmText="Xác nhận"
                                />
                                <SnackbarSuccess
                                    open={open}
                                    handleClose={handleClose}
                                    message={successMessage}
                                    action={action}
                                    style={{ bottom: '16px', right: '16px' }}
                                />
                                <SnackbarError
                                    open={open1}
                                    handleClose={handleClose}
                                    message={errorMessage}
                                    action={action}
                                    style={{ bottom: '16px', right: '16px' }}
                                />
                            </Grid>
                        </Stack>
                    </div>
                </div>
            )}
            {selectedTab === 1 && (
                <div style={{ marginLeft: 50 }}>
                    <Stack spacing={4} margin={2}>
                        <div>
                            <Typography variant="h4">Bảng Giá Mua</Typography>
                            <Card>
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
                                                    <TableCell>Tên sản phẩm</TableCell>
                                                    <TableCell>Người thay đổi</TableCell>
                                                    <TableCell>Ngày thay đổi</TableCell>
                                                    <TableCell>Giá cũ</TableCell>
                                                    <TableCell>Giá mới</TableCell>
                                                </TableRow>
                                                {itemPriceData.slice(startIndex, endIndex).map((items) => {
                                                    return (
                                                        <TableRow key={items.id}>
                                                            <TableCell>{items.itemName}</TableCell>
                                                            <TableCell>{items.changedBy}</TableCell>
                                                            <TableCell>{items.changeDate}</TableCell>
                                                            <TableCell>{items.oldPrice}</TableCell>
                                                            <TableCell>{items.newPrice}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={itemPriceData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Card>
                        </div>
                    </Stack>
                    <SnackbarSuccess
                        open={open}
                        handleClose={handleClose}
                        message={successMessage}
                        action={action}
                        style={{ bottom: '16px', right: '16px' }}
                    />
                    <SnackbarError
                        open={open1}
                        handleClose={handleClose}
                        message={errorMessage}
                        action={action}
                        style={{ bottom: '16px', right: '16px' }}
                    />
                </div>
            )}
        </div>
    );
};

export default ItemDetailForm;
