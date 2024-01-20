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
    TablePagination,
} from '@mui/material';

import { getItemsByPriceHistory } from '~/data/mutation/items/item-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import { getAllSubCategory } from '~/data/mutation/subCategory/subCategory-mutation';
import { getAllBrands } from '~/data/mutation/brand/brands-mutation';
import { getAllOrigins } from '~/data/mutation/origins/origins-mutation';
import { getAllSuppliers } from '~/data/mutation/supplier/suppliers-mutation';
//icon
import { getItemsByMovementsHistory } from '~/data/mutation/items-movement/items-movement-mutation';
import AddItemsMovementForm from './AddItemsMovementForm';
import dayjs from 'dayjs';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import { getAllLocationByItem } from '~/data/mutation/location/location-mutation';

const ItemDetaiIventoryForm = ({ items, itemId, onClose, isOpen, updateItemInList, mode, updateItemStatusInList }) => {
    // const [expandedItem, setExpandedItem] = useState(itemId);
    const [itemsData, setItemsData] = useState(items);
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [tab1Data, setTab1Data] = useState({ categories_id: [] });

    const [editedItem, setEditedItem] = useState({});

    const [sub_category_id, setSub_category_id] = useState([]);
    const [brand_id, setBrand_id] = useState([]);
    const [supplier_id, setSupplier_id] = useState([]);
    const [origin_id, setOrigin_id] = useState([]);
    const [itemPriceData, setItemPriceData] = useState([]);
    // const [currentStatus, setCurrentStatus] = useState('');
    // const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);

    const [openAddItemMovementDialog, setOpenAddItemMovementDialog] = useState(false);

    const [itemMovementsData, setItemMovementsData] = useState([]);
    const [fromLocation_id, setFromLocation_id] = useState('');

    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');
    // phân trang
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    //========================================================

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
        getItemsByMovementsHistory(itemId)
            .then((respone) => {
                const data = respone.data;
                const sortedData = data.sort((a, b) => {
                    return dayjs(b.movedAt, 'DD/MM/YYYY HH:mm:ss').diff(dayjs(a.movedAt, 'DD/MM/YYYY HH:mm:ss'));
                });
                setItemMovementsData(sortedData);
            })
            .catch((error) => console.error('Error fetching Items:', error));
    }, []);

    useEffect(() => {
        getAllLocationByItem(itemId)
            .then((respone) => {
                const data = respone.data;
                const dataArray = Array.isArray(data) ? data : [data];
                setFromLocation_id(dataArray);
                console.log(dataArray);
            })
            .catch((error) => console.error('Error fetching categories:', error));
    }, []);

    const item = items.find((o) => o.id === itemId);
    console.log(item);
    console.log(fromLocation_id);

    if (!item) {
        return null;
    }

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
    // const handleOpenAddCategoryDialog = () => {
    //     setOpenAddCategoryDialog(true);
    // };

    // const handleCloseAddCategoryDialog = () => {
    //     setOpenAddCategoryDialog(false);
    // };

    const handleOpenAddItemMovementDialog = () => {
        setOpenAddItemMovementDialog(true);
    };

    const handleSaveLocation = (successMessage) => {
        setSnackbarSuccessMessage(
            successMessage === 'Create item movement successfully'
                ? 'Chuyển vị trí sản phẩm thành công.'
                : 'Thành công',
        );
        setSnackbarSuccessOpen(true);
    };

    const handleCloseAddItemMovementDialog = () => {
        setOpenAddItemMovementDialog(false);
    };

    const calculateTotalQuantity = (warehouseName) => {
        const totalQuantity = item.locations
            .filter((location) => location.warehouse.name === warehouseName)
            .reduce((sum, location) => sum + location.item_quantity, 0);

        return totalQuantity;
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
                {/* <Tab label="Lịch sử giá mua" /> */}
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
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Mã sản phẩm"
                                        sx={{ width: '64.5%', marginRight: 5.6, pointerEvents: 'none' }}
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
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Danh mục sản phẩm:
                                    </Typography>
                                    <Grid xs={8.5}>
                                        <Select
                                            InputProps={{ readOnly: true }}
                                            size="small"
                                            labelId="group-label"
                                            id="group-select"
                                            label="Danh mục"
                                            sx={{ width: '91%', fontSize: '16px', pointerEvents: 'none' }}
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
                                            InputProps={{ readOnly: true }}
                                            size="small"
                                            labelId="group-label"
                                            id="group-select"
                                            label="Chi nhánh"
                                            sx={{ width: '91%', fontSize: '16px', pointerEvents: 'none' }}
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
                                        Người tạo:
                                    </Typography>
                                    <TextField
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Người tạo"
                                        sx={{ width: '64.5%', marginRight: 5.6, pointerEvents: 'none' }}
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
                                            InputProps={{ readOnly: true }}
                                            size="small"
                                            labelId="group-label"
                                            id="group-select"
                                            label="Nguồn gốc"
                                            sx={{ width: '91%', fontSize: '16px', pointerEvents: 'none' }}
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
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Vị trí :
                                    </Typography>
                                    <div style={{ display: 'flex', width: '71%', alignItems: 'center' }}>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Vị trí"
                                            InputProps={{ readOnly: true }}
                                            multiline
                                            sx={{ width: '91%', marginRight: 1 }}
                                            value={
                                                item.locations
                                                    ? [
                                                          ...new Set(
                                                              item.locations.map(
                                                                  (location) =>
                                                                      `${
                                                                          location.warehouse.name
                                                                      } - Số lượng: ${calculateTotalQuantity(
                                                                          location.warehouse.name,
                                                                      )}`,
                                                              ),
                                                          ),
                                                      ].join('\n')
                                                    : ''
                                            }
                                            title={
                                                item.locations
                                                    ? [
                                                          ...new Set(
                                                              item.locations.map(
                                                                  (location) =>
                                                                      `${location.warehouse.address} - ${location.warehouse.name}`,
                                                              ),
                                                          ),
                                                      ].join('\n')
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
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Ngày tạo:
                                    </Typography>
                                    <TextField
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Ngày tạo"
                                        sx={{ width: '65%', marginRight: 5.5, pointerEvents: 'none' }}
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
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Trạng thái"
                                        sx={{ width: '70%', marginRight: 5, pointerEvents: 'none' }}
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
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Số lượng"
                                        sx={{ width: '70%', marginRight: 5, pointerEvents: 'none' }}
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
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Hàng có sẵn"
                                        sx={{ width: '70%', marginRight: 5, pointerEvents: 'none' }}
                                        value={item.available}
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
                                        Hàng bị hư:
                                    </Typography>
                                    <TextField
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Hàng bị hư"
                                        sx={{ width: '70%', marginRight: 5, pointerEvents: 'none' }}
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
                                        Hàng bị mất:
                                    </Typography>
                                    <TextField
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Hàng bị mất"
                                        sx={{ width: '70%', marginRight: 5, pointerEvents: 'none' }}
                                        value={item.lost}
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
                                        Giá mua:
                                    </Typography>
                                    <TextField
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Giá mua"
                                        sx={{ width: '70%', marginRight: 5, pointerEvents: 'none' }}
                                        value={item.purchasePrice ? item.purchasePrice.price : ''}
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
                                        Giá bán:
                                    </Typography>
                                    <TextField
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Giá bán"
                                        sx={{ width: '70%', marginRight: 5, pointerEvents: 'none' }}
                                        value={item.pricing ? item.pricing.price : ''}
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
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Ngày cập nhật"
                                        sx={{ width: '70%', marginRight: 5, pointerEvents: 'none' }}
                                        value={item.updatedAt}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>

                    <div>
                        {isSuccess && <SuccessAlerts message={successMessage} />}
                        {isError && <ErrorAlerts errorMessage={errorMessage} />}
                    </div>
                </div>
            )}
            {/* {selectedTab === 1 && (
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

                    <div>
                        {isSuccess && <SuccessAlerts message={successMessage} />}
                        {isError && <ErrorAlerts errorMessage={errorMessage} />}
                    </div>
                </div>
            )} */}
            {selectedTab === 1 && (
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
                                                {itemMovementsData.slice(startIndex, endIndex).map((items) => {
                                                    return (
                                                        <TableRow key={items.id}>
                                                            <TableCell>
                                                                {items.toLocation && items.toLocation.warehouse
                                                                    ? items.toLocation.warehouse.name
                                                                    : 'Không có'}
                                                            </TableCell>
                                                            <TableCell>{items.quantity}</TableCell>
                                                            <TableCell>
                                                                {items.fromLocation !== null ? (
                                                                    <div>
                                                                        {items.fromLocation.binNumber} -{' '}
                                                                        {items.fromLocation.shelfNumber}
                                                                    </div>
                                                                ) : (
                                                                    'Không có'
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {items.toLocation &&
                                                                items.toLocation.binNumber &&
                                                                items.toLocation.shelfNumber
                                                                    ? `${items.toLocation.binNumber} - ${items.toLocation.shelfNumber}`
                                                                    : 'Không có'}
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
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={itemMovementsData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
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
                                                {fromLocation_id.length > 0 ? (
                                                    fromLocation_id[0].locations.map((location) => (
                                                        <TableRow key={location.id}>
                                                            <TableCell>
                                                                <div>
                                                                    {location.shelfNumber} - {location.binNumber}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{location.warehouse.name}</TableCell>
                                                            <TableCell>{location.item_quantity}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={3}>Không có dữ liệu</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={item.locations.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                                <Stack spacing={4} margin={2}>
                                    <Grid container spacing={1} sx={{ gap: '20px' }}>
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={handleOpenAddItemMovementDialog}
                                        >
                                            Chuyển sản phẩm trong kho
                                        </Button>
                                        <AddItemsMovementForm
                                            open={openAddItemMovementDialog}
                                            onClose={handleCloseAddItemMovementDialog}
                                            onSave={handleSaveLocation}
                                            itemId={itemId}
                                            itemMovementsData={itemMovementsData}
                                            fromLocation_id={fromLocation_id}
                                        />
                                    </Grid>
                                </Stack>
                            </Card>
                        </div>
                    </Stack>

                    <div>
                        {isSuccess && <SuccessAlerts message={successMessage} />}
                        {isError && <ErrorAlerts errorMessage={errorMessage} />}
                        <SnackbarSuccess
                            open={snackbarSuccessOpen}
                            handleClose={() => {
                                setSnackbarSuccessOpen(false);
                                setSnackbarSuccessMessage('');
                            }}
                            message={snackbarSuccessMessage}
                            style={{ bottom: '16px', right: '16px' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetaiIventoryForm;
