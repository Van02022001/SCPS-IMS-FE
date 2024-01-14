import { Helmet } from 'react-helmet-async';
import {
    Box,
    Button,
    DialogContent,
    FormControl,
    Grid,
    List,
    MenuItem,
    Select,
    TableContainer,
    Table,
    Stack,
    Tab,
    Tabs,
    ListItem,
    TextField,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//icons
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

//components
import BoxComponent from '~/components/box/BoxComponent';
// sections
import { UserListHead } from '~/sections/@dashboard/user';
// api
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import { createItem, getAllItem, getItemByWarehouse } from '~/data/mutation/items/item-mutation';

// icons
// mock
import USERLIST from '~/_mock/user';
import Scrollbar from '~/components/scrollbar/Scrollbar';
import { createTransfer } from '~/data/mutation/warehouseTransfer/warehouseTransfer-mutation';
import { getOtherWarehouse } from '~/data/mutation/warehouse/warehouse-mutation';
import { CreateGoodReceiptListHead } from '~/sections/@dashboard/manager/transaction/createGoodReceipt';
import SnackbarError from '~/components/alert/SnackbarError';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';

const CreateTransferForm = (props) => {
    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');
    const [selected, setSelected] = useState([]);
    // ====================================
    const [itemId, setItemId] = useState([]);
    const [tab1Data, setTab1Data] = useState({});
    const [tab2Data, setTab2Data] = useState({});

    //=====================================
    const [itemsData, setItemsData] = useState([]);
    const [destinationWarehouseId, setDestinationWarehouseId] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    //thông báo
    const [errorMessage, setErrorMessage] = useState('');
    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Error during item transfer: The given id must not be null') {
            setErrorMessage('Vui lòng chọn và điền đầy đủ thông tin !');
        } else if (message === 'Error during item transfer: Item inventory not found in source warehouse') {
            setErrorMessage('Không tìm thấy vật phẩm trong kho này !');
        } else if (message === 'Hãy nhập số lượng') {
            setErrorMessage('Hãy nhập số lượng !');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        console.log('Closing Snackbar...');
        setOpen(false);
        setOpen1(false);
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

    const handleCloseSnackbar = () => {
        setOpen(false);
        setOpen1(false);
    };

    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

    const navigate = useNavigate();

    const [recieptParams, setRecieptParams] = useState({
        destinationWarehouseId: null,
        items: [],
    });

    const TABLE_HEAD = [
        { id: 'image' },
        { id: 'code', label: 'Mã code', alignRight: false },
        { id: 'name', label: 'Tên sản phẩm', alignRight: false },
        { id: 'availableQuantity', label: 'Số lượng tồn kho', alignRight: false },
        { id: 'unit', label: 'Kho đến', alignRight: false },
        { id: 'quality', label: 'Số lượng', alignRight: false },
    ];

    const handleTab1DataChange = (event) => {
        // Cập nhật dữ liệu cho tab 1 tại đây
        setTab1Data({ ...tab1Data, [event.target.name]: event.target.value });
        console.log('setTab1Data: ', setTab1Data);
    };

    const handleTab2DataChange = (event) => {
        // Cập nhật dữ liệu cho tab 2 tại đây
        setTab2Data({ ...tab2Data, [event.target.name]: event.target.value });
    };

    //======================================================== hàm xử lý đóng mở popup form========================================================

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
    //================================================================================================================
    //========================== Hàm notification của trang ==================================

    //============================================================
    // hàm create category-----------------------------------------

    console.log(selectedItems);

    const handleCreateTransfer = async () => {
        try {
            // Prepare the data based on the selected items
            if (selectedItems.some((item) => !item.quantity || parseInt(item.quantity, 10) <= 0)) {
                handleErrorMessage('Hãy nhập số lượng');
                return;
            }
            // Make the API call
            const response = await createTransfer(recieptParams);

            if (response.status === '200 OK') {
                // Handle success
                // Chuyển hướng và truyền thông báo
                navigate('/inventory-staff/warehousesInventory', {
                    state: { successMessage: response.message },
                });
            }
        } catch (error) {
            console.error('Error creating transfer:', error.response);
            handleErrorMessage(error.response?.data?.message);
        }
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
            items: [
                ...recieptParams.items,
                {
                    itemId: selectedProduct.id,
                    quantity: 0,
                },
            ],
        };

        setRecieptParams(newRecieptParams);
        setSelectedItems(updatedSelectedItems);
    };

    const handleWarehouseIdChange = (index, value) => {
        console.log('Selected Warehouse ID:', value);

        // Update the selected warehouse ID
        setSelectedWarehouseId(value);

        const updatedItems = [...selectedItems];
        updatedItems[index].destinationWarehouseId = value;
        setSelectedItems(updatedItems);

        // Update recieptParams
        const updatedRecieptParams = {
            destinationWarehouseId: value,
            items: updatedItems.map((item) => ({
                itemId: item.itemId,
                quantity: item.quantity,
            })),
        };

        setRecieptParams(updatedRecieptParams);
    };

    const handleQuantityChange = (index, value) => {
        const updatedItems = [...selectedItems];
        updatedItems[index].quantity = value;
        setSelectedItems(updatedItems);

        // Update recieptParams
        const updatedRecieptParams = {
            ...recieptParams,
            items: updatedItems.map((item) => ({
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
            items: updatedItems.map((item) => ({
                itemId: item.itemId,
                quantity: item.quantity,
            })),
        };

        setRecieptParams(updatedRecieptParams);
    };

    useEffect(() => {
        getItemByWarehouse()
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
    }, []);

    useEffect(() => {
        getOtherWarehouse()
            .then((response) => {
                const data = response.data;
                setDestinationWarehouseId(data);

                // Thay đổi giá trị của selectedWarehouseId
                if (!selectedWarehouseId && data.length > 0) {
                    setSelectedWarehouseId(data[0].id);
                }
            })
            .catch((error) => console.error('Error fetching warehouses:', error));
    }, [selectedWarehouseId]);

    console.log(selectedItems);

    const handleNavigate = () => {
        navigate('/inventory-staff/warehousesInventory');
    };

    console.log('selectedWarehouseId:', selectedWarehouseId);

    return (
        <>
            <Helmet>
                <title> Chuyển Kho | </title>
            </Helmet>

            <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" alignItems="center" mb={5}>
                    <Button onClick={handleNavigate}>
                        <ArrowBackIcon fontSize="large" color="action" />
                    </Button>
                    <Typography variant="h4" gutterBottom>
                        Chuyển kho
                    </Typography>
                </Stack>
                <Grid container spacing={2}>
                    <Grid item xs={8.5}>
                        {/* Toolbar */}

                        <Scrollbar>
                            <TableContainer sx={{ minWidth: 800 }}>
                                <Table>
                                    <CreateGoodReceiptListHead
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
                                                    {selectedItem.subCategory.images &&
                                                        selectedItem.subCategory.images.length > 0 && (
                                                            <img
                                                                src={selectedItem.subCategory.images[0].url}
                                                                // alt={selectedItem.name}
                                                                width="48"
                                                                height="48"
                                                            />
                                                        )}
                                                </ListItemText>
                                                <ListItemText sx={{ flexBasis: '14%' }}>
                                                    <Typography variant="body1">{selectedItem.code}</Typography>
                                                </ListItemText>
                                                <ListItemText sx={{ flexBasis: '18%' }}>
                                                    <Typography variant="body1">
                                                        {selectedItem.subCategory.name}
                                                    </Typography>
                                                </ListItemText>
                                                <ListItemText sx={{ flexBasis: '16%' }}>
                                                    <Typography variant="body1">{selectedItem.available}</Typography>
                                                </ListItemText>
                                                <ListItemText sx={{ flexBasis: '12%' }}>
                                                    <Select
                                                        label="Kho đến"
                                                        sx={{ width: '50%' }}
                                                        value={selectedItem.destinationWarehouseId || ''}
                                                        onChange={(e) =>
                                                            handleWarehouseIdChange(
                                                                selectedItems.indexOf(selectedItem),
                                                                e.target.value,
                                                            )
                                                        }
                                                    >
                                                        {destinationWarehouseId.map((other) => (
                                                            <MenuItem
                                                                sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                }}
                                                                key={other.id}
                                                                value={other.id}
                                                            >
                                                                {other.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </ListItemText>
                                                <ListItemText sx={{ flexBasis: '4%' }}>
                                                    <TextField
                                                        type="number"
                                                        label="Số lượng"
                                                        sx={{ width: '80%' }}
                                                        value={selectedItem.quantity}
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value;
                                                            if (/^\d*$/.test(inputValue)) {
                                                                handleQuantityChange(
                                                                    selectedItems.indexOf(selectedItem),
                                                                    e.target.value,
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </ListItemText>
                                                <Button onClick={() => handleRemoveFromCart(index)}>Xóa</Button>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </TableContainer>
                        </Scrollbar>
                    </Grid>

                    {/* Danh sách sản phẩm bên phải */}
                    <Grid item xs={3.5}>
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
                                    {itemsData.map((items, index) => (
                                        <ListItem
                                            key={items.id}
                                            style={{
                                                display: 'inline-block',
                                                margin: '8px',
                                                border: '1px solid #ccc',
                                                borderRadius: '8px',
                                                boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)',
                                                width: '230px',
                                            }}
                                            title={[
                                                `Tên thương hiệu:  ${items.brand.name}`,
                                                `Nguồn gốc: ${items.origin.name}`,
                                                `Nhà cung cấp: ${items.supplier.name}`,
                                            ].join('\n')}
                                            onClick={() => handleAddToCart(items)}
                                        >
                                            <div style={{ display: 'flex' }}>
                                                {items.subCategory.images && items.subCategory.images.length > 0 && (
                                                    <img
                                                        src={items.subCategory.images[0].url}
                                                        style={{
                                                            width: '40%',
                                                            height: '70px',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                )}
                                                <div style={{ padding: '8px' }}>
                                                    <Typography variant="body1">{items.subCategory.name}</Typography>
                                                    <Typography variant="body1">{items.code}</Typography>
                                                </div>
                                            </div>
                                        </ListItem>
                                    ))}
                                </List>
                                <SnackbarError
                                    open={open1}
                                    handleClose={handleCloseSnackbar}
                                    message={errorMessage}
                                    action={action}
                                    style={{ bottom: '16px', right: '16px' }}
                                />
                                <Button color="primary" variant="contained" onClick={handleCreateTransfer}>
                                    Lưu
                                </Button>
                            </DialogContent>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default CreateTransferForm;
