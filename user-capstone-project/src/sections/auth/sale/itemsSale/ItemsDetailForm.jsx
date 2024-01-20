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
    FormControl,
    TablePagination,
} from '@mui/material';

// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { getItemsByPriceHistory, getItemsByPricingHistory } from '~/data/mutation/items/item-mutation';

import { getAllSubCategory } from '~/data/mutation/subCategory/subCategory-mutation';
import { getAllBrands } from '~/data/mutation/brand/brands-mutation';
import { getAllOrigins } from '~/data/mutation/origins/origins-mutation';
import { getAllSuppliers } from '~/data/mutation/supplier/suppliers-mutation';
//icons
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';
import dayjs from 'dayjs';

const ItemsDetailForm = ({ items, itemId, onClose, isOpen, updateItemInList, mode, updateItemStatusInList }) => {
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);

    const [editedItem, setEditedItem] = useState({});

    const [sub_category_id, setSub_category_id] = useState([]);
    const [brand_id, setBrand_id] = useState([]);
    const [supplier_id, setSupplier_id] = useState([]);
    const [origin_id, setOrigin_id] = useState([]);
    const [itemPriceData, setItemPriceData] = useState([]);
    const [itemPricingData, setItemPricingData] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    //thông báo
    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);

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

    //========================== Hàm notification của trang ==================================

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
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
                setItemPriceData(data);
            })
            .catch((error) => console.error('Error fetching Items:', error));
        getItemsByPricingHistory(itemId)
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => {
                        return dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss').diff(
                            dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'),
                        );
                    });
                    setItemPricingData(sortedData);
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


    const calculateTotalQuantity = (warehouseName) => {
        const totalQuantity = item.locations
            .filter((location) => location.warehouse.name === warehouseName)
            .reduce((sum, location) => sum + location.item_quantity, 0);

        return totalQuantity;
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
            <Tabs
                value={selectedTab}
                onChange={(event, newValue) => setSelectedTab(newValue)}
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab label="Thông tin" />
                <Tab label="Lịch sử giá mua" />
                <Tab label="Lịch sử giá bán" />
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
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Mã sản phẩm"
                                        sx={{ width: '65%', marginRight: 5, pointerEvents: 'none' }}
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
                                            InputProps={{ readOnly: true }}
                                            size="small"
                                            labelId="group-label"
                                            id="group-select"
                                            label="Danh mục"
                                            sx={{
                                                width: '92%',
                                                fontSize: '16px',
                                                pointerEvents: 'none',
                                                marginLeft: 0.2,
                                            }}
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
                                            InputProps={{ readOnly: true }}
                                            size="small"
                                            labelId="group-label"
                                            id="group-select"
                                            label="Chi nhánh"
                                            sx={{
                                                width: '92%',
                                                fontSize: '16px',
                                                pointerEvents: 'none',
                                                marginLeft: 0.2,
                                            }}
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

                                {/* <Grid
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
                                            sx={{ width: '91%', fontSize: '16px' }}
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
                                </Grid> */}

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
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Người tạo"
                                        sx={{ width: '65%', marginRight: 5, pointerEvents: 'none' }}
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
                                            InputProps={{ readOnly: true }}
                                            size="small"
                                            labelId="group-label"
                                            id="group-select"
                                            label="Nguồn gốc"
                                            sx={{
                                                width: '92%',
                                                fontSize: '16px',
                                                pointerEvents: 'none',
                                                marginLeft: 0.2,
                                            }}
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
                                    sx={{ marginBottom: 4, gap: 5, marginLeft: 0.1 }}
                                >
                                    <Typography variant="body1">Vị trí :</Typography>
                                    <div style={{ display: 'flex', width: '72%', alignItems: 'center' }}>
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
                                                                    `${location.warehouse.name
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
                                    <Typography variant="body1">Ngày tạo:</Typography>
                                    <TextField
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Ngày tạo"
                                        sx={{ width: '65%', marginRight: 5, pointerEvents: 'none' }}
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
                                    <Typography variant="body1">Số lượng:</Typography>
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
                                    <Typography variant="body1">Giá mua:</Typography>
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
                                    <Typography variant="body1">Giá bán:</Typography>
                                    <TextField
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Giá bán"
                                        sx={{ width: '70%', marginRight: 5, pointerEvents: 'none' }}
                                        value={item.pricing ? item.pricing.price : ''}
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
                                    <Typography variant="body1">Hàng trả lại:</Typography>
                                    <TextField
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Hàng trả lại"
                                        sx={{ width: '70%', marginRight: 5, pointerEvents: 'none' }}
                                        value={item.defective}
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
                                    <Typography variant="body1">Ngày cập nhật:</Typography>
                                    <TextField
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Ngày cập nhật"
                                        sx={{ width: '70%', marginRight: 5, pointerEvents: 'none' }}
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
                                    <Typography variant="subtitle1" sx={{ fontSize: '16px' }}>
                                        Định mức tồn:{' '}
                                    </Typography>
                                    <div style={{ display: 'flex', marginRight: 50, gap: 38 }}>
                                        <FormControl sx={{ m: 0.2 }} variant="standard">
                                            <TextField
                                                InputProps={{ readOnly: true }}
                                                id="demo-customized-textbox"
                                                label="Ít nhất"
                                                sx={{ width: '106%', pointerEvents: 'none' }}
                                                value={editedItem.minStockLevel}
                                                onChange={(e) => handleEdit('minStockLevel', e.target.value)}
                                                name="minStockLevel"
                                            />
                                        </FormControl>
                                        <FormControl sx={{ m: 0.2 }} variant="standard">
                                            <TextField
                                                InputProps={{ readOnly: true }}
                                                id="demo-customized-textbox"
                                                label="Nhiều nhất"
                                                sx={{ width: '106%', pointerEvents: 'none' }}
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
            {selectedTab === 2 && (
                <div style={{ marginLeft: 50 }}>
                    <Stack spacing={4} margin={2}>
                        <div>
                            <Typography variant="h4">Bảng Giá Bán</Typography>
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
                                                {itemPricingData.slice(startIndex, endIndex).map((items) => {
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
                                    labelRowsPerPage="Số lượng giá bán mỗi trang:"
                                />
                            </Card>
                        </div>
                    </Stack>
                </div>
            )}
        </div>
    );
};

export default ItemsDetailForm;
