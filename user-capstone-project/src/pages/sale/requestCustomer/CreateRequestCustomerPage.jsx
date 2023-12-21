import React, { useEffect, useState } from 'react';
import {
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    Button,
    Card,
    Typography,
    MenuItem,
    FormControl,
    Input,
    Select,
    Stack,
    Box,
    TableContainer,
    Table,
    TextField,
    DialogContent,
    InputLabel,
} from '@mui/material';

import USERLIST from '~/_mock/user';
import { Search, FilterList, Sort } from '@mui/icons-material';
//compornent
import { Helmet } from 'react-helmet-async';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Scrollbar from '~/components/scrollbar/Scrollbar';

import { useNavigate } from 'react-router-dom';
//api
import { UserListHead } from '~/sections/@dashboard/user';
import { getAllItem } from '~/data/mutation/items/item-mutation';
import { getAllWarehouse, getInventoryStaffByWarehouseId } from '~/data/mutation/warehouse/warehouse-mutation';
import { createRequestCustomer } from '~/data/mutation/customerRequest/CustomerRequest-mutation';
import { getAllCustomer } from '~/data/mutation/customer/customer-mutation';
import { CreateGoodReceiptListHead } from '~/sections/@dashboard/manager/transaction/createGoodReceipt';

const CreateRequestCustomerPage = () => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [selected, setSelected] = useState([]);

    const [itemId, setItemId] = useState([]);
    const [quantity, setQuantity] = useState(null);
    const [note, setNote] = useState(null);
    const [customerData, setCustomerData] = useState([]);
    const [itemsData, setItemsData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    // warehouse
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedInventoryStaff, setSelectedInventoryStaff] = useState(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [warehouseList, setWarehouseList] = useState([]);
    const [inventoryStaffList, setInventoryStaffList] = useState([]);

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [recieptParams, setRecieptParams] = useState({
        customerId: null,
        warehouseId: null,
        inventoryStaff: null,
        note: '',
        details: [],
    });
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('all'); // Bảng giá chung
    const [tabs, setTabs] = useState([
        { label: 'Hóa đơn 1', products: [] }, // Mảng sản phẩm cho hóa đơn 1
    ]);
    const [selectedTab, setSelectedTab] = useState(0);

    const TABLE_HEAD = [
        { id: 'name', label: 'Tên sản phẩm', alignRight: false },
        { id: 'quality', label: 'Số lượng', alignRight: false },
        { id: '' },
    ];

    const handleNavigate = () => {
        navigate('/sale-staff/request-customer');
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

    const calculateTotalPrice = () => {
        let total = 0;
        selectedProducts.forEach((product) => {
            total += product.price;
        });

        return total;
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleAddToCart = (selectedProduct) => {
        const updatedSelectedItems = [
            ...selectedItems,
            {
                ...selectedProduct,
                itemId: selectedProduct.id,
                quantity: 0,
            },
        ];

        const newRecieptParams = {
            customerId: selectedCustomerId.customerId,
            warehouseId: selectedWarehouse.id,
            inventoryStaff: selectedInventoryStaff,
            note,
            details: [
                ...recieptParams.details,
                {
                    itemId: selectedProduct.id,
                    quantity: 0,
                },
            ],
        };

        setRecieptParams(newRecieptParams);
        setSelectedItems(updatedSelectedItems);
    };

    const handleQuantityChange = (index, value) => {
        const updatedItems = [...selectedItems];
        updatedItems[index].quantity = value;
        setSelectedItems(updatedItems);

        // Update recieptParams
        const updatedRecieptParams = {
            ...recieptParams,
            details: updatedItems.map((item) => ({
                itemId: item.itemId,
                quantity: item.quantity,
            })),
        };

        setRecieptParams(updatedRecieptParams);
    };
    const handleRemoveFromCart = (index) => {
        const updatedItems = [...selectedItems];
        updatedItems.splice(index, 1);
        setSelectedItems(updatedItems);

        const updatedRecieptParams = {
            ...recieptParams,
            details: updatedItems.map((item) => ({
                itemId: item.itemId,
                quantity: item.quantity,
            })),
        };

        setRecieptParams(updatedRecieptParams);
    };
    const handleRemoveTab = (index) => {
        const newTabs = [...tabs];
        newTabs.splice(index, 1);
        setTabs(newTabs);
        if (selectedTab >= newTabs.length) {
            setSelectedTab(newTabs.length - 1);
        }
    };

    useEffect(() => {
        getAllItem().then((respone) => {
            const data = respone.data;
            if (Array.isArray(data)) {
                setItemsData(data);
            } else {
                console.error('API response is not an array:', data);
            }
        });
        getAllCustomer()
            .then((respone) => {
                const data = respone.data;
                setCustomerData(data);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);
    console.log(customerData);
    useEffect(() => {
        const fetchWarehouseList = async () => {
            try {
                const warehouses = await getAllWarehouse();
                setWarehouseList(warehouses.data);
            } catch (error) {
                console.error('Error fetching warehouse list:', error);
            }
        };

        fetchWarehouseList();
    }, []);

    useEffect(() => {
        const fetchInventoryStaff = async () => {
            try {
                if (selectedWarehouse) {
                    const inventoryStaffList = await getInventoryStaffByWarehouseId(selectedWarehouse.id);
                    setInventoryStaffList(inventoryStaffList.data);
                }
            } catch (error) {
                console.error('Error fetching inventory staff:', error);
            }
        };

        fetchInventoryStaff();
    }, [selectedWarehouse, selectedInventoryStaff]);

    const handleCreateImportReceipt = async () => {
        try {
            const response = await createRequestCustomer(recieptParams);
            if (response.status === '201 CREATED') {
                // Xử lý khi tạo phiếu nhập thành công
            }
            navigate('/sale-staff/request-customer', {
                state: { successMessage: response.message },
            });
        } catch (error) {
            console.error('Error creating product:', error.response);
        }
    };

    return (
        <>
            <Helmet>
                <title> Bán hàng | Minimal UI </title>
            </Helmet>
            <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" alignItems="center" mb={5}>
                    <Button onClick={handleNavigate}>
                        <ArrowBackIcon fontSize="large" color="action" />
                    </Button>
                    <Typography variant="h4" gutterBottom>
                        Tạo yêu cầu khách hàng
                    </Typography>
                </Stack>

                <Card>
                    
                    <Stack spacing={4} margin={2} style={{ minHeight: '70vh', }}>
                        <Grid container spacing={2}>

                            {/* Danh sách sản phẩm đã thêm bên trái */}
                            <Grid item xs={6}>
                                <Paper>
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

                                            {/* Danh sách sản phẩm đã thêm bên trái */}
                                            <Paper>
                                                <List>
                                                    {selectedItems.map((selectedItem, index) => (
                                                        <ListItem key={`${selectedItem.id}-${index}`}>
                                                            {/* <img
                                                    src={selectedItem.avatar}
                                                    alt={selectedItem.name}
                                                    width="48"
                                                    height="48"
                                                /> */}
                                                            <ListItemText
                                                                // primary={selectedItem.id}
                                                                onChange={(e) => setItemId(e.target.value)}
                                                            />
                                                            <ListItemText primary={selectedItem.subCategory.name} />
                                                            <ListItemText>
                                                                <TextField
                                                                    type="number"
                                                                    label="Số lượng"
                                                                    sx={{ width: '50%' }}
                                                                    value={selectedItem.quantity}
                                                                    onChange={(e) =>
                                                                        handleQuantityChange(
                                                                            selectedItems.indexOf(selectedItem),
                                                                            e.target.value,
                                                                        )
                                                                    }
                                                                />
                                                            </ListItemText>
                                                            <Button onClick={() => handleRemoveFromCart(index)}>Xóa</Button>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Paper>
                                        </TableContainer>
                                    </Scrollbar>
                                    {/* Thêm phần hiển thị thông tin khách hàng và tổng tiền */}

                                    <FormControl sx={{ margin: 1 }}
                                        style={{
                                            position: 'absolute',
                                            bottom: 35,
                                            left: 25,
                                            borderColor: 'black',
                                            borderWidth: 1,
                                            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                            borderRadius: 5,
                                            minWidth: 750
                                        }}>
                                        <Typography variant="h6">Thông tin đơn hàng</Typography>
                                        <Typography variant="body1">Tên khách hàng:</Typography>
                                        <Typography variant="body1">Địa chỉ:</Typography>
                                        <Typography variant="h5">Tổng tiền </Typography>
                                        <Typography variant="body1">{calculateTotalPrice()} VND</Typography>
                                    </FormControl>
                                </Paper>
                            </Grid>

                            {/* Danh sách sản phẩm bên phải */}
                            <Grid item xs={6} style={{ padding: '20px' }}>
                                <Paper style={{ border: '1px solid #ccc', borderRadius: '8px', boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)', minHeight: '70vh' }}>

                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={4}>
                                            {/* <FormControl style={{ border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f0f0f0', margin: '10px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ padding: '0 8px' }}>
                                                        <Search />
                                                    </span>
                                                    <Input
                                                        placeholder="Tìm kiếm khách hàng..."
                                                        value={searchText}
                                                        onChange={handleSearchChange}
                                                        disableUnderline
                                                        fullWidth
                                                    />
                                                </div>
                                            </FormControl> */}
                                            <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                                <InputLabel id="warehouse-label">Chọn khách hàng...</InputLabel>
                                                <Select
                                                    labelId="warehouse-label"
                                                    id="warehouse"
                                                    value={selectedCustomerId ? selectedCustomerId.customerId : ''}
                                                    onChange={(e) =>
                                                        setSelectedCustomerId(
                                                            customerData.find(
                                                                (customer) => customer.customerId === e.target.value,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    {customerData.map((customers) => (
                                                        <MenuItem
                                                            key={customers.customerId}
                                                            value={customers.customerId}
                                                        >
                                                            {customers.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4}>
                                            {/* <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                                <Select
                                                    value={selectedPrice}
                                                    onChange={handlePriceChange}
                                                >
                                                    <MenuItem value="all">Tất cả bảng giá</MenuItem>
                                                </Select>
                                            </FormControl> */}
                                            {/* Toolbar */}

                                            <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                                <InputLabel id="warehouse-label">Chọn kho hàng...</InputLabel>
                                                <Select
                                                    labelId="warehouse-label"
                                                    id="warehouse"
                                                    value={selectedWarehouse ? selectedWarehouse.id : ''}
                                                    onChange={(e) =>
                                                        setSelectedWarehouse(
                                                            warehouseList.find(
                                                                (warehouse) => warehouse.id === e.target.value,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    {warehouseList.map((warehouse) => (
                                                        <MenuItem key={warehouse.id} value={warehouse.id}>
                                                            {warehouse.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4}>
                                            {selectedWarehouse && (
                                                <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                                    <InputLabel id="inventory-staff-label">Chọn Nhân Viên</InputLabel>
                                                    <Select
                                                        labelId="inventory-staff-label"
                                                        id="inventory-staff"
                                                        value={selectedInventoryStaff}
                                                        onChange={(e) => setSelectedInventoryStaff(e.target.value)}
                                                    >
                                                        {inventoryStaffList.map((staff) => (
                                                            <MenuItem key={staff.id} value={staff.id}>
                                                                {staff.lastName} {staff.middleName} {staff.firstName}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            )}
                                        </Grid>
                                    </Grid>

                                    <div style={{ textAlign: 'center' }}>
                                        <DialogContent>
                                            <List>
                                                {selectedWarehouse ? (
                                                    itemsData.map((items, index) => (
                                                        <ListItem
                                                            key={items.id}
                                                            style={{
                                                                display: 'inline-block',
                                                                margin: '8px',
                                                                border: '1px solid #ccc',
                                                                borderRadius: '8px',
                                                                boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)',
                                                                width: '150px',
                                                            }}
                                                            onClick={() => handleAddToCart(items)}
                                                        >
                                                            <img src={items.avatar} alt={items.name} width="100%" />
                                                            <div style={{ padding: '8px' }}>
                                                                <Typography variant="body1">
                                                                    {items.subCategory.name}
                                                                </Typography>
                                                            </div>
                                                        </ListItem>
                                                    ))
                                                ) : (
                                                    <Typography variant="body2">
                                                        Chọn kho hàng trước khi thêm sản phẩm.
                                                    </Typography>
                                                )}
                                            </List>
                                            {/* Nút chuyển trang 1/2 (nếu cần) và nút thanh toán */}
                                            <div style={{ position: 'absolute', bottom: 50, right: 35 }}>
                                                <Button>Trang</Button>
                                                <Button
                                                    color="primary"
                                                    variant="contained"
                                                    onClick={handleCreateImportReceipt}
                                                >
                                                    Lưu
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Stack>
                </Card>
            </Box>
        </>
    );
};

export default CreateRequestCustomerPage;
