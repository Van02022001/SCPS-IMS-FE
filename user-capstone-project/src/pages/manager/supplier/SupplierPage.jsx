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
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CloseIcon from '@mui/icons-material/Close';

// sections
import { UserListHead, UserListToolbar } from '../../../sections/@dashboard/user';
// mock
import USERLIST from '../../../_mock/user';
import { getAllSuppliers } from '~/data/mutation/supplier/suppliers-mutation';
import SupplierForm from '~/sections/auth/manager/supplier/SupplierForm';
import SupplierDetailForm from '~/sections/auth/manager/supplier/SupplierDetailForm';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'code', label: 'Mã người bán', alignRight: false },
    { id: 'name', label: 'Tên', alignRight: false },
    { id: 'phone', label: 'Số điện thoại', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'taxCode', label: 'taxCode', alignRight: false },
    { id: 'address', label: 'Địa chỉ', alignRight: false },
];

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

const SupplierPage = () => {
    const [selectedSupplierId, setSelectedSupplierId] = useState(null);

    const [open, setOpen] = useState(null);

    const [openOderForm, setOpenOderForm] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [suppliersData, setSupplierData] = useState([]);

    useEffect(() => {
        getAllSuppliers()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    setSupplierData(data);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

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

    const handleSupplierClick = (supplier) => {
        if (selectedSupplierId === supplier.id) {
            console.log(selectedSupplierId);
            setSelectedSupplierId(null); // Đóng nếu đã mở
        } else {
            setSelectedSupplierId(supplier.id); // Mở hoặc chuyển sang hóa đơn khác
        }
    };

    const handleCloseSupplierDetails = () => {
        setSelectedSupplierId(null);
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

    const handleCloseOdersForm = () => {
        setOpenOderForm(false);
    };

    const updateSupplierStatusInList = (supplierId, newStatus) => {
        const supplierIndex = suppliersData.findIndex((supplier) => supplier.id === supplierId);

        if (supplierIndex !== -1) {
            const updatedSupplierData = [...suppliersData];
            updatedSupplierData[supplierIndex].status = newStatus;

            setSupplierData(updatedSupplierData);
        }
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

    const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    return (
        <>
            <Helmet>
                <title> Quản lý người bán | Minimal UI </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Quản lý người bán
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() => setOpenOderForm(true)}
                    >
                        Thêm người bán
                    </Button>
                    <Dialog fullWidth maxWidth="sm" open={openOderForm}>
                        <DialogTitle>
                            Tạo người bán{' '}
                            <IconButton style={{ float: 'right' }} onClick={handleCloseOdersForm}>
                                <CloseIcon color="primary" />
                            </IconButton>{' '}
                        </DialogTitle>
                        <SupplierForm />
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
                                    {suppliersData.map((supplier) => {
                                        return (
                                            <React.Fragment key={supplier.id}>
                                                <TableRow
                                                    hover
                                                    key={supplier.id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={selectedSupplierId === supplier.id}
                                                    onClick={() => handleSupplierClick(supplier)}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            onChange={(event) => handleClick(event, supplier.name)}
                                                        />
                                                    </TableCell>
                                                    {/* code  */}
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                {supplier.code}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>

                                                    {/* tên  */}
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                            <Typography variant="subtitle2" noWrap>
                                                                {supplier.name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                {supplier.phone}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                {supplier.email}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                {supplier.taxCode}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                {supplier.address}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                                {selectedSupplierId === supplier.id && (
                                                    <TableRow>
                                                        <TableCell colSpan={8}>
                                                            <SupplierDetailForm
                                                                suppliers={suppliersData}
                                                                suppliersId={selectedSupplierId}
                                                                onClose={handleCloseSupplierDetails}
                                                                updateSupplierStatusInList={updateSupplierStatusInList}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>

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
            </Container>

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
            ></Popover>
        </>
    );
};
export default SupplierPage;