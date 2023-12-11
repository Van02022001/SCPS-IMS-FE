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
//components
import BoxComponent from '~/components/box/BoxComponent';
// sections
import { UserListHead } from '~/sections/@dashboard/user';
// api
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';
import { createItem, getAllItem } from '~/data/mutation/items/item-mutation';

// icons
// mock
import USERLIST from '~/_mock/user';
import Scrollbar from '~/components/scrollbar/Scrollbar';
import { createTransfer } from '~/data/mutation/warehouseTransfer/warehouseTransfer-mutation';

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
    const [selectedItems, setSelectedItems] = useState([]);

    //thông báo
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [recieptParams, setRecieptParams] = useState({
        details: [],
    });

    const TABLE_HEAD = [
        { id: 'name', label: 'Tên sản phẩm', alignRight: false },
        { id: 'pricing', label: 'Kho nguồn', alignRight: false },
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
    const handleCreateTransfer = async () => {
        try {
            // Prepare the data based on the selected items
            const transferData = selectedItems.map((selectedItem) => ({
                itemId: selectedItem.itemId,
                sourceWarehouseId: selectedItem.sourceWarehouseId,
                destinationWarehouseId: selectedItem.destinationWarehouseId,
                quantity: selectedItem.quantity,
            }));

            // Make the API call
            const response = await createTransfer(transferData);

            if (response.status === '201 CREATED') {
                // Handle success
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.data.message);
            }
        } catch (error) {
            console.error('Error creating transfer:', error.response);
            setIsError(true);
            setIsSuccess(false);

            if (error.response?.data?.message === 'Invalid request') {
                setErrorMessage('Yêu cầu không hợp lệ');
            }
        }
    };

    const handleAddToCart = (selectedProduct) => {
        const updatedSelectedItems = [
            ...selectedItems,
            {
                ...selectedProduct,
                itemId: selectedProduct.id,
            },
        ];

        const newRecieptParams = {
            details: [
                ...recieptParams.details,
                {
                    itemId: selectedProduct.id,
                },
            ],
        };

        setRecieptParams(newRecieptParams);
        setSelectedItems(updatedSelectedItems);
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
    }, []);

    console.log(selectedItems);

    return (
        <>
            <Helmet>
                <title> Chuyển Kho | </title>
            </Helmet>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={7}>
                        {/* Toolbar */}

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
                                                    <Select
                                                        label="Kho nguồn"
                                                        sx={{ width: '50%' }}
                                                        // value={selectedItem.unitId}
                                                        // onChange={(e) =>
                                                        //     handleUnitIdChange(
                                                        //         selectedItems.indexOf(selectedItem),
                                                        //         e.target.value,
                                                        //     )
                                                        // }
                                                    >
                                                        {/* {unitId.map((unit) => (
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
                                                        ))} */}
                                                    </Select>
                                                </ListItemText>
                                                <ListItemText>
                                                    <Select
                                                        label="Kho đến"
                                                        sx={{ width: '50%' }}
                                                        // value={selectedItem.unitId}
                                                        // onChange={(e) =>
                                                        //     handleUnitIdChange(
                                                        //         selectedItems.indexOf(selectedItem),
                                                        //         e.target.value,
                                                        //     )
                                                        // }
                                                    >
                                                        {/* {unitId.map((unit) => (
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
                                                        ))} */}
                                                    </Select>
                                                </ListItemText>
                                                <ListItemText>
                                                    <TextField
                                                        type="number"
                                                        label="Số lượng"
                                                        sx={{ width: '50%' }}
                                                        // value={selectedItem.quantity}
                                                        // onChange={(e) =>
                                                        //     handleQuantityChange(
                                                        //         selectedItems.indexOf(selectedItem),
                                                        //         e.target.value,
                                                        //     )
                                                        // }
                                                    />
                                                </ListItemText>
                                                {/* <Button onClick={() => handleRemoveFromCart(index)}>Xóa</Button> */}
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </TableContainer>
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
                                    {itemsData.map((items, index) => (
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
                                    ))}
                                </List>
                                {isSuccess && <SuccessAlerts message={successMessage} />}
                                {isError && <ErrorAlerts errorMessage={errorMessage} />}
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
