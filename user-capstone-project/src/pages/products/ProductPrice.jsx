import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
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
    Menu,
    Grid,
    TextField,
    FormControl,
} from '@mui/material';
// components
import Label from '~/components/label/Label';
import Iconify from '~/components/iconify/Iconify';
import Scrollbar from '~/components/scrollbar/Scrollbar';
import CloseIcon from "@mui/icons-material/Close"

// sections
import { ProductsListHead, ProductsListToolbar } from '../../sections/@dashboard/products';
// mock
import PRODUCTSLIST from '../../_mock/products';
import CategoryForm from '~/sections/@dashboard/categories/CategoryForm';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'image', label: '', alignRight: false },
    { id: 'id', label: 'Mã hàng', alignRight: false },
    { id: 'name', label: 'Tên sản phẩm', alignRight: false },
    { id: 'price', label: 'Giá vốn', alignRight: false },
    { id: 'price', label: 'Giá nhập cuối', alignRight: false },
    { id: 'price', label: 'Giá chung', alignRight: false },
    { id: '' },
];
const filterPrice = [
    'Biểu đồ',
    'Báo cáo',

];
const filterOptions = [
    'Xuất nhập tồn',
    'Giá trị kho',
    'Xuất nhập tồn chi tiết',
];
const filterSale = [
    'Giá bán',
    '--Giá so sánh--',
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
    //filter---------------------------------------------------------------------------
    const [anchorElPrice, setAnchorElPrice] = useState(null);
    const [anchorElOptions, setAnchorElOptions] = useState(null);
    const [anchorElSale, setAnchorElSale] = useState(null);
    const [selectedFilterPrice, setSelectedFilterPrice] = useState(null);
    const [selectedFilterOptions, setSelectedFilterOptions] = useState(null);
    const [selectedFilterSale, setSelectedFilterSale] = useState(null);
    const [openCreatePricePopup, setOpenCreatePricePopup] = useState(false);

    const handleCloseCreatePricePopup = () => {
        setOpenCreatePricePopup(false);
    };
    const handleFilterPriceClick = (event) => {
        setAnchorElPrice(event.currentTarget);
    };

    const handleFilterOptionsClick = (event) => {
        setAnchorElOptions(event.currentTarget);
    };

    const handleFilterSaleClick = (event) => {
        setAnchorElSale(event.currentTarget);
    };

    //Handle filter
    const handleMenuPriceClick = (filter) => {
        setSelectedFilterPrice(filter);
        setAnchorElPrice(null);
    };

    const handleMenuOptionsClick = (filter) => {
        setSelectedFilterOptions(filter);
        setAnchorElOptions(null);
    };

    const handleMenuSaleClick = (filter) => {
        setSelectedFilterSale(filter);
        setAnchorElSale(null);
    };
    const handleClose = () => {
        setAnchorElPrice(null);
        setAnchorElOptions(null);
        setAnchorElSale(null);
    };
    //----------------------------------------------------------------
    const handleCreatePrice = () => {
        setOpenCreatePricePopup(true);
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

    const handleCloseOdersForm = () => {
        setOpenOderForm(false);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PRODUCTSLIST.length) : 0;

    const filteredUsers = applySortFilter(PRODUCTSLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    return (
        <>
            <Helmet>
                <title> Quản lý sản phẩm | Minimal UI </title>
            </Helmet>

            {/* <Container> */}
            <div style={{ backgroundColor: '#f6f6f6' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Bảng giá chung
                    </Typography>


                    <Button
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
                    </Dialog>
                </Stack>
                <Grid container>
                    <Grid container item xs={2}>
                        <FormControl variant="outlined" style={{ marginTop: 10, height: 200, backgroundColor: 'white' }}>
                            {selectedFilterPrice || <Typography style={{ marginBottom: 10, }}>Bảng giá  <Button startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreatePrice} style={{ marginLeft: 10 }}></Button></Typography>}
                            <TextField type="text" id="standard-basic" label="Chọn bảng giá..." variant="standard" />
                        </FormControl>
                        {openCreatePricePopup && (
                            <Dialog open={openCreatePricePopup} onClose={handleCloseCreatePricePopup}>
                                <DialogTitle>
                                    Tạo Bảng Giá{' '}
                                    <IconButton style={{ float: 'right' }} onClick={handleCloseCreatePricePopup}>
                                        <CloseIcon color="primary" />
                                    </IconButton>{' '}
                                </DialogTitle>
                                {/* Nội dung của popup để tạo bảng giá ở đây */}
                            </Dialog>
                        )}
                    </Grid>

                    {/* <Grid item xs={2}>
                    <Menu
                        anchorEl={anchorElPrice}
                        open={Boolean(anchorElPrice)}
                        onClose={handleClose}
                    >
                        {filterPrice.map((filter, index) => (
                            <MenuItem key={index} onClick={() => handleMenuPriceClick(filter)}>
                                {filter}
                            </MenuItem>
                        ))}
                    </Menu>
                </Grid> */}

                    <Grid item xs={2}>
                        <Button variant="outlined" onClick={handleFilterOptionsClick}>
                            {selectedFilterOptions || 'Nhóm hàng'}
                        </Button>

                        <Menu
                            anchorEl={anchorElOptions}
                            open={Boolean(anchorElOptions)}
                            onClose={handleClose}
                        >
                            {filterOptions.map((filter, index) => (
                                <MenuItem key={index} onClick={() => handleMenuOptionsClick(filter)}>
                                    {filter}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" onClick={handleFilterSaleClick}>
                            {selectedFilterSale || 'Thời gian'}
                        </Button>

                        <Menu
                            anchorEl={anchorElSale}
                            open={Boolean(anchorElSale)}
                            onClose={handleClose}
                        >
                            {filterSale.map((filter, index) => (
                                <MenuItem key={index} onClick={() => handleMenuSaleClick(filter)}>
                                    {filter}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Grid>

                </Grid>
                <Card>
                    <ProductsListToolbar
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
                                    rowCount={PRODUCTSLIST.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            const { id, image, name, role, status, company, avatarUrl, isVerified } = row;
                                            const selectedUser = selected.indexOf(name) !== -1;

                                            return (
                                                <TableRow
                                                    hover
                                                    key={id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={selectedUser}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selectedUser}
                                                            onChange={(event) => handleClick(event, name)}
                                                        />
                                                    </TableCell>

                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Avatar alt={name} src={avatarUrl} />
                                                        </Stack>
                                                    </TableCell>

                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                            <Typography variant="subtitle2" noWrap>
                                                                {name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>

                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                            <Typography variant="subtitle2" noWrap>
                                                                {name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>

                                                    <TableCell align="left">{company}</TableCell>

                                                    <TableCell align="left">{role}</TableCell>

                                                    <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>

                                                    <TableCell align="left">
                                                        <Label color={(status === 'banned' && 'error') || 'success'}>
                                                            {sentenceCase(status)}
                                                        </Label>
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <IconButton
                                                            size="large"
                                                            color="inherit"
                                                            onClick={handleOpenMenu}
                                                        >
                                                            <Iconify icon={'eva:more-vertical-fill'} />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
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
                </Card>
                {/* </Container> */}

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
            </div >
        </>
    );
};
export default ProductsPricePage;
