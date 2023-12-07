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
} from '@mui/material';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CloseIcon from "@mui/icons-material/Close"
// sections
import { UserListHead, UserListToolbar } from '../../../sections/@dashboard/user';
import OdersForm from '~/sections/auth/manager/items/CreateItemsForm';
import OrderDetailForm from '~/sections/auth/manager/items/ItemDetailForm';
import USERLIST from '../../../_mock/user';
import CustomerRequestForm from '~/sections/auth/sale/customerRequest/CustomerRequestForm';
import CreateRequestCustomerPage from './CreateRequestCustomerPage';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Mã hóa đơn', alignRight: false },
    { id: 'company', label: 'Thời gian', alignRight: false },
    { id: 'role', label: 'Mã khách hàng', alignRight: false },
    { id: 'isVerified', label: 'Khách hàng', alignRight: false },
    { id: 'status', label: 'Tổng tiền hàng', alignRight: false },
    { id: 'status', label: 'Giảm giá', alignRight: false },
    { id: 'status', label: 'Khách đã trả', alignRight: false },
    { id: '' },
];
const orderDetailFormStyles = {
    maxHeight: 0,
    overflow: 'hidden',
    transition: 'max-height 0.3s ease-in-out',
};

// ----------------------------------------------------------------------

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

const CustomerRequestSalePage = () => {
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
    const navigate = useNavigate();

    const handleOrderClick = (order) => {
        if (selectedOrderId === order.id) {
            setSelectedOrderId(null); // Đóng nếu đã mở
        } else {
            setSelectedOrderId(order.id); // Mở hoặc chuyển sang hóa đơn khác
        }
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
    useEffect(() => {
        // getAllImportRequest()
        //     .then((respone) => {
        //         const data = respone.data;
        //         if (Array.isArray(data)) {
        //             setImportRequestData(data);
        //         } else {
        //             console.error('API response is not an array:', data);
        //         }
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching users:', error);
        //     });
    }, []);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

    const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;


    return (
        <>
            <Helmet>
                <title> Hóa đơn | Minimal UI </title>
            </Helmet>


            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Phiếu hóa đơn
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={() => navigate('/sale-staff/create-request')}
                >
                    Xử lý hóa đơn
                </Button>
                <Dialog fullWidth maxWidth open={openOderForm} >
                    <DialogTitle>Xử lý đặt hàng  <IconButton style={{ float: 'right' }} onClick={handleCloseOdersForm}>
                        <CloseIcon color="primary" /></IconButton>
                    </DialogTitle>
                    <CreateRequestCustomerPage open={openOderForm} />
                </Dialog>
            </Stack>

            <Card>
                <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

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
                                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { id, name, role, status, company, avatarUrl, isVerified } = row;
                                    const selectedUser = selected.indexOf(name) !== -1;

                                    return (
                                        <React.Fragment key={id}>
                                            <TableRow
                                                hover
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={selectedOrderId === id}
                                                onClick={() => handleOrderClick(row)}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Avatar alt={name} src={avatarUrl} />
                                                        <Typography variant="subtitle2" noWrap>
                                                            {name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{company}</TableCell>

                                                <TableCell align="left">{role}</TableCell>

                                                <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>

                                                <TableCell align="left">
                                                    <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                                                </TableCell>

                                                <TableCell align="right">
                                                    <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                                                        <Iconify icon={'eva:more-vertical-fill'} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>


                                            {selectedOrderId === id && (
                                                <TableRow>
                                                    <TableCell colSpan={8}>
                                                        <OrderDetailForm orders={USERLIST} orderId={selectedOrderId} onClose={handleCloseOrderDetails} />
                                                    </TableCell>
                                                </TableRow>
                                            )}
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
                    count={USERLIST.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>



            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem>
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                    Edit
                </MenuItem>

                <MenuItem sx={{ color: 'error.main' }}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Popover>
        </>
    );
}
export default CustomerRequestSalePage
