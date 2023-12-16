import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    List,
    ListItem,
    Tab,
    Tabs,
    Stack,
    Grid,
    TextField,
    CardContent,
    Card,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Table,
    Select,
    MenuItem,
} from '@mui/material';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { editItem, editStatusItem, getItemsByPriceHistory } from '~/data/mutation/items/item-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import { getAllSubCategory } from '~/data/mutation/subCategory/subCategory-mutation';
import { getAllBrands } from '~/data/mutation/brand/brands-mutation';
import { getAllOrigins } from '~/data/mutation/origins/origins-mutation';
import { getAllSuppliers } from '~/data/mutation/supplier/suppliers-mutation';
//icons
import AddIcon from '@mui/icons-material/Add';
import { getItemsByMovementsHistory } from '~/data/mutation/items-movement/items-movement-mutation';
import AddItemsMovementForm from './AddItemsMovementForm';

const ItemDetaiIventoryForm = ({ items, itemId, onClose, isOpen, updateItemInList, mode, updateItemStatusInList }) => {
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

    const [openAddItemMovementDialog, setOpenAddItemMovementDialog] = useState(false);

    const [itemMovementsData, setItemMovementsData] = useState([]);

    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
        getItemsByMovementsHistory(itemId)
            .then((respone) => {
                const data = respone.data;
                setItemMovementsData(data);
            })
            .catch((error) => console.error('Error fetching Items:', error));
    }, []);

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

    const handleOpenAddItemMovementDialog = () => {
        setOpenAddItemMovementDialog(true);
    };
    const handleCloseAddItemMovementDialog = () => {
        setOpenAddItemMovementDialog(false);
    };

    console.log(itemMovementsData);

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
                <Tab label="Lịch sử vận chuyển" />
                <Tab label="Vị trí sản phẩm" />
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
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Mã sản phẩm:
                                    </Typography>
                                    <TextField
                                        disabled
                                        size="small"
                                        variant="outlined"
                                        label="Mã sản phẩm"
                                        sx={{ width: '64.5%', marginRight: 5.6 }}
                                        value={item.code}
                                        InputProps={{ style: { color: 'inherit' } }}
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
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Danh mục sản phẩm:
                                    </Typography>
                                    <Grid xs={8.5}>
                                        <Select
                                            disabled
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
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Thương hiệu:
                                    </Typography>
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
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Nhà cung cấp:
                                    </Typography>
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
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Người tạo:
                                    </Typography>
                                    <TextField
                                        disabled
                                        size="small"
                                        variant="outlined"
                                        label="Người tạo"
                                        sx={{ width: '64.5%', marginRight: 5.6 }}
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
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Nguồn gốc:
                                    </Typography>
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
                                {/* <Grid
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
                                            value={item.locations
                                                .map(
                                                    (location) =>
                                                        `${location.binNumber} - ${location.shelfNumber} - ${location.warehouse.name}`,
                                                )
                                                .join(',\n')}
                                        />
                                    </div>
                                </Grid> */}
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Ngày tạo:
                                    </Typography>
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
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Trạng thái:
                                    </Typography>
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
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Số lượng:
                                    </Typography>
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
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Hàng có sẵn:
                                    </Typography>
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
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Đã bán:
                                    </Typography>
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
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Hàng trả lại:
                                    </Typography>
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
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Ngày cập nhật:
                                    </Typography>
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
                                {/* <Button variant="contained" color="primary" onClick={updateItems}>
                                    Cập nhật
                                </Button>
                                <Button variant="contained" color="error" onClick={updateItemStatus}>
                                    Thay đổi trạng thái
                                </Button> */}
                                <Button variant="contained" color="warning" onClick={handleOpenAddItemMovementDialog}>
                                    Chuyển sản phẩm trong kho
                                </Button>
                                <AddItemsMovementForm
                                    open={openAddItemMovementDialog}
                                    onClose={handleCloseAddItemMovementDialog}
                                    itemId={itemId}
                                    itemMovementsData={itemMovementsData}
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
            {selectedTab === 2 && (
                <div style={{ marginLeft: 50 }}>
                    <Stack spacing={4} margin={2}>
                        <div>
                            <Typography variant="h4">Quá Trình Vận Chuyển</Typography>
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
                                                    <TableCell>Vị trí kho</TableCell>
                                                    <TableCell>Số lượng</TableCell>
                                                    <TableCell>Từ vị trí</TableCell>
                                                    <TableCell>Đến vị trí</TableCell>
                                                    <TableCell>Ghi chú</TableCell>
                                                    <TableCell>Vận chuyển ngày</TableCell>
                                                </TableRow>
                                                {itemMovementsData.map((items) => {
                                                    return (
                                                        <TableRow key={items.id}>
                                                            <TableCell>{items.toLocation.warehouse.name}</TableCell>
                                                            <TableCell>{items.quantity}</TableCell>
                                                            <TableCell>
                                                                {items.fromLocation !== null ? (
                                                                    <div>
                                                                        {items.fromLocation.binNumber} -{' '}
                                                                        {items.fromLocation.shelfNumber}
                                                                    </div>
                                                                ) : (
                                                                    'Chưa có'
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {items.toLocation.binNumber} -{' '}
                                                                {items.toLocation.shelfNumber}
                                                            </TableCell>
                                                            <TableCell>{items.notes}</TableCell>
                                                            <TableCell>{items.movedAt}</TableCell>
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
            {selectedTab === 3 && (
                <div style={{ marginLeft: 50 }}>
                    <Stack spacing={4} margin={2}>
                        <div>
                            <Typography variant="h4">Ví trí sản phẩm trong kho</Typography>
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
                                                    <TableCell>Vị trí trong kho</TableCell>
                                                    <TableCell>Kho chứa</TableCell>
                                                    <TableCell>Số lượng</TableCell>
                                                </TableRow>
                                                {item.locations.map((items) => {
                                                    return (
                                                        <TableRow key={items.id}>
                                                            <TableCell>
                                                                <div>
                                                                    {items.shelfNumber} - {items.binNumber}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{items.warehouse.name}</TableCell>
                                                            <TableCell>{items.item_quantity}</TableCell>
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

export default ItemDetaiIventoryForm;
