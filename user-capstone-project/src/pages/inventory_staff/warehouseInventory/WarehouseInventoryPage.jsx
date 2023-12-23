import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useEffect, useState } from 'react';
// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
    Popover,
    Checkbox,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    Dialog,
    DialogTitle,
    Select,
    FormControl,
    InputLabel,
    OutlinedInput,
    ListItemText,
} from '@mui/material';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CloseIcon from '@mui/icons-material/Close';
// sections
import { UserListHead, UserListToolbar } from '../../../sections/@dashboard/user';
import USERLIST from '../../../_mock/user';
//icons

//calendar
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { getAllWarehouseTransfer } from '~/data/mutation/warehouseTransfer/warehouseTransfer-mutation';
import CreateTransferForm from '~/sections/auth/inventory_staff/warehouseInventory/CreateTransferForm';
import { useLocation, useNavigate } from 'react-router-dom';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import { getItemsByName } from '~/data/mutation/items/item-mutation';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'itemId', label: 'Mã sản phẩm', alignRight: false },
    { id: 'quantity', label: 'Số lượng', alignRight: false },
    { id: 'sourceWarehouseId', label: 'Kho nguồn', alignRight: false },
    { id: 'destinationWarehouseId', label: 'Kho đến', alignRight: false },
];
// const orderDetailFormStyles = {
//     maxHeight: 0,
//     overflow: 'hidden',
//     transition: 'max-height 0.3s ease-in-out',
// };

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const WarehouseInventoryPage = () => {
    const [open, setOpen] = useState(null);

    const [openOderForm, setOpenOderForm] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);
    //-------------------------------------------------
    const [openOderFormDetail, setOpenOderFormDetail] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [selectedTransferId, setSelectedTransferId] = useState([]);
    const [itemsName, setItemsName] = useState([]);

    // State data và xử lý data
    const [transferData, setTransferData] = useState([]);
    const [itemStatus, setItemStatus] = useState('');
    //--------------------Filter------------------------
    const [personName, setPersonName] = React.useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = React.useState([]);
    const [selectedFilterOptions, setSelectedFilterOptions] = useState(null);
    const [selectedSuppliers, setSelectedSuppliers] = React.useState([]);
    const [selectedOrigins, setSelectedOrigins] = React.useState([]);
    // fiter brand //
    const [brandData, setBrandData] = useState([]);
    const filterOptions = brandData.map((brand) => brand.name);
    // fiter subcate //
    const [subCategoryData, setSubCategoryData] = useState([]);
    const filterSubCategories = subCategoryData.map((subcate) => subcate.name);
    // fiter Suppliers //
    const [suppliersData, setSupplierData] = useState([]);
    const filterSuppliers = suppliersData.map((supplier) => supplier.name);
    // fiter Suppliers //
    const [originData, setOriginData] = useState([]);
    const filterOrigins = originData.map((origin) => origin.name);
    // fiter createdAt //
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const navigate = useNavigate();

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const handleChange = (event) => {
        setPersonName(event.target.value);
        const selectedValues = event.target.value.length > 0 ? event.target.value : null;
        setSelectedFilterOptions(selectedValues);
    };
    const handleChangeCategories = (event) => {
        setSelectedSubCategories(event.target.value);
    };

    const handleCloseOrderDetails = () => {
        setSelectedOrder(null);
    };

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
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

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };
    const handleCloseOdersForm = () => {
        setOpenOderForm(false);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleTransferClick = (transfer) => {
        console.log(transfer);
        if (selectedTransferId === transfer.id) {
            setSelectedTransferId(null); // Đóng nếu đã mở
        } else {
            setSelectedTransferId(transfer.id); // Mở hoặc chuyển sang sản phẩm khác
        }
    };
    // ============================================== Các hàm xử lý soft theo name==============================================
    const handleCheckboxChange = (event, transferId) => {
        setSelectedTransferId((prevIds) => {
            const updatedIds = Array.isArray(prevIds) ? prevIds : [];
            if (event.target.checked) {
                return [...updatedIds, transferId];
            } else {
                return updatedIds.filter((id) => id !== transferId);
            }
        });
    };

    //============================================== Hàm để thay đổi data mỗi khi Edit xong api=============================================
    // const updateItemInList = (updatedItem) => {
    //     const itemIndex = itemsData.findIndex((item) => item.id === updatedItem.id);

    //     if (itemIndex !== -1) {
    //         const updatedItemData = [...itemsData];
    //         updatedItemData[itemIndex] = updatedItem;

    //         setItemData(updatedItemData);
    //     }
    // };

    // const updateItemStatusInList = (itemId, newStatus) => {
    //     const itemIndex = itemsData.findIndex((item) => item.id === itemId);

    //     if (itemIndex !== -1) {
    //         const updatedItemData = [...itemsData];
    //         updatedItemData[itemIndex].status = newStatus;
    //         setItemData(updatedItemData);
    //     }
    // };

    const handleCreateTransferSuccess = (newTransfers) => {
        setOpenOderForm(false);
        setTransferData((prevTransfersData) => [...prevTransfersData, newTransfers]);
    };

    //===========================================================================================

    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

    const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    useEffect(() => {
        getAllWarehouseTransfer()
            .then((response) => {
                const data = response;
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => {
                        return dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss').diff(
                            dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'),
                        );
                    });
                    setTransferData(sortedData);

                    // Extracting unique item IDs from transfers
                    const itemIds = sortedData.map((transfer) => transfer.itemId);

                    // Fetching item details based on item IDs
                    getItemsByName(itemIds)
                        .then((response) => {
                            const data = response.data;
                            setItemsName(data);
                            console.log('itemsName:', setItemsName(data)); // Log the fetched data
                        })
                        .catch((error) => {
                            console.error('Error fetching items:', error);
                        });
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching transfers:', error);
            });
    }, []);

    console.log(transferData);

    // thông báo
    const location = useLocation();
    const { state } = location;
    const successMessage = state?.successMessage;
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');

    const mapSuccessMessageToVietnamese = (englishMessage) => {
        switch (englishMessage) {
            case 'Items transferred successfully':
                return 'Chuyển kho thành công !';
            // Thêm các trường hợp khác nếu cần
            default:
                return englishMessage;
        }
    };

    useEffect(() => {
        if (successMessage) {
            const vietnameseMessage = mapSuccessMessageToVietnamese(successMessage);
            setSnackbarSuccessOpen(true);
            setSnackbarSuccessMessage(vietnameseMessage);
        }
    }, [successMessage]);

    const getItemNameById = (itemId) => {
        console.log('itemsName:', itemsName); // Log itemsName to the console
        const item = itemsName.find((item) => item.id === itemId);
        console.log('item:', item); // Log the found item to the console
        return item ? item.name : 'Item Not Found';
    };

    return (
        <>
            <Helmet>
                <title> Chuyển kho | Minimal UI </title>
            </Helmet>

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Chuyển kho
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={() => navigate('/inventory-staff/warehouse-transfer')}
                >
                    Chuyển kho
                </Button>
                <Dialog fullWidth maxWidth open={openOderForm}>
                    <DialogTitle>
                        Chuyển kho{' '}
                        <IconButton style={{ float: 'right' }} onClick={handleCloseOdersForm}>
                            <CloseIcon color="primary" />
                        </IconButton>{' '}
                    </DialogTitle>
                    <CreateTransferForm />
                </Dialog>
            </Stack>

            <Card>
                <UserListToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

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
                            <TableBody>
                                {transferData.slice(startIndex, endIndex).map((transfer) => {
                                    return (
                                        <React.Fragment key={transfer.id}>
                                            <TableRow
                                                hover
                                                key={transfer.id}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={selectedTransferId === transfer.id}
                                                onClick={() => handleTransferClick(transfer)}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedTransferId === transfer.id}
                                                        onChange={(event) => handleCheckboxChange(event, transfer.id)}
                                                        // checked={selectedUser}
                                                        // onChange={(event) => handleClick(event, name)}
                                                    />
                                                </TableCell>

                                                <TableCell align="left">
                                                    <Typography variant="subtitle2" noWrap>
                                                        {getItemNameById(transfer.itemId)}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell align="left">{transfer.quantity}</TableCell>

                                                <TableCell align="left">{transfer.sourceWarehouseId}</TableCell>

                                                <TableCell align="left">{transfer.destinationWarehouseId}</TableCell>

                                                {/* <TableCell align="left">
                                                    <Label color={(transfer.status === 'Inactive' && 'error') || 'success'}>
                                                        {transfer.status === 'Active'
                                                            ? 'Đang hoạt động'
                                                            : 'Ngừng hoạt động'}
                                                    </Label>
                                                </TableCell> */}
                                            </TableRow>

                                            {/* {selectedItemId === item.id && (
                                                <TableRow>
                                                    <TableCell colSpan={8}>
                                                        <ItemDetaiIventoryForm
                                                            items={itemsData}
                                                            itemId={selectedItemId}
                                                            onClose={handleCloseOrderDetails}
                                                            updateItemInList={updateItemInList}
                                                            updateItemStatusInList={updateItemStatusInList}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )} */}
                                        </React.Fragment>
                                    );
                                })}

                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        Not found
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        No results found for &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                        <br /> Try checking for typos or using complete words.
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={transferData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <SnackbarSuccess
                    open={snackbarSuccessOpen}
                    handleClose={() => setSnackbarSuccessOpen(false)}
                    message={snackbarSuccessMessage}
                    style={{ bottom: '16px', right: '16px' }}
                />
            </Card>
        </>
    );
};
export default WarehouseInventoryPage;
