import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import React, { useEffect, useState } from 'react';

// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Button,
    TableRow,
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
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

// sections
import { WarehouseListHead, WarehouseToolbar } from '~/sections/@dashboard/manager/warehouse';
// mock
import USERLIST from '../../../_mock/user';
import { getAllWarehouse } from '~/data/mutation/warehouse/warehouse-mutation';
// form validation
import CreateWarehouseForm from '~/sections/auth/manager/warehouse/CreateWarehouseForm';
import WarehouseDetailForm from '~/sections/auth/manager/warehouse/WarehouseDetailForm';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';




// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Tên', alignRight: false },
    { id: 'address', label: 'Địa chỉ', alignRight: false },
    { id: 'status', label: 'Trạng thái', alignRight: false },
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

const WarehousePage = () => {
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

    const [open, setOpen] = useState(null);

    const [openOderForm, setOpenOderForm] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [warehouseData, setWarehouseData] = useState([]);
    // const [warehouseStatus, setWarehouseStatus] = useState('');
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');
    //Hàm để thay đổi data mỗi khi Edit xong api-------------------------------------------------------------
    const updateWarehouseInList = (updatedWarehouse) => {
        const warehouseIndex = warehouseData.findIndex((warehouse) => warehouse.id === updatedWarehouse.id);

        if (warehouseIndex !== -1) {
            const updatedWarehouseData = [...warehouseData];
            updatedWarehouseData[warehouseIndex] = updatedWarehouse;

            setWarehouseData(updatedWarehouseData);
        }
    };

    const updateWarehouseStatusInList = (warehouseId, newStatus) => {
        const warehouseIndex = warehouseData.findIndex((warehouse) => warehouse.id === warehouseId);

        if (warehouseIndex !== -1) {
            const updatedWarehouseData = [...warehouseData];
            updatedWarehouseData[warehouseIndex].status = newStatus;

            setWarehouseData(updatedWarehouseData);
        }
    };

    const handleCreateWarehouseSuccess = (newWarehouse, successMessage) => {
        // Close the form
        setOpenOderForm(false);
        setWarehouseData((prevWarehouseData) => [...prevWarehouseData, newWarehouse]);

        setSnackbarSuccessMessage(successMessage === 'Create warehouse successfully' ? 'Tạo kho chứa thành công!' : 'Thành công');
        setSnackbarSuccessOpen(true);

        setTimeout(() => {
            setSnackbarSuccessOpen(false);
            setSnackbarSuccessMessage('');
        }, 3000);
    };
    //----------------------------------------------------------------
    // const handleOpenMenu = (event) => {
    //     setOpen(event.currentTarget);
    // };

    // const handleCloseMenu = () => {
    //     setOpen(null);
    // };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = warehouseData.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // const handleClick = (event, name) => {
    //     const selectedIndex = selected.indexOf(name);
    //     let newSelected = [];
    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selected, name);
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selected.slice(1));
    //     } else if (selectedIndex === selected.length - 1) {
    //         newSelected = newSelected.concat(selected.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    //     }
    //     setSelected(newSelected);
    // };

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

    const handleWarehouseClick = (warehouse) => {
        if (selectedWarehouseId === warehouse.id) {
            console.log(selectedWarehouseId);
            setSelectedWarehouseId(null); // Đóng nếu đã mở
        } else {
            setSelectedWarehouseId(warehouse.id); // Mở hoặc chuyển sang hóa đơn khác
        }
    };

    const handleCloseWarehouseDetails = () => {
        setSelectedWarehouseId(null);
    };
    const handleDataSearch = (searchResult) => {
        // Cập nhật state của trang chính với dữ liệu từ tìm kiếm
        setWarehouseData(searchResult);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

    const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;
    useEffect(() => {
        getAllWarehouse()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => {
                        return dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss').diff(
                            dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'),
                        );
                    });
                    setWarehouseData(sortedData);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    return (
        <>
            <Helmet>
                <title> Quản lý kho</title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Quản lý kho
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() => setOpenOderForm(true)}
                    >
                        Thêm địa chỉ kho
                    </Button>
                    <Dialog fullWidth maxWidth="sm" open={openOderForm}>
                        <DialogTitle>
                            Tạo thêm kho{' '}
                            <IconButton style={{ float: 'right' }} onClick={handleCloseOdersForm}>
                                <CloseIcon color="primary" />
                            </IconButton>{' '}
                        </DialogTitle>
                        <CreateWarehouseForm onClose={handleCreateWarehouseSuccess} open={openOderForm} />
                    </Dialog>
                </Stack>

                <Card>
                    <WarehouseToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        onDataSearch={handleDataSearch}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <WarehouseListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={warehouseData.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {warehouseData.slice(startIndex, endIndex).map((warehouse) => {
                                        return (
                                            <React.Fragment key={warehouse.id}>
                                                <TableRow
                                                    hover
                                                    key={warehouse.id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={selectedWarehouseId === warehouse.id}
                                                    onClick={() => handleWarehouseClick(warehouse)}
                                                >
                                                    {/* <TableCell padding="checkbox">
                                                        <Checkbox
                                                            onChange={(event) => handleClick(event, warehouse.name)}
                                                        />
                                                    </TableCell> */}
                                                    {/* tên  */}
                                                    <TableCell align="left">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                            <Typography variant="subtitle2" noWrap>
                                                                {warehouse.name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    {/* mô tả */}
                                                    <TableCell align="left">{warehouse.address}</TableCell>
                                                    {/* trạng thái */}
                                                    <TableCell align="left">
                                                        <Label
                                                            color={
                                                                (warehouse.status === 'Inactive' && 'error') || 'success'
                                                            }
                                                        >
                                                            {(warehouse.status === 'Active') ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                                        </Label>
                                                    </TableCell>

                                                    {/* <TableCell align="right">
                                                        <IconButton
                                                            size="large"
                                                            color="inherit"
                                                            onClick={handleOpenMenu}
                                                        >
                                                            <Iconify icon={'eva:more-vertical-fill'} />
                                                        </IconButton>
                                                    </TableCell> */}
                                                </TableRow>
                                                {selectedWarehouseId === warehouse.id && (
                                                    <TableRow>
                                                        <TableCell colSpan={8}>
                                                            <WarehouseDetailForm
                                                                warehouses={warehouseData}
                                                                warehouseId={selectedWarehouseId}
                                                                updateWarehouseInList={updateWarehouseInList}
                                                                updateWarehouseStatusInList={updateWarehouseStatusInList}
                                                                onClose={handleCloseWarehouseDetails}
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
                        count={warehouseData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
            <SnackbarSuccess
                open={snackbarSuccessOpen}
                handleClose={() => setSnackbarSuccessOpen(false)}
                message={snackbarSuccessMessage}
                style={{ bottom: '16px', right: '16px' }}
            />
        </>
    );
};
export default WarehousePage;
