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

import { createInternalExportRequest } from '~/data/mutation/internalExportRequest/internalExportRequest-mutation';
// mock
import USERLIST from '~/_mock/user';
// import Scrollbar from '~/components/scrollbar/Scrollbar';
// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
//api
import { getAllItemBySale, getItemByWarehouseId } from '~/data/mutation/items/item-mutation';
import { getAllWarehouse, getInventoryStaffByWarehouseId } from '~/data/mutation/warehouse/warehouse-mutation';

import SnackbarError from '~/components/alert/SnackbarError';
import {
    CreateRequestReceiptHead,
} from '~/sections/@dashboard/manager/transaction/createRequestReceipt';




const CreateInternalExportRequest = () => {
    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [selected, setSelected] = useState([]);
    // state form create==============================================
    const [descriptionReceipt, setDescriptionReceipt] = useState('');

    // ===============================================

    const [itemsData, setItemsData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    // warehouse
    const [selectedExportWarehouse, setSelectedExportWarehouse] = useState(null);
    const [selectedImportWarehouse, setSelectedImportWarehouse] = useState(null);
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

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Import request receipt created successfully') {
            setSuccessMessage('Tạo phiếu thành công');
        } else if (message === 'Update sub category successfully.') {
            setSuccessMessage('Cập nhập danh mục thành công');
        } else if (message === 'Internal export request receipt created successfully') {
            setSuccessMessage('Thành công');
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
        } else if (message === 'Hãy nhập số lượng') {
            setErrorMessage('Hãy nhập số lượng !');
        } else if (message === 'Hãy chọn ít nhất 1 sản phẩm') {
            setErrorMessage('Hãy chọn ít nhất 1 sản phẩm !');
        } else if (message === 'Số lượng không đủ') {
            setErrorMessage('Số lượng trong kho không đủ so với yêu cầu !');
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

    const navigate = useNavigate();

    const TABLE_HEAD = [
        { id: '' },
        { id: 'code', label: 'Mã sản phẩm', alignRight: false },
        { id: 'name', label: 'Tên sản phẩm', alignRight: false },
        { id: 'quality', label: 'Số lượng chuyển', alignRight: false },
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
                if (selectedExportWarehouse) {
                    const inventoryStaffList = await getInventoryStaffByWarehouseId(selectedExportWarehouse.id);
                    setInventoryStaffList(inventoryStaffList.data);
                }
            } catch (error) {
                console.error('Error fetching inventory staff:', error);
            }
        };

        fetchInventoryStaff();
    }, [selectedExportWarehouse, selectedInventoryStaff]);

    const handleCreateImportReceipt = async () => {
        try {
            // Validate if all quantities are provided
            if (selectedItems.some((item) => !item.availableQuantity || parseInt(item.availableQuantity, 10) <= 0)) {
                handleErrorMessage('Hãy nhập số lượng');
                return;
            } else if (selectedItems.length === 0) {
                handleErrorMessage('Hãy chọn ít nhất 1 sản phẩm');
                return;
            }
            const isQuantityValid = selectedItems.every((item) => {
                const selectedItemQuantity = parseInt(item.availableQuantity, 10);
                const availableQuantity = itemsData.find((itemData) => itemData.id === item.id)?.availableQuantity || 0;
                return selectedItemQuantity <= availableQuantity;
            });

            if (!isQuantityValid) {
                handleErrorMessage('Số lượng không đủ');
                return;
            }
            // Create an array of details from selectedItems with necessary properties
            const details = selectedItems.map((item) => ({
                itemId: item.itemId,
                quantity: item.quantity,
                // unitPrice: item.unitPrice,
                // unitId: item.unitId,
                description: item.description,
            }));

            // Prepare the request body
            const requestParams = {
                warehouseId: selectedExportWarehouse.id,
                inventoryStaffId: selectedInventoryStaff,
                description: descriptionReceipt,
                details: details,
            };

            // Gọi API và xử lý thành công
            const response = await createInternalExportRequest(requestParams);
            if (response.status === '201 CREATED') {
                handleSuccessMessage(response.message);
                // Chuyển hướng và truyền thông báo
                navigate('/dashboard/internal-exprot-request', {
                    state: { successMessage: response.message },
                });
            }
        } catch (error) {
            console.error('Error creating product:', error);
            handleErrorMessage(error.response?.data?.message);
        }
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

    const handleNavigate = () => {
        navigate('/dashboard/internal-exprot-request');
    };
    useEffect(() => {
        const fetchItemsByWarehouse = async () => {
            try {
                if (selectedExportWarehouse) {
                    const response = await getAllItemBySale(selectedExportWarehouse.id);
                    const data = response.data;

                    if (Array.isArray(data)) {
                        setItemsData(data);
                    } else {
                        console.error('API response is not an array:', data);
                    }
                }
            } catch (error) {
                console.error('Error fetching items by warehouse:', error);
            }
        };

        fetchItemsByWarehouse();
    }, [selectedExportWarehouse]);

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
            warehouseId: selectedExportWarehouse.id,
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

    const calculateTotalQuantity = () => {
        return selectedItems.reduce((total, item) => {
            const quantity = parseInt(item.quantity, 10);
            return isNaN(quantity) ? total : total + quantity;
        }, 0);
    };

    // const calculateTotalAmount = () => {
    //     return selectedItems.reduce((total, item) => {
    //         const quantity = parseInt(item.quantity, 10);
    //         const unitPrice = parseFloat(item.unitPrice);

    //         if (!isNaN(quantity) && !isNaN(unitPrice)) {
    //             return total + quantity * unitPrice;
    //         }

    //         return total;
    //     }, 0);
    // };
    // const handleDataSearch = (searchResult) => {
    //     // Cập nhật state của trang chính với dữ liệu từ tìm kiếm
    //     setDropdownData(searchResult);
    // };
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
                        Tạo yêu cầu xuất kho nội bộ
                    </Typography>
                </Stack>

                <Grid container spacing={2}>
                    <Grid item xs={7}>
                        <FormControl sx={{ minWidth: 200, marginRight: 5, marginBottom: 2, marginTop: 3 }}>
                            <InputLabel id="warehouse-label">Chọn kho xuất...</InputLabel>
                            <Select
                                disabled={selectedItems.length > 0}
                                size="large"
                                labelId="warehouse-label"
                                id="warehouse"
                                value={selectedExportWarehouse ? selectedExportWarehouse.id : ''}
                                onChange={(e) =>
                                    setSelectedExportWarehouse(
                                        warehouseList.find((warehouse) => warehouse.id === e.target.value),
                                    )
                                }
                            >
                                {warehouseList.filter((warehouse) => warehouse.id !== selectedImportWarehouse?.id).map((warehouse) => (
                                    <MenuItem key={warehouse.id} value={warehouse.id}>
                                        {warehouse.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {selectedExportWarehouse && (
                            <FormControl sx={{ minWidth: 200, marginTop: 3 }}>
                                <InputLabel id="inventory-staff-label">Chọn Nhân Viên</InputLabel>
                                <Select
                                    size="large"
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


                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <CreateRequestReceiptHead
                                    // order={order}
                                    // orderBy={orderBy}
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
                                            <ListItemText sx={{ flexBasis: '0%' }}>
                                                {selectedItem.imageUrl &&
                                                    selectedItem.imageUrl.length > 0 && (
                                                        <img
                                                            src={selectedItem.imageUrl}
                                                            alt={selectedItem.subcategoryName}
                                                            width="48"
                                                            height="48"
                                                        />
                                                    )}
                                            </ListItemText>
                                            <ListItemText sx={{ flexBasis: '24%' }}>
                                                <Typography variant="body1">{selectedItem.code}</Typography>
                                            </ListItemText>
                                            <ListItemText sx={{ flexBasis: '22%' }}>
                                                <Typography variant="body1">{selectedItem.subcategoryName}</Typography>
                                            </ListItemText>
                                            <ListItemText sx={{ flexBasis: '22%' }}>
                                                <TextField
                                                    type="text"
                                                    label="Số lượng"
                                                    sx={{ width: '40%' }}
                                                    value={selectedItem.quantity}
                                                    onChange={(e) => {
                                                        const inputValue = e.target.value;
                                                        if (/^\d*$/.test(inputValue) && inputValue !== '0') {
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
                                            sx={{ border: 'none', width: '300px' }}
                                            variant="standard"
                                            value={descriptionReceipt}
                                            onChange={(e) => setDescriptionReceipt(e.target.value)}
                                        />
                                    </Stack>
                                    <Typography variant="subtitle1" sx={{ fontSize: '16px' }}>
                                        Tổng số lượng: {calculateTotalQuantity()?.toLocaleString('vi-VN')}
                                    </Typography>
                                    {/* <Typography variant="subtitle1" sx={{ fontSize: '16px' }}>
                                                Tổng tiền hàng: {calculateTotalAmount().toLocaleString()}
                                            </Typography> */}
                                </CardContent>
                            </Card>
                        </div>
                    </Grid>

                    {/* Danh sách sản phẩm bên phải */}
                    <Grid item xs={5}>
                        <Stack direction="row" alignItems="center">
                            <FormControl sx={{ minWidth: 200, marginRight: 5, marginBottom: 2, marginTop: 3 }}>
                                <InputLabel id="warehouse-label">Chọn kho nhập...</InputLabel>
                                <Select
                                    disabled={selectedItems.length > 0}
                                    size="large"
                                    labelId="warehouse-label"
                                    id="warehouse"
                                    value={selectedImportWarehouse ? selectedImportWarehouse.id : ''}
                                    onChange={(e) =>
                                        setSelectedImportWarehouse(
                                            warehouseList.find((warehouse) => warehouse.id === e.target.value),
                                        )
                                    }
                                >
                                    {warehouseList.filter((warehouse) => warehouse.id !== selectedExportWarehouse?.id)
                                        .map((warehouse) => (
                                            <MenuItem key={warehouse.id} value={warehouse.id}>
                                                {warehouse.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Stack>
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
                                    {selectedExportWarehouse ? (
                                        itemsData.map((items, index) => (
                                            <ListItem
                                                key={items.id}
                                                style={{
                                                    display: 'inline-block',
                                                    margin: '8px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '8px',
                                                    boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)',
                                                    alignItems: 'center',
                                                    width: '230px',
                                                }}
                                                title={[
                                                    `Tên thương hiệu:  ${items.brandName}`,
                                                    `Nguồn gốc: ${items.originName}`,
                                                    `Nhà cung cấp: ${items.supplierName}`,
                                                ].join('\n')}
                                                onClick={() => handleAddToCart(items)}
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
                                                    {items.imageUrl &&
                                                        items.imageUrl.length > 0 && (
                                                            <div style={{
                                                                width: '100px',
                                                                height: '100px',
                                                                overflow: 'hidden',
                                                                borderRadius: 5,
                                                            }}>
                                                                <img
                                                                    src={items.imageUrl}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover',
                                                                    }}
                                                                    alt={items.subcategoryName}
                                                                />
                                                            </div>
                                                        )}
                                                    <div style={{ padding: '8px' }}>
                                                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                                            {items.subcategoryName}
                                                        </Typography>
                                                        <Typography variant="body1" >
                                                            Số lượng: {items.availableQuantity}
                                                        </Typography>
                                                        <Typography variant="body2">{items.code}</Typography>
                                                    </div>
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
};

export default CreateInternalExportRequest;
