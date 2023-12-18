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
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    TableContainer,
    TablePagination,
} from '@mui/material';
// components
import Label from '~/components/label/Label';
import Iconify from '~/components/iconify/Iconify';
import Scrollbar from '~/components/scrollbar/Scrollbar';
import CloseIcon from '@mui/icons-material/Close';

// sections
import { SubCategoryInventoryListHead, SubCategoryInventoryToolbar } from '~/sections/@dashboard/inventoryStaff/subCategory';
// mock
import PRODUCTSLIST from '../../../_mock/products';
import SubCategoryInventoryDetailForm from '~/sections/auth/inventory_staff/subcategoryInventory/SubCategoryInventoryDetailForm';
// api
import { getAllSubCategory } from '~/data/mutation/subCategory/subCategory-mutation';
import { getAllCategories } from '~/data/mutation/categories/categories-mutation';
// filter
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';






// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'image', label: '', alignRight: false },
    { id: 'name', label: 'Tên sản phẩm', alignRight: false },
    { id: 'description', label: 'Mô tả', alignRight: false },
    { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
    { id: 'categories', label: 'Nhóm hàng', alignRight: false },
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

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

const SubCategoryInventoryPage = () => {
    // State mở các form----------------------------------------------------------------
    const [open, setOpen] = useState(null);
    const [openOderForm, setOpenOderForm] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false);

    const [selected, setSelected] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState([]);

    // State cho phần soft theo name-------------------------------------------------------
    const [filterName, setFilterName] = useState('');
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState("name");
    const [order, setOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortedProduct, setSortedProduct] = useState([]);

    const [rowsPerPage, setRowsPerPage] = useState(5);
    //--------------------Filter------------------------
    const [selectedCategories, setSelectedCategories] = React.useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const filterCategories = categoryData.map((category) => category.name);

    // State data và xử lý data
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [productStatus, setProductStatus] = useState('');

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [displayedSubCategoryData, setDisplayedSubCategoryData] = useState([]);
    // fiter createdAt //
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Hàm để thay đổi data mỗi khi Edit xong api-------------------------------------------------------------
    const updateSubCategoryInList = (updatedSubCategory) => {
        const subCategoryIndex = subCategoryData.findIndex((subCategory) => subCategory.id === updatedSubCategory.id);

        if (subCategoryIndex !== -1) {
            const updatedSubCategoryData = [...subCategoryData];
            updatedSubCategoryData[subCategoryIndex] = updatedSubCategory;

            setSubCategoryData(updatedSubCategoryData);
        }
    };

    const updateSubCategoryStatusInList = (subCategoryId, newStatus) => {
        const subCategoryIndex = subCategoryData.findIndex((subCategory) => subCategory.id === subCategoryId);

        if (subCategoryIndex !== -1) {
            const updatedSubCategoryData = [...subCategoryData];
            updatedSubCategoryData[subCategoryIndex].status = newStatus;

            setSubCategoryData(updatedSubCategoryData);
        }
    };

    const handleCreateProductSuccess = (newProduct) => {
        // Close the form
        setOpenOderForm(false);
        setSubCategoryData((prevProductData) => [...prevProductData, newProduct]);
    };

    //----------------------------------------------------------------
    const handleOpenMenu = (event, product) => {
        setSelectedProduct(product);
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };


    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = subCategoryData.map((n) => n.name);
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

    const handleProductClick = (product) => {
        if (selectedProductId === product.id) {
            setSelectedProductId(null); // Đóng nếu đã mở
        } else {
            setSelectedProductId(product.id); // Mở hoặc chuyển sang sản phẩm khác
        }
    };

    const handleCloseProductDetails = () => {
        setSelectedProductId(null);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };
    // Các hàm xử lý soft theo name--------------------------------------------------------------------------------------------------------------------------------
    const handleCheckboxChange = (event, productId) => {
        if (event.target.checked) {
            // Nếu người dùng chọn checkbox, thêm sản phẩm vào danh sách đã chọn.
            setSelectedProductId([...selectedProductId, productId]);
        } else {
            // Nếu người dùng bỏ chọn checkbox, loại bỏ sản phẩm khỏi danh sách đã chọn.
            setSelectedProductId(selectedProductId.filter((id) => id !== productId));
        }
    };
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        // Sắp xếp danh sách sản phẩm dựa trên trường và hướng đã chọn
        const sortedProduct = [...subCategoryData].sort((a, b) => {
            const valueA = a[property];
            const valueB = b[property];
            if (valueA < valueB) {
                return isAsc ? -1 : 1;
            }
            if (valueA > valueB) {
                return isAsc ? 1 : -1;
            }
            return 0;
        });
        setSortedProduct(sortedProduct);
    };

    const handleFilterByName = (event) => {
        setPage(0);
        const query = event.target.value;
        setFilterName(query);

        const filteredUsers = applySortFilter(sortedProduct, getComparator(order, sortBy), query);
        setSortedProduct(filteredUsers)
    };
    const handleDataSearch = (searchResult) => {
        setSubCategoryData(searchResult);
        setDisplayedSubCategoryData(searchResult)
    };
    //==============================* filter *==============================
    const applyFilters = (sub_category) => {
        const isCategoriesMatch =
            !selectedCategories ||
            selectedCategories.length === 0 ||
            (Array.isArray(sub_category.categories) &&
                sub_category.categories.some((categories) => selectedCategories.includes(categories.name))) ||
            (!Array.isArray(sub_category.categories) && selectedCategories.includes(sub_category.categories.name));

        const isDateInRange =
            (!startDate ||
                dayjs(sub_category.createdAt, 'DD/MM/YYYY HH:mm:ss').isSameOrAfter(dayjs(startDate), 'day')) &&
            (!endDate || dayjs(sub_category.createdAt, 'DD/MM/YYYY HH:mm:ss').isSameOrBefore(dayjs(endDate), 'day'));

        return isCategoriesMatch && isDateInRange;
    };

    const filteredSubcate = subCategoryData.filter(applyFilters);
    //==============================* filter *==============================

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PRODUCTSLIST.length) : 0;

    const filteredUsers = applySortFilter(PRODUCTSLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    useEffect(() => {
        getAllSubCategory()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => {
                        return dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss').diff(
                            dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'),
                        );
                    });
                    setSubCategoryData(sortedData);
                    setSortedProduct(sortedData);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
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
                <title> Quản lý sản phẩm | Minimal UI </title>
            </Helmet>

            {/* <Container> */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Quản lý danh mục
                </Typography>
            </Stack>

            <Card>
                <SubCategoryInventoryToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                    onDataSearch={handleDataSearch}
                />

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <SubCategoryInventoryListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={subCategoryData.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {subCategoryData.map((product) => {
                                    return (
                                        <React.Fragment key={product.id}>
                                            <TableRow
                                                hover
                                                key={product.id}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={selectedProductId === product.id}
                                                onClick={() => handleProductClick(product)}
                                            >
                                                {/* <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedProductId === product.id}
                                                        // onChange={(event) => handleCheckboxChange(event, product.id)}
                                                        // checked={selectedUser}
                                                        onChange={(event) => handleClick(event, product.name)}
                                                    />
                                                </TableCell> */}

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                    </Stack>
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                        <Typography variant="subtitle2" noWrap>
                                                            {product.name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="left">{product.description}</TableCell>
                                                <TableCell align="left">{product.createdAt}</TableCell>
                                                <TableCell align="left">
                                                    <Typography variant="subtitle2" noWrap>
                                                        {product.categories.map((category, index) => {
                                                            return index === product.categories.length - 1
                                                                ? category.name
                                                                : `${category.name}, `;
                                                        })}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Label color={(product.status === 'Inactive' && 'error') || 'success'}>
                                                        {(product.status === 'Active') ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                                    </Label>
                                                </TableCell>
                                            </TableRow>

                                            {selectedProductId === product.id && (
                                                <TableRow>
                                                    <TableCell colSpan={8}>
                                                        <SubCategoryInventoryDetailForm
                                                            subCategory={subCategoryData}
                                                            subCategorytatus={productStatus}
                                                            subCategoryId={selectedProductId}
                                                            updateSubCategoryInList={updateSubCategoryInList}
                                                            updateSubCategoryStatusInList={updateSubCategoryStatusInList}
                                                            onClose={handleCloseProductDetails} />
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
                    count={PRODUCTSLIST.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </>
    );
};
export default SubCategoryInventoryPage;
