import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Box,
    Grid,
    Table,
    Button,
    DialogActions,
    DialogContent,
    Stack,
    TextField,
    Typography,
    TableContainer,
    FormControl,
    Paper,
    List,
    ListItem,
    ListItemText,
    Select,
    MenuItem,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
// sections
import { UserListHead } from '~/sections/@dashboard/user';
// mock
import USERLIST from '~/_mock/user';
import Scrollbar from '~/components/scrollbar/Scrollbar';
// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useNavigate } from 'react-router-dom';
import CreateGoodReceiptListHead from '~/sections/@dashboard/manager/transaction/createGoodReceipt/CreateGoodReceiptToolbar';
import { CreateGoodReceiptToolbar } from '~/sections/@dashboard/manager/transaction/createGoodReceipt';
import { createImportReceipt } from '~/data/mutation/importReceipt/ImportReceipt-mutation';
import { useEffect } from 'react';
import { getAllItem } from '~/data/mutation/items/item-mutation';
import { getAllUnit } from '~/data/mutation/unit/unit-mutation';

function CreateGoodReceipt() {
    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [selected, setSelected] = useState([]);
    // state form create===============================================
    const [warehouseId, setWarehouseId] = useState(null);
    const [inventoryStaffId, setInventoryStaffId] = useState(null);
    const [descriptionReceipt, setDescriptionReceipt] = useState('');
    const [itemId, setItemId] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [unitPrice, setUnitPrice] = useState([]);
    const [unitId, setUnitId] = useState([]);
    const [descriptionItems, setDescriptionItems] = useState('');
    // ===============================================
    const [itemsData, setItemsData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedUnitId, setSelectedUnitId] = useState('');
    const navigate = useNavigate();

    const TABLE_HEAD = [
        { id: 'id', label: 'Mã sản phẩm', alignRight: false },
        { id: 'name', label: 'Tên sản phẩm', alignRight: false },
        { id: 'quality', label: 'Số lượng', alignRight: false },
        { id: 'pricing', label: 'Giá bán', alignRight: false },
        { id: 'unit', label: 'Đơn vị', alignRight: false },
        { id: '' },
    ];

    const handleSearch = (selectedWarehouseId, selectedInventoryStaffId) => {
        setWarehouseId(selectedWarehouseId);
        setInventoryStaffId(selectedInventoryStaffId);
        console.log('Warehouse ID:', selectedWarehouseId);
        console.log('Inventory Staff ID:', selectedInventoryStaffId);
    };

    const handleUnitChange = (newUnitId) => {
        setSelectedUnitId(newUnitId);
        setUnitId((prevUnitId) => [...prevUnitId, newUnitId]);
    };
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = USERLIST.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleCreateImportReceipt = async () => {
        const recieptParams = {
            warehouseId,
            inventoryStaffId,
            description: descriptionReceipt,
            details: [
                {
                    itemId,
                    quantity: quantity,
                    unitPrice: unitPrice,
                    unitId: selectedUnitId,
                    description: descriptionItems,
                },
            ],
        };
        try {
            const response = await createImportReceipt(recieptParams);
            if (response.status === '200 OK') {

            }
        } catch (error) {
            console.error('Error creating product:', error.response);

        }
    };

    const handleNavigate = () => {
        navigate("/dashboard/goods-receipt");
    };
    useEffect(() => {
        getAllItem()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    setItemsData(data);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
        getAllUnit()
            .then((respone) => {
                const data = respone.data;
                setUnitId(data);
            })
            .catch((error) => console.error('Error fetching units:', error));

    }, []);

    const handleAddToCart = (selectedProduct) => {
        const updatedSelectedItems = [...selectedItems, {
            ...selectedProduct,
            quantity: 0,
            price: 0,
        }];


        setSelectedItems(updatedSelectedItems);
    };
    const handleRemoveFromCart = (selectedItem) => {

        const updatedItems = selectedItems.filter(item => item.id !== selectedItem.id);
        setSelectedItems(updatedItems);
    };
    console.log(unitId, 'aaaa');
    return (
        <>
            <Helmet>
                <title> Nhập Kho </title>
            </Helmet>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Stack direction="row" alignItems="center" mb={5}>
                            <Button onClick={handleNavigate}>
                                <ArrowBackIcon fontSize="large" color="action" />
                            </Button>
                            <Typography variant="h4" gutterBottom>
                                Nhập kho
                            </Typography>
                        </Stack>
                        <CreateGoodReceiptToolbar onSearch={handleSearch} />
                        <Scrollbar>
                            <TableContainer sx={{ minWidth: 800 }}>
                                <Table>
                                    <UserListHead
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        rowCount={USERLIST.length}
                                        numSelected={selected.length}
                                        onRequestSort={handleRequestSort}
                                        onSelectAllClick={handleSelectAllClick}
                                    />
                                </Table>
                            </TableContainer>
                        </Scrollbar>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            {/* Danh sách sản phẩm đã thêm bên trái */}
                            <Paper>
                                <List>
                                    {selectedItems.map((selectedItem) => (
                                        <ListItem key={selectedItem.id}>
                                            <img src={selectedItem.avatar} alt={selectedItem.name} width="48" height="48" />
                                            <ListItemText primary={selectedItem.id} onChange={(e) => setItemId(e.target.value)} />
                                            <ListItemText primary={selectedItem.subCategory.name} />
                                            <ListItemText>
                                                <TextField
                                                    type="number"
                                                    label="Số lượng"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                />
                                            </ListItemText>
                                            <ListItemText>
                                                <TextField
                                                    type="number"
                                                    label="Giá"
                                                    value={unitPrice}
                                                    onChange={(e) => setUnitPrice(e.target.value)}
                                                />
                                            </ListItemText>
                                            <ListItemText>
                                                <Select
                                                    label="Đơn vị"
                                                    value={selectedUnitId}  // Sử dụng selectedUnitId thay vì unitId
                                                    onChange={(e) => handleUnitChange(e.target.value)}
                                                >
                                                    {unitId.map((unit) => (
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
                                            </ListItemText>
                                            <Button onClick={() => handleRemoveFromCart(selectedItem)}>Xóa</Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>

                        {/* Danh sách sản phẩm bên phải */}
                        <Grid item xs={6}>
                            <div style={{ textAlign: 'center' }}>
                                <DialogContent
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        minHeight: '720px',
                                    }}
                                >

                                    <Stack spacing={2} margin={2}>
                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                            <Grid xs={6}>
                                                <TextField variant="standard" label="Lê Sơn Tùng" />
                                            </Grid>
                                            <Grid xs={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker variant="standard" label="Today's Date" />
                                                </LocalizationProvider>
                                            </Grid>
                                        </Grid>
                                        <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                                    Mã phiếu nhập:{' '}
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    variant="standard"
                                                    label="Mã phiếu tự động"
                                                    sx={{ width: '40%' }}
                                                />
                                            </Grid>
                                        </FormControl>
                                        <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                                    Mã đặt hàng nhập:{' '}
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    variant="standard"
                                                    label="Tên hàng"
                                                    sx={{ width: '40%' }}
                                                />
                                            </Grid>
                                        </FormControl>
                                        <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                                    Trạng thái:{' '}
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    variant="standard"
                                                    label="Phiếu tạm"
                                                    sx={{ width: '40%' }}
                                                />
                                            </Grid>
                                        </FormControl>
                                        <TextField
                                            id="outlined-multiline-static"
                                            multiline
                                            // rows={4}
                                            label="Ghi chú"
                                            sx={{ width: '100%', border: 'none' }}
                                            variant="standard"
                                            value={descriptionReceipt}
                                            onChange={(e) => setDescriptionReceipt(e.target.value)}
                                        />
                                    </Stack>
                                    <List>
                                        {itemsData.map((items, index) => (
                                            <ListItem
                                                key={items.id}
                                                style={{
                                                    display: 'inline-block',
                                                    margin: '8px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '8px',
                                                    boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)',
                                                    width: '150px', // Điều chỉnh chiều rộng của mỗi sản phẩm
                                                }}
                                                onClick={() => handleAddToCart(items)}
                                            >
                                                <img src={items.avatar} alt={items.name} width="100%" />
                                                <div style={{ padding: '8px' }}>
                                                    <Typography variant="body1">{items.subCategory.name}</Typography>
                                                    <Typography variant="body2">{`${items.pricing} VND`}</Typography>

                                                </div>
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Button color="primary" variant="contained" onClick={handleCreateImportReceipt}>
                                        Lưu
                                    </Button>
                                </DialogContent>

                            </div>

                        </Grid>
                    </Grid>
                </Grid>
            </Box >
        </>
    );
}

export default CreateGoodReceipt;
