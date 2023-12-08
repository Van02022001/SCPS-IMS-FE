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
import Label from '~/components/label/Label';
import Iconify from '~/components/iconify/Iconify';
import Scrollbar from '~/components/scrollbar/Scrollbar';
import CloseIcon from '@mui/icons-material/Close';

// sections
import { ProductsListHead, ProductsListToolbar } from '~/sections/@dashboard/products';
// mock
import PRODUCTSLIST from '../../../_mock/products';
import CategoryForm from '~/sections/auth/manager/subCategory/CreateSubCategoryForm';
// api
import { getAllItems } from '~/data/mutation/items/item-mutation';
import ProductDetailForm from '~/sections/auth/manager/subCategory/SubCategoryDetailForm';
import EditCategoryForm from '~/sections/auth/manager/categories/EditCategoryForm';
import { getAllSubCategory } from '~/data/mutation/subCategory/subCategory-mutation';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'image', label: '', alignRight: false },
    { id: 'id', label: 'Mã hàng', alignRight: false },
    { id: 'name', label: 'Tên sản phẩm', alignRight: false },
    { id: 'description', label: 'Mô tả', alignRight: false },
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

const ItemsSalePage = () => {
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

    // State data và xử lý data
    const [itemsData, setItemsData] = useState([]);
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [productStatus, setProductStatus] = useState('');

    const [selectedProduct, setSelectedProduct] = useState(null);

    // Hàm để thay đổi data mỗi khi Edit xong api-------------------------------------------------------------
    const updateProductInList = (updatedProduct) => {
        const productIndex = itemsData.findIndex((product) => product.id === updatedProduct.id);

        if (productIndex !== -1) {
            const updatedProductData = [...itemsData];
            updatedProductData[productIndex] = updatedProduct;

            setItemsData(updatedProductData);
        }
    };

    const updateProductStatusInList = (productId, newStatus) => {
        const productIndex = itemsData.findIndex((product) => product.id === productId);

        if (productIndex !== -1) {
            const updatedProductData = [...itemsData];
            updatedProductData[productIndex].status = newStatus;

            setItemsData(updatedProductData);
        }
    };

    const handleCreateProductSuccess = (newProduct) => {
        // Close the form
        setOpenOderForm(false);
        setItemsData((prevProductData) => [...prevProductData, newProduct]);
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
            const newSelecteds = itemsData.map((n) => n.name);
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
        const sortedProduct = [...itemsData].sort((a, b) => {
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

    const handleCloseOdersForm = () => {
        setOpenOderForm(false);
    };

    const handleCloseEditsForm = () => {
        setOpenEditForm(false);
    };



    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PRODUCTSLIST.length) : 0;

    const filteredUsers = applySortFilter(PRODUCTSLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    useEffect(() => {
        getAllSubCategory()
            .then((response) => {
                const data = response.data;
                if (Array.isArray(data)) {
                    setSubCategoryData(data);

                } else {
                    console.error('API response does not contain an array:', response.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching items:', error);
            });

    }, []);
    console.log(subCategoryData);


    return (
        <>
            <Helmet>
                <title> Danh sách sản phẩm</title>
            </Helmet>

            {/* <Container> */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Danh sách sản phẩm
                </Typography>
            </Stack>

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
                                rowCount={itemsData.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {subCategoryData?.map((subCategory) => {
                                    return (
                                        <React.Fragment key={subCategory.id}>
                                            <TableRow
                                                hover
                                                key={subCategory.id}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={selectedProductId === subCategory.id}
                                                onClick={() => handleProductClick(subCategory)}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedProductId === subCategory.id}
                                                        // onChange={(event) => handleCheckboxChange(event, subCategory.id)}
                                                        // checked={selectedUser}
                                                        onChange={(event) => handleClick(event, subCategory.name)}
                                                    />
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">
                                                    <Typography variant="subtitle2" noWrap>
                                                        {subCategory.id}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                        <Typography variant="subtitle2" noWrap>
                                                            {subCategory.name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">
                                                    <Typography variant="subtitle2" noWrap>
                                                        {subCategory.description}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography variant="subtitle2" noWrap>
                                                        {subCategory.categories.map((category, index) => {
                                                            return index === subCategory.categories.length - 1
                                                                ? category.name
                                                                : `${category.name}, `;
                                                        })}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Label color={(subCategory.status === 'Inactive' && 'error') || 'success'}>
                                                        {(subCategory.status === 'Active') ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                                    </Label>
                                                </TableCell>




                                            </TableRow>

                                            {selectedProductId === subCategory.id && (
                                                <TableRow>
                                                    <TableCell colSpan={8}>
                                                        <ProductDetailForm
                                                            products={itemsData}
                                                            productStatus={productStatus}
                                                            productId={selectedProductId}
                                                            updateProductInList={updateProductInList}
                                                            updateProductStatusInList={updateProductStatusInList}
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
                <MenuItem onClick={() => setOpenEditForm(true)}>
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                    Edit
                </MenuItem>
                <Dialog fullWidth maxWidth open={openEditForm}>
                    <DialogTitle>
                        Cập Nhật Sản Phẩm{' '}
                        <IconButton style={{ float: 'right' }} onClick={handleCloseEditsForm}>
                            <CloseIcon color="primary" />
                        </IconButton>{' '}
                    </DialogTitle>
                    <EditCategoryForm
                        open={openEditForm}
                        product={selectedProduct}
                        handleClose={handleCloseEditsForm}
                    />
                </Dialog>

                <MenuItem sx={{ color: 'error.main' }}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Popover>
        </>
    );
};
export default ItemsSalePage;
