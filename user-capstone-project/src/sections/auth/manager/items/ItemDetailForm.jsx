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
import AddLocationsForm from '../../inventory_staff/item/AddLocationsForm';

const ItemDetailForm = ({ items, itemId, onClose, isOpen, updateItemInList, mode, updateItemStatusInList }) => {
    const [expandedItem, setExpandedItem] = useState(itemId);
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [tab1Data, setTab1Data] = useState({ categories_id: [] });

    const [editedItem, setEditedItem] = useState({});

    const [sub_category_id, setSub_category_id] = useState([]);
    const [brand_id, setBrand_id] = useState([]);
    const [supplier_id, setSupplier_id] = useState([]);
    const [origin_id, setOrigin_id] = useState([]);
    const [itemPriceData, setItemPriceData] = useState([]);
    const [currentStatus, setCurrentStatus] = useState('');
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);

    //thông báo
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleConfirmClose = () => {
        setConfirmOpen(false);
    };

    const handleConfirmUpdate = () => {
        setConfirmOpen(false);
        updateItems();
    };
    const handleConfirmUpdateStatus = () => {
        setConfirmOpen(false);
        updateItemStatus();
    };

    const handleConfirm = () => {
        setConfirmOpen(true);
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
                setItemPriceData(data);
            })
            .catch((error) => console.error('Error fetching Items:', error));
    }, []);
    console.log(sub_category_id);
    const item = items.find((o) => o.id === itemId);
    console.log(item);

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
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.message);
            }

            // Sử dụng hàm để cập nhật trạng thái trong danh sách categories trong CategoryPage
            updateItemStatusInList(itemId, newStatus);
            setCurrentStatus(newStatus);

            console.log('Item status updated:', response);
        } catch (error) {
            console.error('Error updating category status:', error);
            setIsError(true);
            setIsSuccess(false);
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
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.message);
            }

            updateItemInList(response.data);
            console.log('Item updated:', response);
        } catch (error) {
            console.error('An error occurred while updating the item:', error);
            setIsError(true);
            setIsSuccess(false);
            setErrorMessage(error.response.data.message);
            if (error.response) {
                console.log('Error response:', error.response);
            }
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
                                            sx={{ width: '81%', marginRight: 1 }}
                                            value={item.locations
                                                ? item.locations
                                                    .map(
                                                        (location) =>
                                                            `${location.binNumber} - ${location.shelfNumber} - ${location.warehouse.name}`,
                                                    )
                                                    .join(',\n')
                                                : ''}
                                        />
                                        <Button
                                            variant="outlined"
                                            sx={{ padding: 0.8, minWidth: 0, maxHeight: 40 }}
                                            onClick={handleOpenAddCategoryDialog}
                                        >
                                            <AddIcon />
                                        </Button>
                                        <AddLocationsForm
                                            open={openAddCategoryDialog}
                                            onClose={handleCloseAddCategoryDialog}
                                            itemId={itemId}
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
                            </Grid>
                        </Grid>
                    </Stack>

                    <div>
                        {isSuccess && <SuccessAlerts message={successMessage} />}
                        {isError && <ErrorAlerts errorMessage={errorMessage} />}
                        <Stack spacing={4} margin={2}>
                            <Grid container spacing={1} sx={{ gap: '20px' }}>
                                <Button variant="contained" color="primary" onClick={updateItems}>
                                    Cập nhật
                                </Button>
                                {/* Thông báo confirm */}
                                <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                                    <DialogTitle>Thông báo!</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>Bạn có chắc muốn cập nhật không?</DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleConfirmClose} color="primary">
                                            Hủy
                                        </Button>
                                        <Button onClick={handleConfirmUpdateStatus} color="primary" autoFocus>
                                            Xác nhận
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Button variant="contained" color="error" onClick={updateItemStatus}>
                                    Thay đổi trạng thái
                                </Button>
                                {/* Thông báo confirm */}
                                <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                                    <DialogTitle>Thông báo!</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>Bạn có chắc muốn cập nhật không?</DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleConfirmClose} color="primary">
                                            Hủy
                                        </Button>
                                        <Button onClick={handleConfirmUpdateStatus} color="primary" autoFocus>
                                            Xác nhận
                                        </Button>
                                    </DialogActions>
                                </Dialog>
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
                                                {itemPriceData.map((items) => {
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
                            </Card>
                        </div>
                    </Stack>

                    <div>
                        {isSuccess && <SuccessAlerts message={successMessage} />}
                        {isError && <ErrorAlerts errorMessage={errorMessage} />}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetailForm;
