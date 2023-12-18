import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Box,
    Grid,
    Table,
    Button,
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
    InputLabel,
    Card,
    CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
// sections
import { CreateGoodReceiptListHead } from '~/sections/@dashboard/manager/transaction/createGoodReceipt';
import { createImportRequestReceipt } from '~/data/mutation/importRequestReceipt/ImportRequestReceipt-mutation';
// mock
import USERLIST from '~/_mock/user';
import Scrollbar from '~/components/scrollbar/Scrollbar';
// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
//api
import { getAllItem } from '~/data/mutation/items/item-mutation';
import { getAllUnit } from '~/data/mutation/unit/unit-mutation';
import { getAllWarehouse, getInventoryStaffByWarehouseId } from '~/data/mutation/warehouse/warehouse-mutation';

import SnackbarError from '~/components/alert/SnackbarError';

const CreateGoodReceipt = () => {
    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [selected, setSelected] = useState([]);
    // state form create==============================================
    const [descriptionReceipt, setDescriptionReceipt] = useState('');
    const [itemId, setItemId] = useState([]);
    const [quantity, setQuantity] = useState(null);
    const [unitPrice, setUnitPrice] = useState(null);
    const [unitId, setUnitId] = useState([]);
    const [descriptionItems, setDescriptionItems] = useState('');

    // ===============================================

    const [itemsData, setItemsData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedUnitId, setSelectedUnitId] = useState('');
    // warehouse
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    // const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
    const [selectedInventoryStaff, setSelectedInventoryStaff] = useState(null);
    const [warehouseList, setWarehouseList] = useState([]);
    const [inventoryStaffList, setInventoryStaffList] = useState([]);
    const [recieptParams, setRecieptParams] = useState({
        warehouseId: null,
        inventoryStaffId: null,
        description: '',
        details: [],
    });
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
        if (message === 'Import request receipt created successfully') {
            setSuccessMessage('Tạo phiếu thành công');
        } else if (message === 'Update sub category successfully.') {
            setSuccessMessage('Cập nhập danh mục thành công');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Inventory Staff not found!') {
            setErrorMessage('Không tìm thấy nhân viên !');
        } else if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ');
        } else if (message === '404 NOT_FOUND') {
            setErrorMessage('Mô tả quá dài');
        } else if (message === 'Warehouse not found!') {
            setErrorMessage('Hãy chọn kho và nhân viên !');
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
        handleCreateImportReceipt();
    };

    const handleConfirm1 = () => {
        setConfirmOpen1(true);
    };

    //========================== Hàm notification của trang ==================================

    const navigate = useNavigate();

    const TABLE_HEAD = [
        { id: 'name', label: 'Tên sản phẩm', alignRight: false },
        { id: 'quality', label: 'Số lượng', alignRight: false },
        // { id: 'pricing', label: 'Giá mua', alignRight: false },
        // { id: 'unit', label: 'Đơn vị', alignRight: false },
        { id: '' },
    ];
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
            // Gọi API và xử lý thành công
            const response = await createImportRequestReceipt(recieptParams);
            if (response.status === '201 CREATED') {
                handleSuccessMessage(response.message);
                // Chuyển hướng và truyền thông báo
                navigate('/dashboard/request-import-receipt', {
                    state: { successMessage: response.message },
                });
            }
        } catch (error) {
            console.error('Error creating product:', error);
            handleErrorMessage(error.response?.data?.message);
        }
    };

    // const handleSearch = (selectedWarehouseId, selectedInventoryStaffId) => {
    //     setWarehouseId(selectedWarehouseId);
    //     setInventoryStaffId(selectedInventoryStaffId);
    //     console.log('Warehouse ID:', selectedWarehouseId);
    //     console.log('Inventory Staff ID:', selectedInventoryStaffId);
    // };

    // const handleUnitChange = (newUnitId) => {
    //     setSelectedUnitId(newUnitId);
    //     setUnitId((prevUnitId) => [...prevUnitId, newUnitId]);
    // };
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



    const handleNavigate = () => {
        navigate('/dashboard/request-import-receipt');
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
        const updatedSelectedItems = [
            ...selectedItems,
            {
                ...selectedProduct,
                itemId: selectedProduct.id,
                quantity: 0,
                unitPrice: 0,
                unitId: 0,
                description: '',
            },
        ];

        const newRecieptParams = {
            warehouseId: selectedWarehouse.id,
            inventoryStaffId: selectedInventoryStaff,
            description: descriptionReceipt,
            details: [
                ...recieptParams.details,
                {
                    itemId: selectedProduct.id,
                    quantity: 0,
                    unitPrice: 0,
                    unitId: 0,
                    description: '',
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
                unitPrice: item.unitPrice,
                unitId: item.unitId,
                description: item.description,
            })),
        };

        setRecieptParams(updatedRecieptParams);
    };

    const handleUnitPriceChange = (index, value) => {
        const updatedItems = [...selectedItems];
        updatedItems[index].unitPrice = value;
        setSelectedItems(updatedItems);

        // Update recieptParams
        const updatedRecieptParams = {
            ...recieptParams,
            details: updatedItems.map((item) => ({
                itemId: item.itemId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                unitId: item.unitId,
                description: item.description,
            })),
        };

        setRecieptParams(updatedRecieptParams);
    };

    const handleUnitIdChange = (index, value) => {
        const updatedItems = [...selectedItems];
        updatedItems[index].unitId = value;
        setSelectedItems(updatedItems);

        // Update recieptParams
        const updatedRecieptParams = {
            ...recieptParams,
            details: updatedItems.map((item) => ({
                itemId: item.itemId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                unitId: item.unitId,
                description: item.description,
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
                unitPrice: item.unitPrice,
                unitId: item.unitId,
                description: item.description,
            })),
        };

        setRecieptParams(updatedRecieptParams);
    };
    console.log(unitId, 'aaaa');

    const calculateTotalQuantity = () => {
        return selectedItems.reduce((total, item) => {
            const quantity = parseInt(item.quantity, 10);
            return isNaN(quantity) ? total : total + quantity;
        }, 0);
    };

    const calculateTotalAmount = () => {
        return selectedItems.reduce((total, item) => {
            const quantity = parseInt(item.quantity, 10);
            const unitPrice = parseFloat(item.unitPrice);

            if (!isNaN(quantity) && !isNaN(unitPrice)) {
                return total + quantity * unitPrice;
            }

            return total;
        }, 0);
    };

    return (
        <>
            <Helmet>
                <title> Nhập Kho | </title>
            </Helmet>

            <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" alignItems="center" mb={5}>
                    <Button onClick={handleNavigate}>
                        <ArrowBackIcon fontSize="large" color="action" />
                    </Button>
                    <Typography variant="h4" gutterBottom>
                        Tạo yêu cầu nhập kho
                    </Typography>
                </Stack>

                <Grid container spacing={2}>
                    <Grid item xs={7}>
                        {/* Toolbar */}

                        <FormControl sx={{ minWidth: 200, marginRight: 5, marginBottom: 2 }}>
                            <InputLabel id="warehouse-label">Chọn kho hàng...</InputLabel>
                            <Select
                                labelId="warehouse-label"
                                id="warehouse"
                                value={selectedWarehouse ? selectedWarehouse.id : ''}
                                onChange={(e) =>
                                    setSelectedWarehouse(
                                        warehouseList.find((warehouse) => warehouse.id === e.target.value),
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

                        {selectedWarehouse && (
                            <FormControl sx={{ minWidth: 200 }}>
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

                        <Scrollbar>
                            <TableContainer sx={{ minWidth: 800 }}>
                                <Table>
                                    <CreateGoodReceiptListHead
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
                                            <ListItem
                                                key={`${selectedItem.id}-${index}`}
                                                sx={{ display: 'flex', alignItems: 'center' }}
                                            >
                                                {/* <img
                                                    src={selectedItem.avatar}
                                                    alt={selectedItem.name}
                                                    width="48"
                                                    height="48"
                                                /> */}
                                                {/* <ListItemText
                                                    // primary={selectedItem.id}
                                                    onChange={(e) => setItemId(e.target.value)}
                                                /> */}
                                                <ListItemText sx={{ flexBasis: '44%' }}>
                                                    <Typography variant="body1">
                                                        {selectedItem.subCategory.name}
                                                    </Typography>
                                                </ListItemText>
                                                <ListItemText sx={{ flexBasis: '28%' }}>
                                                    <TextField
                                                        type="number"
                                                        label="Số lượng"
                                                        sx={{ width: '100%' }}
                                                        value={selectedItem.quantity}
                                                        onChange={(e) =>
                                                            handleQuantityChange(
                                                                selectedItems.indexOf(selectedItem),
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </ListItemText>
                                                {/* <ListItemText>
                                                    <TextField
                                                        type="number"
                                                        label="Giá"
                                                        sx={{ width: '50%' }}
                                                        value={selectedItem.unitPrice}
                                                        onChange={(e) =>
                                                            handleUnitPriceChange(
                                                                selectedItems.indexOf(selectedItem),
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </ListItemText> */}
                                                {/* <ListItemText>
                                                    <Select
                                                        label="Đơn vị"
                                                        value={selectedItem.unitId} // Sử dụng selectedUnitId thay vì unitId
                                                        onChange={(e) =>
                                                            handleUnitIdChange(
                                                                selectedItems.indexOf(selectedItem),
                                                                e.target.value,
                                                            )
                                                        }
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
                                                </ListItemText> */}
                                                <Button onClick={() => handleRemoveFromCart(index)}>Xóa</Button>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </TableContainer>
                            <div>
                                <Card sx={{ marginTop: 5 }}>
                                    <CardContent
                                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                    >
                                        {/* <EditIcon /> */}
                                        <Stack
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr auto',
                                                gap: 1,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <EditIcon sx={{ mt: 2 }} />
                                            <TextField
                                                id="outlined-multiline-static"
                                                multiline
                                                label="Ghi chú"
                                                sx={{ border: 'none' }}
                                                variant="standard"
                                                value={descriptionReceipt}
                                                onChange={(e) => setDescriptionReceipt(e.target.value)}
                                            />
                                        </Stack>
                                        <div>
                                            <Typography variant="subtitle1" sx={{ fontSize: '16px' }}>
                                                Tổng số lượng: {calculateTotalQuantity()}
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ fontSize: '16px' }}>
                                                Tổng tiền hàng: {calculateTotalAmount().toLocaleString()}
                                            </Typography>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </Scrollbar>
                    </Grid>

                    {/* Danh sách sản phẩm bên phải */}
                    <Grid item xs={5}>
                        <div style={{ textAlign: 'center' }}>
                            <DialogContent
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    minHeight: '720px',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)',
                                    minHeight: '70vh',
                                }}
                            >
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
                                                <img alt={items.name} width="100%" />
                                                <div style={{ padding: '8px' }}>
                                                    <Typography variant="body1">{items.subCategory.name}</Typography>
                                                </div>
                                            </ListItem>
                                        ))
                                    ) : (
                                        <Typography variant="body2">Chọn kho hàng trước khi thêm sản phẩm.</Typography>
                                    )}
                                </List>
                                <Button color="primary" variant="contained" onClick={handleCreateImportReceipt}>
                                    Lưu
                                </Button>
                            </DialogContent>
                            {/* <CustomDialog
                                open={confirmOpen1}
                                onClose={handleConfirmClose1}
                                title="Thông báo!"
                                content="Bạn có chắc muốn cập nhật không?"
                                onConfirm={handleConfirmUpdate1}
                                confirmText="Xác nhận"
                            /> */}
                            {/* <SnackbarSuccess
                                open={open}
                                handleClose={handleClose}
                                message={successMessage}
                                action={action}
                                style={{ bottom: '16px', right: '16px' }}
                            /> */}
                            <SnackbarError
                                open={open1}
                                handleClose={handleClose}
                                message={errorMessage}
                                action={action}
                                style={{ bottom: '16px', right: '16px' }}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default CreateGoodReceipt;
