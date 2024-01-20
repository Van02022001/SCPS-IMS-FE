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
    Select,
    Stack,
    Box,
    TableContainer,
    Table,
    TextField,
    DialogContent,
    InputLabel,
    IconButton,
} from '@mui/material';

import USERLIST from '~/_mock/user';

//compornent
import { Helmet } from 'react-helmet-async';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Scrollbar from '~/components/scrollbar/Scrollbar';

import { useNavigate } from 'react-router-dom';
//api

import { getAllItemBySale } from '~/data/mutation/items/item-mutation';
import { getAllWarehouse, getInventoryStaffByWarehouseId } from '~/data/mutation/warehouse/warehouse-mutation';
import { createRequestCustomer } from '~/data/mutation/customerRequest/CustomerRequest-mutation';
import { getAllCustomer } from '~/data/mutation/customer/customer-mutation';
import { CreateGoodReceiptListHead } from '~/sections/@dashboard/manager/transaction/createGoodReceipt';
import SnackbarError from '~/components/alert/SnackbarError';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

const CreateRequestCustomerPage = () => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [selected, setSelected] = useState([]);

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
    const [descriptionReceipt, setDescriptionReceipt] = useState('');

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
    const [tabs, setTabs] = useState([{ label: 'Hóa đơn 1', products: [] }]);
    const [selectedTab, setSelectedTab] = useState(0);

    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Import process started successfully') {
            setSuccessMessage('Thành công');
        } else if (message === 'Import process started successfully') {
            setSuccessMessage('Thành công');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        setErrorMessage(message);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'An error occurred while creating the customer request receipt') {
            setErrorMessage('Vui lòng chọn Khách hàng, Kho hàng và Nhân viên !');
        } else if (message === 'Inventory not found') {
            setErrorMessage('Không tìm thấy sản phẩm trong kho!');
        } else if (message === 'Hãy nhập số lượng') {
            setErrorMessage('Hãy nhập số lượng !');
        } else if (message === 'Hãy chọn ít nhất 1 sản phẩm') {
            setErrorMessage('Hãy chọn ít nhất 1 sản phẩm !');
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

    const TABLE_HEAD = [
        { id: 'image' },
        { id: 'code', label: 'Mã sản phẩm', alignRight: false },
        { id: 'name', label: 'Tên sản phẩm', alignRight: false },
        { id: 'availableQuantity', label: 'Số lượng tồn kho', alignRight: false },
        { id: 'quality', label: 'Số lượng', alignRight: false },
        { id: 'button' },
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
        getAllCustomer()
            .then((respone) => {
                const data = respone.data;
                setCustomerData(data);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

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
        const fetchData = async () => {
            try {
                const itemsResponse = await getAllItemBySale(selectedWarehouse.id);
                setItemsData(itemsResponse.data);

                const inventoryStaffResponse = await getInventoryStaffByWarehouseId(selectedWarehouse.id);
                setInventoryStaffList(inventoryStaffResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (selectedWarehouse) {
            fetchData();
        }
    }, [selectedWarehouse, selectedInventoryStaff]);

    const handleCreateImportReceipt = async () => {
        try {
            if (selectedItems.some((item) => !item.quantity || parseInt(item.quantity, 10) <= 0)) {
                handleErrorMessage('Hãy nhập số lượng');
                return;
            } else if (selectedItems.length === 0) {
                handleErrorMessage('Hãy chọn ít nhất 1 sản phẩm');
                return;
            }
            // Use the data from descriptionReceipt and other relevant states
            const requestData = {
                customerId: selectedCustomerId.customerId,
                warehouseId: selectedWarehouse.id,
                inventoryStaff: selectedInventoryStaff,
                note: descriptionReceipt,
                details: selectedItems.map((item) => ({
                    itemId: item.itemId,
                    quantity: item.quantity,
                })),
            };

            const response = await createRequestCustomer(requestData);

            if (response.status === '201 CREATED') {
                // Handle success
                handleSuccessMessage(response.message);
            }

            navigate('/sale-staff/request-customer', {
                state: { successMessage: response.message },
            });
        } catch (error) {
            console.error('Error creating customer request:', error.response);
            handleErrorMessage(error.response?.data?.message || 'Đã xảy ra lỗi.');
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
                        Tạo yêu cầu xuất kho
                    </Typography>
                </Stack>

                <Card>
                    <Stack spacing={4} margin={2} style={{ minHeight: '70vh' }}>
                        <Grid container spacing={2}>
                            {/* Danh sách sản phẩm đã thêm bên trái */}
                            <Grid item xs={7}>
                                <Paper>
                                    <Scrollbar>
                                        <TableContainer sx={{ minWidth: 800 }}>
                                            <Table>
                                                <CreateGoodReceiptListHead
                                                    // order={order}
                                                    // orderBy={orderBy}
                                                    headLabel={TABLE_HEAD}
                                                    rowCount={selectedItems.length}
                                                    numSelected={selected.length}
                                                    onRequestSort={handleRequestSort}
                                                    onSelectAllClick={handleSelectAllClick}
                                                />
                                            </Table>

                                            {/* Danh sách sản phẩm đã thêm bên trái */}
                                            <Paper>
                                                <List>
                                                    {selectedItems.map((selectedItem, index) => (
                                                        <ListItem
                                                            key={`${selectedItem.id}-${index}`}
                                                            sx={{ display: 'flex', alignItems: 'center' }}
                                                        >
                                                            <ListItemText sx={{ flexBasis: '7%' }}>
                                                                <img
                                                                    src={selectedItem.imageUrl}
                                                                    // alt={selectedItem.name}
                                                                    width="48"
                                                                    height="48"
                                                                />
                                                            </ListItemText>

                                                            <ListItemText sx={{ flexBasis: '22%' }}>
                                                                <Typography variant="body1">
                                                                    {selectedItem.code}
                                                                </Typography>
                                                            </ListItemText>
                                                            <ListItemText sx={{ flexBasis: '32%' }}>
                                                                <Typography variant="body1">
                                                                    {selectedItem.subcategoryName}
                                                                </Typography>
                                                            </ListItemText>
                                                            <ListItemText sx={{ flexBasis: '22%' }}>
                                                                <Typography variant="body1">
                                                                    {selectedItem.availableQuantity}
                                                                </Typography>
                                                            </ListItemText>
                                                            <ListItemText sx={{ flexBasis: '16%' }}>
                                                                <TextField
                                                                    type="text"
                                                                    label="Số lượng"
                                                                    sx={{ width: '70%' }}
                                                                    value={selectedItem.quantity}
                                                                    onChange={(e) => {
                                                                        const inputValue = e.target.value;
                                                                        if (/^\d*$/.test(inputValue)) {
                                                                            handleQuantityChange(
                                                                                selectedItems.indexOf(selectedItem),
                                                                                inputValue,
                                                                            );
                                                                        }
                                                                    }}
                                                                    inputProps={{
                                                                        inputMode: 'numeric',
                                                                        pattern: '[0-9]*',
                                                                    }}
                                                                />
                                                            </ListItemText>
                                                            <Button onClick={() => handleRemoveFromCart(index)}>
                                                                Xóa
                                                            </Button>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Paper>
                                        </TableContainer>
                                    </Scrollbar>
                                    {/* Thêm phần hiển thị thông tin khách hàng và tổng tiền */}

                                    <Stack
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr auto',
                                            // gap: 1,
                                            // alignItems: 'center',
                                            maxWidth: 220,
                                        }}
                                    >
                                        <EditIcon sx={{ mt: 2, mb: 3 }} />
                                        <TextField
                                            id="outlined-multiline-static"
                                            multiline
                                            label="Ghi chú"
                                            sx={{ border: 'none', width: '300px', marginLeft: '10px' }}
                                            variant="standard"
                                            value={descriptionReceipt}
                                            onChange={(e) => setDescriptionReceipt(e.target.value)}
                                        />
                                    </Stack>
                                    <FormControl
                                        sx={{ margin: 1 }}
                                        style={{
                                            position: 'relative',
                                            bottom: 10,
                                            left: 0,
                                            borderColor: 'black',
                                            borderWidth: 1,
                                            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                            borderRadius: 5,
                                            minWidth: 850,
                                            padding: 20,
                                        }}
                                    >
                                        <Typography variant="h6">Thông tin đơn hàng</Typography>
                                        <Typography variant="body1">
                                            Tên khách hàng:{' '}
                                            {selectedCustomerId ? selectedCustomerId.name : 'Chưa có khách hàng'}
                                        </Typography>
                                        <Typography variant="body1">
                                            Địa chỉ:{' '}
                                            {selectedCustomerId ? selectedCustomerId.address : 'Chưa có khách hàng'}
                                        </Typography>
                                    </FormControl>
                                </Paper>
                            </Grid>

                            {/* Danh sách sản phẩm bên phải */}
                            <Grid item xs={5} style={{ padding: '20px' }}>
                                <Paper
                                    style={{
                                        border: '1px solid #ccc',
                                        borderRadius: '8px',
                                        boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)',
                                        minHeight: '70vh',
                                    }}
                                >
                                    <Grid container spacing={2} padding={2} alignItems="center">
                                        <Grid item xs={4}>
                                            <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                                <InputLabel id="warehouse-label">Chọn khách hàng...</InputLabel>
                                                <Select
                                                    labelId="warehouse-label"
                                                    id="warehouse"
                                                    value={selectedCustomerId ? selectedCustomerId.customerId : ''}
                                                    disabled={selectedItems.length > 0}
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
                                            <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                                <InputLabel id="warehouse-label">Chọn kho hàng...</InputLabel>
                                                <Select
                                                    labelId="warehouse-label"
                                                    id="warehouse"
                                                    value={selectedWarehouse ? selectedWarehouse.id : ''}
                                                    disabled={selectedItems.length > 0}
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
                                                        disabled={selectedItems.length > 0}
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
                                                    itemsData.map((item, index) => (
                                                        <ListItem
                                                            key={item.id}
                                                            style={{
                                                                display: 'inline-block',
                                                                margin: '8px',
                                                                border: '1px solid #ccc',
                                                                borderRadius: '8px',
                                                                boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)',
                                                                width: '230px',
                                                                position: 'relative',
                                                            }}
                                                            InputProps={{ readOnly: true }}
                                                            title={[
                                                                `Tên thương hiệu:  ${item.brandName}`,
                                                                `Số lượng: ${item.availableQuantity}`,
                                                                `Nguồn gốc: ${item.originName}`,
                                                                `Nhà cung cấp: ${item.supplierName}`,
                                                            ].join('\n')}
                                                            onClick={() => handleAddToCart(item)}
                                                            titleStyle={{
                                                                display: 'inline-block',
                                                                margin: '8px',
                                                                border: '1px solid #ccc',
                                                                borderRadius: '8px',
                                                                boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)',
                                                                width: '230px',
                                                                position: 'relative',
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex' }}>
                                                                <img
                                                                    src={item.imageUrl}
                                                                    style={{
                                                                        width: '40%',
                                                                        height: '70px',
                                                                        objectFit: 'cover',
                                                                    }}
                                                                />
                                                                <div style={{ padding: '8px' }}>
                                                                    <Typography variant="body1">
                                                                        {item.subcategoryName}
                                                                    </Typography>
                                                                    <Typography variant="body1">{item.code}</Typography>
                                                                </div>
                                                            </div>
                                                        </ListItem>
                                                    ))
                                                ) : (
                                                    <Typography variant="body2">
                                                        Chọn kho hàng trước khi thêm sản phẩm.
                                                    </Typography>
                                                )}
                                            </List>
                                        </DialogContent>
                                    </div>

                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: 50,
                                            right: 34,
                                        }}
                                    >
                                        <Button color="primary" variant="contained" onClick={handleCreateImportReceipt}>
                                            Lưu
                                        </Button>
                                        <SnackbarError
                                            open={open1}
                                            handleClose={handleClose}
                                            message={errorMessage}
                                            action={action}
                                            style={{ bottom: '16px', right: '16px' }}
                                        />
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
