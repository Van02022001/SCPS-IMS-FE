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
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    Dialog,
    DialogTitle,
    Container,
} from '@mui/material';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CloseIcon from '@mui/icons-material/Close';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
// sections
import { CategoryListHead, CategoryToolbar } from '~/sections/@dashboard/manager/category';
// mock
// import USERLIST from '../../../_mock/user';
import { getAllCategories } from '~/data/mutation/categories/categories-mutation';
// form validation
import CategoryDetailForm from '~/sections/auth/manager/categories/CategoryDetailForm';
import CreateCategoriesForm from '~/sections/auth/manager/categories/CreateCategoryForm';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Tên', alignRight: false },
    { id: 'description', label: 'Mô tả', alignRight: false },
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

const CategoryPage = () => {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // const [open, setOpen] = useState(null);

    const [openCreateCategoryForm, setOpenCreateCategoryForm] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [categoryData, setCategoryData] = useState([]);

    const [categoryStatus, setCategoryStatus] = useState('');

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');
    //=============================================== Hàm để thay đổi data mỗi khi Edit xong api===============================================
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
    const handleCreateCategorySuccess = (newCategory, successMessage) => {
        setOpenCreateCategoryForm(false);
        setCategoryData((prevCategoryData) => [...prevCategoryData, newCategory]);

        // Show success message
        setSnackbarSuccessMessage(
            successMessage === 'Create category successfully' ? 'Tạo thể loại thành công!' : 'Thành công',
        );
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
            const newSelecteds = categoryData.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };


    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleCloseOdersForm = () => {
        setOpenCreateCategoryForm(false);
    };

    const handleCategoryClick = (category) => {
        if (selectedCategoryId === category.id) {
            console.log(selectedCategoryId);
            setSelectedCategoryId(null);
        } else {
            setSelectedCategoryId(category.id);
        }
    };

    const handleCloseCategoryDetails = () => {
        setSelectedCategoryId(null);
    };
    //Search
    const handleDataSearch = (searchResult) => {
        setCategoryData(searchResult);
    };

    // ======================================item dưới chỗ page======================================
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categoryData.length) : 0;

    const filteredUsers = applySortFilter(categoryData, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    useEffect(() => {
        getAllCategories()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => {
                        return dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss').diff(
                            dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'),
                        );
                    });
                    setCategoryData(sortedData);
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

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Quản lý thể loại
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={() => setOpenCreateCategoryForm(true)}
                >
                    Thêm thể loại
                </Button>
                <Dialog fullWidth maxWidth="sm" open={openCreateCategoryForm}>
                    <DialogTitle>
                        Tạo Thể Loại{' '}
                        <IconButton style={{ float: 'right' }} onClick={handleCloseOdersForm}>
                            <CloseIcon color="primary" />
                        </IconButton>{' '}
                    </DialogTitle>
                    <CreateCategoriesForm onClose={handleCreateCategorySuccess} open={openCreateCategoryForm} />
                </Dialog>
            </Stack>

            <Container sx={{ minWidth: 1500 }}>
                <Card>
                    <CategoryToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        onDataSearch={handleDataSearch}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <CategoryListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={categoryData.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {categoryData.slice(startIndex, endIndex).map((category) => {
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
                                                    {/* <TableCell padding="checkbox">
                                                        <Checkbox
                                                            onChange={(event) => handleClick(event, category.name)}
                                                        />
                                                    </TableCell> */}
                                                    {/* tên  */}
                                                    <TableCell align="left">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                            <Typography variant="subtitle2" noWrap>
                                                                {category.name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    {/* mô tả */}
                                                    <TableCell align="left">
                                                        {category.description
                                                            ? category.description.length > 25
                                                                ? `${category.description.slice(0, 25)}...`
                                                                : category.description
                                                            : 'Không có mô tả'}
                                                    </TableCell>

                                                    {/* trạng thái */}
                                                    <TableCell align="left">
                                                        <Label
                                                            color={
                                                                (category.status === 'Inactive' && 'error') || 'success'
                                                            }
                                                        >
                                                            {category.status === 'Active'
                                                                ? 'Đang hoạt động'
                                                                : 'Ngừng hoạt động'}
                                                        </Label>
                                                    </TableCell>
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
                        count={categoryData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
            {/* Snackbar for success message */}
            <SnackbarSuccess
                open={snackbarSuccessOpen}
                handleClose={() => setSnackbarSuccessOpen(false)}
                message={snackbarSuccessMessage}
                style={{ bottom: '16px', right: '16px' }}
            />
        </>
    );
};
export default CategoryPage;
