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
import CloseIcon from '@mui/icons-material/Close';

// sections
import { UserListHead, UserListToolbar } from '../../../sections/@dashboard/user';
// mock
import USERLIST from '../../../_mock/user';
import { getAllCategories } from '~/data/mutation/categories/categories-mutation';
// form validation
import CategoryDetailForm from '~/sections/auth/categories/CategoryDetailForm';
import CreateCategoriesForm from '~/sections/auth/categories/CreateCategoryForm';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Tên', alignRight: false },
    { id: 'company', label: 'Mô tả', alignRight: false },
    { id: 'role', label: 'Ngày tạo', alignRight: false },
    { id: 'isVerified', label: 'Ngày cập nhật', alignRight: false },
    { id: 'status', label: 'Trạng thái', alignRight: false },
    { id: '' },
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

const CategoryPage = () => {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const [open, setOpen] = useState(null);

    const [openOderForm, setOpenOderForm] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [categoryData, setCategoryData] = useState([]);
    const [categoryStatus, setCategoryStatus] = useState('');

    // Hàm để thay đổi data mỗi khi Edit xong api-------------------------------------------------------------
    const updateCategoryInList = (updatedCategory) => {
        const categoryIndex = categoryData.findIndex((category) => category.id === updatedCategory.id);

        if (categoryIndex !== -1) {
            const updatedCategoryData = [...categoryData];
            updatedCategoryData[categoryIndex] = updatedCategory;

            setCategoryData(updatedCategoryData);
        }
    };

    const updateCategoryStatusInList = (categoryId, newStatus) => {
        const categoryIndex = categoryData.findIndex((category) => category.id === categoryId);

        if (categoryIndex !== -1) {
            const updatedCategoryData = [...categoryData];
            updatedCategoryData[categoryIndex].status = newStatus;

            setCategoryData(updatedCategoryData);
        }
    };

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

    const handleCategoryClick = (category) => {
        if (selectedCategoryId === category.id) {
            console.log(selectedCategoryId);
            setSelectedCategoryId(null); // Đóng nếu đã mở
        } else {
            setSelectedCategoryId(category.id); // Mở hoặc chuyển sang hóa đơn khác
        }
    };

    const handleCloseCategoryDetails = () => {
        setSelectedCategoryId(null);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

    const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;
    useEffect(() => {
        getAllCategories()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    setCategoryData(data);
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
                <title> Quản lý thể loại | Minimal UI </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Quản lý thể loại
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() => setOpenOderForm(true)}
                    >
                        Thêm thể loại
                    </Button>
                    <Dialog fullWidth maxWidth="sm" open={openOderForm}>
                        <DialogTitle>
                            Tạo Thể Loại{' '}
                            <IconButton style={{ float: 'right' }} onClick={handleCloseOdersForm}>
                                <CloseIcon color="primary" />
                            </IconButton>{' '}
                        </DialogTitle>
                        <CreateCategoriesForm />
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
                                    {/* {filteredUsers
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            const { id, name, role, status, company, avatarUrl, isVerified } = row;
                                            const selectedUser = selected.indexOf(name) !== -1; */}
                                    {categoryData.map((category) => {
                                        return (
                                            <React.Fragment key={category.id}>
                                                <TableRow
                                                    hover
                                                    key={category.id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={selectedCategoryId === category.id}
                                                    onClick={() => handleCategoryClick(category)}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            onChange={(event) => handleClick(event, category.name)}
                                                        />
                                                    </TableCell>
                                                    {/* tên  */}
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                            <Typography variant="subtitle2" noWrap>
                                                                {category.name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    {/* mô tả */}
                                                    <TableCell align="left">{category.description}</TableCell>
                                                    {/* ngày tạo */}
                                                    <TableCell align="left">{category.createdAt}</TableCell>
                                                    {/* ngày cập nhật */}
                                                    <TableCell align="left">{category.updatedAt}</TableCell>
                                                    {/* trạng thái */}
                                                    <TableCell align="left">
                                                        <Label
                                                            color={
                                                                (category.status === 'Inactive' && 'error') || 'success'
                                                            }
                                                        >
                                                            {(category.status === 'Active') ? 'Đang hoạt động' : 'Ngừng hoạt động'}
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

                                                {selectedCategoryId === category.id && (
                                                    <TableRow>
                                                        <TableCell colSpan={8}>
                                                            <CategoryDetailForm
                                                                categories={categoryData}
                                                                categoryStatus={categoryStatus}
                                                                categoriesId={selectedCategoryId}
                                                                updateCategoryInList={updateCategoryInList}
                                                                updateCategoryStatusInList={updateCategoryStatusInList}
                                                                onClose={handleCloseCategoryDetails}
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
};
export default CategoryPage;
