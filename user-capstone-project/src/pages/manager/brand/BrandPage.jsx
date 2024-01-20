import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

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
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CloseIcon from '@mui/icons-material/Close';

// sections
import { BrandListHead, BrandToolbar } from '~/sections/@dashboard/manager/brand';
// mock
import USERLIST from '../../../_mock/user';
import { getAllBrands } from '~/data/mutation/brand/brands-mutation';
import BrandForm from '~/sections/auth/manager/brand/CreateBrandForm';
import BrandDetailForm from '~/sections/auth/manager/brand/BrandDetailForm';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Tên', alignRight: false },
    { id: 'description', label: 'Mô tả', alignRight: false },
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

const BrandPage = () => {
    const [selectedBrandId, setSelectedBrandId] = useState(null);

    const [openOderForm, setOpenOderForm] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);
    // Search data
    const [displayedBrandData, setDisplayedBrandData] = useState([]);
    const [brandData, setBrandData] = useState([]);
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');

    useEffect(() => {
        getAllBrands()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => {
                        return dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss').diff(
                            dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'),
                        );
                    });
                    setBrandData(sortedData);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);
    //===========================================================================================

    const handleCreateBrandSuccess = (newBrand, successMessage) => {
        // Close the form
        setOpenOderForm(false);
        setBrandData((prevBrandData) => [...prevBrandData, newBrand]);

        setSnackbarSuccessMessage(successMessage === 'Create brand successfully' ? 'Tạo thương hiệu thành công!' : 'Thành công');
        setSnackbarSuccessOpen(true);

        setTimeout(() => {
            setSnackbarSuccessOpen(false);
            setSnackbarSuccessMessage('');
        }, 3000);
    };
    //===========================================================================================

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = brandData.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleBrandClick = (brand) => {
        if (selectedBrandId === brand.id) {
            console.log(selectedBrandId);
            setSelectedBrandId(null);
        } else {
            setSelectedBrandId(brand.id);
        }
    };

    const handleCloseBrandDetails = () => {
        setSelectedBrandId(null);
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

    const handleDataSearch = (searchResult) => {
        setBrandData(searchResult);
        setDisplayedBrandData(searchResult);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

    const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    return (
        <>
            <Helmet>
                <title> Quản lý thương hiệu | Minimal UI </title>
            </Helmet>


            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Quản lý thương hiệu
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={() => setOpenOderForm(true)}
                >
                    Thêm thương hiệu
                </Button>
                <Dialog fullWidth maxWidth="sm" open={openOderForm}>
                    <DialogTitle>
                        Tạo thương hiệu{' '}
                        <IconButton style={{ float: 'right' }} onClick={handleCloseOdersForm}>
                            <CloseIcon color="primary" />
                        </IconButton>{' '}
                    </DialogTitle>
                    <BrandForm onClose={handleCreateBrandSuccess} open={openOderForm} />
                </Dialog>
            </Stack>

            <Container sx={{ minWidth: 1500, }}>
                <Card>
                    <BrandToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        onDataSearch={handleDataSearch}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800, }}>
                            <Table>
                                <BrandListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={brandData.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {brandData.slice(startIndex, endIndex).map((brand) => {
                                        return (
                                            <React.Fragment key={brand.id}>
                                                <TableRow
                                                    hover
                                                    key={brand.id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={selectedBrandId === brand.id}
                                                    onClick={() => handleBrandClick(brand)}
                                                    style={{ height: 52 }}
                                                >
                                                    {/* <TableCell padding="checkbox">
                                                        <Checkbox
                                                            onChange={(event) => handleClick(event, brand.name)}
                                                        />
                                                    </TableCell> */}

                                                    {/* tên  */}
                                                    <TableCell align="left">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                            <Typography variant="subtitle2" noWrap>
                                                                {brand.name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                {brand.description}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                                {selectedBrandId === brand.id && (
                                                    <TableRow>
                                                        <TableCell colSpan={8}>
                                                            <BrandDetailForm
                                                                brands={brandData}
                                                                brandsId={selectedBrandId}
                                                                onClose={handleCloseBrandDetails}
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
                        count={brandData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
                <SnackbarSuccess
                    open={snackbarSuccessOpen}
                    handleClose={() => setSnackbarSuccessOpen(false)}
                    message={snackbarSuccessMessage}
                    style={{ bottom: '16px', right: '16px' }}
                />
            </Container>
        </>
    );
};
export default BrandPage;
