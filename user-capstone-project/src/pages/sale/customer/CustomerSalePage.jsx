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
    TableRow,
    TableBody,
    TableCell,
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
import { CustomerSaleListHead, CustomerSaleToolbar } from '~/sections/@dashboard/sale/customer';
import CreateCustomerForm from '~/sections/auth/sale/manageCustomer/CreateCustomerForm';
import CustomerDetailForm from '~/sections/auth/sale/manageCustomer/CustomerDetailForm';
// mock
import PRODUCTSLIST from '../../../_mock/products';
// api
import { getAllCustomer } from '~/data/mutation/customer/customer-mutation';
import dayjs from 'dayjs';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'image', label: '', alignRight: false },
    { id: 'id', label: 'Mã khách hàng', alignRight: false },
    { id: 'name', label: 'Tên khách hàng', alignRight: false },
    { id: 'phone', label: 'Số điện thoại', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'taxCode', label: 'Mã thuế', alignRight: false },
    { id: 'address', label: 'Địa chỉ', alignRight: false },
    { id: 'type', label: 'Hình thức', alignRight: false },
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

// function formatDate(dateString) {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();

//     return `${day}/${month}/${year}`;
// }

const CustomerSalePage = () => {
    // State mở các form----------------------------------------------------------------
    const [open, setOpen] = useState(null);
    const [openOderForm, setOpenOderForm] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false);

    const [selected, setSelected] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState([]);

    // State cho phần soft theo name-------------------------------------------------------
    const [filterName, setFilterName] = useState('');
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState("name");
    const [order, setOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortedProduct, setSortedProduct] = useState([]);

    const [rowsPerPage, setRowsPerPage] = useState(5);

    // State data và xử lý data
    const [customerData, setCustomerData] = useState([]);

    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Hàm để thay đổi data mỗi khi Edit xong api-------------------------------------------------------------
    const updateProductInList = (updatedProduct) => {
        const productIndex = customerData.findIndex((product) => product.id === updatedProduct.id);

        if (productIndex !== -1) {
            const updatedProductData = [...customerData];
            updatedProductData[productIndex] = updatedProduct;

            setCustomerData(updatedProductData);
        }
    };

    const updateCustomerStatusInList = (customerId, newStatus) => {
        console.log('Updating status for customer with ID:', customerId);
        console.log('New status:', newStatus);
        const customerIndex = customerData.findIndex((customer) => customer.customerId === customerId);

        if (customerIndex !== -1) {
            const updatedCustomerData = [...customerData];
            updatedCustomerData[customerIndex].status = newStatus;

            console.log('Updated customer data:', updatedCustomerData);

            setCustomerData(updatedCustomerData);
        }
    };
    const handleCreateCustomerSuccess = (newCustomer, successMessage) => {
        // Close the form
        setOpenOderForm(false);
        setCustomerData((prevCustomerData) => [...prevCustomerData, newCustomer]);

        setSnackbarSuccessMessage(successMessage === 'Create customer successfully!' ? 'Tạo thêm khách hàng thành công!' : 'Thành công');
        setSnackbarSuccessOpen(true);
    };

    const handleCloseOdersForm = () => {
        setOpenOderForm(false);
    };

    //----------------------------------------------------------------
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = customerData.map((n) => n.name);
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

    const handleCustomerClick = (customer) => {
        console.log(customer);
        if (selectedCustomerId === customer.customerId) {
            setSelectedCustomerId(null);
        } else {
            setSelectedCustomerId(customer.customerId);
        }
    };

    const handleCloseCustomerDetails = () => {
        setSelectedCustomerId(null);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };
    // Các hàm xử lý soft theo name--------------------------------------------------------------------------------------------------------------------------------
    // const handleCheckboxChange = (event, customerId) => {
    //     if (event.target.checked) {
    //         // Nếu người dùng chọn checkbox, thêm sản phẩm vào danh sách đã chọn.
    //         setSelectedCustomerId([...selectedCustomerId, customerId]);
    //     } else {
    //         // Nếu người dùng bỏ chọn checkbox, loại bỏ sản phẩm khỏi danh sách đã chọn.
    //         setSelectedCustomerId(selectedCustomerId.filter((id) => id !== customerId));
    //     }
    // };
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        // Sắp xếp danh sách sản phẩm dựa trên trường và hướng đã chọn
        const sortedProduct = [...customerData].sort((a, b) => {
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


    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PRODUCTSLIST.length) : 0;

    const filteredUsers = applySortFilter(PRODUCTSLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    useEffect(() => {
        getAllCustomer()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => {
                        return dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss').diff(
                            dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'),
                        );
                    });
                    setCustomerData(sortedData);
                    setSortedProduct(sortedData);
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
                <title> Danh sách khách hàng</title>
            </Helmet>

            {/* <Container> */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Danh sách khách hàng
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={() => setOpenOderForm(true)}
                >
                    Thêm khách hàng
                </Button>
                <Dialog maxWidth="md" fullWidth open={openOderForm}>
                    <DialogTitle>
                        Tạo thông tin khách hàng{' '}
                        <IconButton style={{ float: 'right' }} onClick={handleCloseOdersForm}>
                            <CloseIcon color="primary" />
                        </IconButton>{' '}
                    </DialogTitle>
                    <CreateCustomerForm onClose={handleCreateCustomerSuccess} open={openOderForm} />
                </Dialog>
            </Stack>

            <Card>
                <CustomerSaleToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <CustomerSaleListHead
                                // order={order}
                                // orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={customerData.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {customerData.slice(startIndex, endIndex).map((customer) => {
                                    return (
                                        <React.Fragment key={customer.customerId}>
                                            <TableRow
                                                hover
                                                key={customer.customerId}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={selectedCustomerId === customer.customerId}
                                                onClick={() => handleCustomerClick(customer)}
                                            >
                                                {/* <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedCustomerId === customer.id}
                                                        // onChange={(event) => handleCheckboxChange(event, customer.id)}
                                                        // checked={selectedUser}
                                                        onChange={(event) => handleClick(event, customer.name)}
                                                    />
                                                </TableCell> */}

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">
                                                    <Typography variant="subtitle2" noWrap>
                                                        {customer.code}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                        <Typography variant="subtitle2" noWrap>
                                                            {customer.name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="left">{customer.phone}</TableCell>
                                                <TableCell align="left">{customer.email}</TableCell>
                                                <TableCell align="left">{customer.taxCode}</TableCell>
                                                <TableCell align="left">{customer.address}</TableCell>
                                                <TableCell align="left">
                                                    {(customer.customerType === "INDIVIDUAL") ? "Cá nhân" :
                                                        (customer.customerType === "COMPANY") ? "Công ty" : 'Không có'}
                                                </TableCell>
                                                <TableCell align="left">{customer.description}</TableCell>

                                                <TableCell align="left">
                                                    <Label color={(customer.status === true && 'success') || 'error'}>
                                                        {customer.status === true ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                                    </Label>
                                                </TableCell>
                                            </TableRow>

                                            {selectedCustomerId === customer.customerId && (
                                                <TableRow>
                                                    <TableCell colSpan={12}>
                                                        <CustomerDetailForm
                                                            customer={customerData}
                                                            customerId={selectedCustomerId}
                                                            updateProductInList={updateProductInList}
                                                            updateCustomerStatusInList={updateCustomerStatusInList}
                                                            onClose={handleCloseCustomerDetails} />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
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
                    count={customerData.length}
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
        </>
    );
};
export default CustomerSalePage;
