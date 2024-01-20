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
    Checkbox,
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
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CloseIcon from '@mui/icons-material/Close';

// sections

// mock
import USERLIST from '../../../_mock/user';
import { getAllOrigins } from '~/data/mutation/origins/origins-mutation';
import OriginDetailForm from '~/sections/auth/manager/origin/OriginDetailForm';
import CreateOriginForm from '~/sections/auth/manager/origin/CreateOriginForm';
import dayjs from 'dayjs';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import { UnitListHead, UnitToolbar } from '~/sections/@dashboard/manager/unit';

// ------------------------------OriginToolbar----------------------------------------

const TABLE_HEAD = [{ id: 'name', label: 'Tên nguồn', alignRight: false },];

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

const OriginPage = () => {
    const [selectedOriginId, setSelectedOriginId] = useState(null);

    const [open, setOpen] = useState(null);

    const [openCreateOriginForm, setOpenCreateOriginForm] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [originData, setOriginData] = useState([]);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');

    useEffect(() => {
        getAllOrigins()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => {
                        return dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss').diff(
                            dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'),
                        );
                    });
                    setOriginData(data);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = originData.map((n) => n.name);
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

    const handleOriginClick = (origin) => {
        if (selectedOriginId === origin.id) {
            console.log(selectedOriginId);
            setSelectedOriginId(null);
        } else {
            setSelectedOriginId(origin.id);
        }
    };

    const handleCloseOriginDetails = () => {
        setSelectedOriginId(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }
    const handleCloseOdersForm = () => {
        setOpenCreateOriginForm(false);
    };

    const handleCreateCategorySuccess = (newOrigin, successMessage) => {
        // Close the form
        setOpenCreateOriginForm(false);
        setOriginData((prevOriginData) => [...prevOriginData, newOrigin]);
        // Show success message
        setSnackbarSuccessMessage(successMessage === 'Create origin successfully' ? 'Tạo xuất xứ thành công!' : 'Thành công');
        setSnackbarSuccessOpen(true);

        setTimeout(() => {
            setSnackbarSuccessOpen(false);
            setSnackbarSuccessMessage('');
        }, 3000);
    };
    //=========================Phân trang số lượng==========================
    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };
    //============================================================================
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - originData.length) : 0;

    const filteredUsers = applySortFilter(originData, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    return (
        <>
            <Helmet>
                <title> Quản lý xuất xứ | Minimal UI </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Quản lý xuất xứ
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() => setOpenCreateOriginForm(true)}
                    >
                        Thêm xuất xứ
                    </Button>
                    <Dialog fullWidth maxWidth="sm" open={openCreateOriginForm}>
                        <DialogTitle>
                            Tạo xuất xứ{' '}
                            <IconButton style={{ float: 'right' }} onClick={handleCloseOdersForm}>
                                <CloseIcon color="primary" />
                            </IconButton>{' '}
                        </DialogTitle>
                        <CreateOriginForm onClose={handleCreateCategorySuccess} open={openCreateOriginForm} />
                    </Dialog>
                </Stack>

                <Card>
                    {/* <OriginToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                    /> */}

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UnitListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={originData.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {originData.slice(startIndex, endIndex).map((origin) => {
                                        return (
                                            <React.Fragment key={origin.id}>
                                                <TableRow
                                                    hover
                                                    key={origin.id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={selectedOriginId === origin.id}
                                                    onClick={() => handleOriginClick(origin)}
                                                >
                                                    {/* <TableCell padding="checkbox">
                                                        <Checkbox
                                                            onChange={(event) => handleClick(event, origin.name)}
                                                        />
                                                    </TableCell> */}

                                                    {/* tên  */}
                                                    <TableCell align="left">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                            <Typography variant="subtitle2" noWrap>
                                                                {origin.name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                                {selectedOriginId === origin.id && (
                                                    <TableRow>
                                                        <TableCell colSpan={8}>
                                                            <OriginDetailForm
                                                                origins={originData}
                                                                originsId={selectedOriginId}
                                                                onClose={handleCloseOriginDetails}
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
                        count={originData.length}
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
export default OriginPage;
