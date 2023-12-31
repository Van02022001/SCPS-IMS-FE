import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';

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
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
} from '@mui/material';
// components
import Label from '~/components/label/Label';
import Iconify from '~/components/iconify/Iconify';
import Scrollbar from '~/components/scrollbar/Scrollbar';
import CloseIcon from "@mui/icons-material/Close"

// sections
import { ProductsListHead } from '../../../sections/@dashboard/products';
// mock
import PRODUCTSLIST from '../../../_mock/products';
import CategoryForm from '~/sections/auth/manager/subCategory/CreateSubCategoryForm';
import ProductsPriceToolbar from '~/sections/@dashboard/products/productsPrice/ProductsPriceToolbar';
import { getAllPriceAudit } from '~/data/mutation/price/price_mutation';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    // { id: 'image', label: '', alignRight: false },
    { id: 'name', label: 'Tên sản phẩm', alignRight: false },
    { id: 'changedBy', label: 'Người tạo', alignRight: false },
    { id: 'oldPrice', label: 'Giá cũ', alignRight: false },
    { id: 'newPrice', label: 'Giá mới', alignRight: false },
    { id: 'changeDate', label: 'Ngày cập nhập', alignRight: false },
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

const ProductsPricePage = () => {
    const [open, setOpen] = useState(null);

    const [openOderForm, setOpenOderForm] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [priceAudit, setPriceAudit] = useState([]);
    const [selectedPriceId, setSelectedPriceId] = useState([]);
    //filter---------------------------------------------------------------------------
    //----------------------------------------------------------------
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
            const newSelecteds = PRODUCTSLIST.map((n) => n.name);
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

    const handlePriceClick = (price) => {
        console.log(price);
        if (selectedPriceId === price.id) {
            setSelectedPriceId(null);
        } else {
            setSelectedPriceId(price.id);
        }
    };

    useEffect(() => {
        getAllPriceAudit()
            .then((respone) => {
                const data = respone;
                if (Array.isArray(data)) {
                    setPriceAudit(data);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching:', error);
            });
    }, []);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PRODUCTSLIST.length) : 0;

    const filteredUsers = applySortFilter(PRODUCTSLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    return (
        <>
            <Helmet>
                <title> Quản lý sản phẩm | Minimal UI </title>
            </Helmet>

            {/* <Container> */}
            <div>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Bảng giá chung
                    </Typography>
                    {/* <Button
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() => setOpenOderForm(true)}
                    >
                        Thêm Sản Phẩm
                    </Button>
                    <Dialog fullWidth maxWidth open={openOderForm}>
                        <DialogTitle>
                            Tạo Sản Phẩm{' '}
                            <IconButton style={{ float: 'right' }} onClick={handleCloseOdersForm}>
                                <CloseIcon color="primary" />
                            </IconButton>{' '}
                        </DialogTitle>
                        <CategoryForm />
                    </Dialog> */}
                </Stack>
                <Card>
                    <ProductsPriceToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <ProductsListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={priceAudit.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {priceAudit.map((price) => {
                                        return (
                                            <React.Fragment key={price.id}>
                                                <TableRow
                                                    hover
                                                    key={price.id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={selectedPriceId === price.id}
                                                    onClick={() => handlePriceClick(price)}
                                                >
                                                    {/* <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selectedUser}
                                                            onChange={(event) => handleClick(event, name)}
                                                        />
                                                    </TableCell> */}

                                                    <TableCell align="left">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                {price.itemName}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">{price.changedBy}</TableCell>
                                                    <TableCell align="left">{price.oldPrice}</TableCell>
                                                    <TableCell align="left">{price.newPrice}</TableCell>
                                                    <TableCell align="left">{price.changeDate}</TableCell>
                                                </TableRow>
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
                        count={PRODUCTSLIST.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card >
                {/* </Container> */}


            </div >
        </>
    );
};
export default ProductsPricePage;
