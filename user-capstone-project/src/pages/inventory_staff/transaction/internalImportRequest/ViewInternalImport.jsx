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
    OutlinedInput,
    Typography,
    TableContainer,
    TablePagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemText,
} from '@mui/material';
// components
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Label from '~/components/label/Label';
// import Iconify from '~/components/iconify/Iconify';
import Scrollbar from '~/components/scrollbar/Scrollbar';
import { useLocation, useNavigate } from 'react-router-dom';
// sections
import { ProductsListHead, ProductsListToolbar } from '~/sections/@dashboard/products';
// mock
// api
import { getAllImportRequestOfWarehouse } from '~/data/mutation/importRequestReceipt/ImportRequestReceipt-mutation';

import dayjs from 'dayjs';
import { getAllInternalImportRequestOfWarehouse } from '~/data/mutation/internalImportRequest/internalImportRequest-mutation';
import InternalImportRequestDetail from '~/sections/auth/inventory_staff/internalImportRequest/InternalImportRequestDetail';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'image', label: '', alignRight: false },
    { id: 'id', label: 'Mã phiếu', alignRight: false },
    { id: 'description', label: 'Mô tả', alignRight: false },
    { id: 'createdBy', label: 'Người tạo', alignRight: false },
    { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
    // { id: 'type', label: 'Loại yêu cầu', alignRight: false },
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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
// function formatDate(dateString) {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();

//     return `${day}/${month}/${year}`;
// }

const ViewInternalImport = () => {
    const location = useLocation();
    const { state } = location;
    const successMessage = state?.successMessage;
    // State mở các form----------------------------------------------------------------
    const [openOderForm, setOpenOderForm] = useState(false);

    const [selected, setSelected] = useState([]);
    const [selectedImportReceiptId, setSelectedImportReceiptId] = useState([]);

    // State cho phần soft theo name-------------------------------------------------------
    const [filterName, setFilterName] = useState('');
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortedProduct, setSortedProduct] = useState([]);

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate();
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    // State data và xử lý data
    const [importRequestData, setImportRequestData] = useState([]);
    // const [productStatus, setProductStatus] = useState('');

    const [selectedStatus, setSelectedStatus] = React.useState([]);
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');

    const [isExportFormOpen, setIsExportFormOpen] = useState(false);

    const [selectedStatusInVietnamese, setSelectedStatusInVietnamese] = React.useState([]);
    // Hàm để thay đổi data mỗi khi Edit xong api-------------------------------------------------------------
    const updateImportReceiptInList = (updatedImportReceipt) => {
        const importReceiptIndex = importRequestData.findIndex((product) => product.id === updatedImportReceipt.id);

        if (importReceiptIndex !== -1) {
            const updatedImportReceiptData = [...importRequestData];
            updatedImportReceiptData[importReceiptIndex] = updatedImportReceipt;

            setImportRequestData(updatedImportReceiptData);
        }
    };

    const updateImportReceiptConfirmInList = (importReceiptId, newStatus) => {
        const importReceiptIndex = importRequestData.findIndex((product) => product.id === importReceiptId);

        if (importReceiptIndex !== -1) {
            const updatedImportReceiptData = [...importRequestData];
            updatedImportReceiptData[importReceiptIndex].status = newStatus;

            setImportRequestData(updatedImportReceiptData);
        }
    };

    const handleCreateImportReceiptSuccess = (newImportReceipt) => {
        // Close the form
        setOpenOderForm(false);
        setImportRequestData((prevImportReceiptData) => [...prevImportReceiptData, newImportReceipt]);
    };

    //----------------------------------------------------------------
    // const handleOpenMenu = (event, product) => {
    //     setSelectedProduct(product);
    //     setOpen(event.currentTarget);
    // };

    // const handleCloseMenu = () => {
    //     setOpen(null);
    // };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = importRequestData.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };



    const handleProductClick = (importReceipt) => {
        if (selectedImportReceiptId === importReceipt.id) {
            setSelectedImportReceiptId(null); // Đóng nếu đã mở
        } else {
            setSelectedImportReceiptId(importReceipt.id); // Mở hoặc chuyển sang sản phẩm khác
        }
    };

    const handleCloseProductDetails = () => {
        setSelectedImportReceiptId(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };
    // Các hàm xử lý soft theo name--------------------------------------------------------------------------------------------------------------------------------
    // const handleCheckboxChange = (event, productId) => {
    //     if (event.target.checked) {
    //         // Nếu người dùng chọn checkbox, thêm sản phẩm vào danh sách đã chọn.
    //         setSelectedImportReceiptId([...selectedImportReceiptId, productId]);
    //     } else {
    //         // Nếu người dùng bỏ chọn checkbox, loại bỏ sản phẩm khỏi danh sách đã chọn.
    //         setSelectedImportReceiptId(selectedImportReceiptId.filter((id) => id !== productId));
    //     }
    // };
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        // Sắp xếp danh sách sản phẩm dựa trên trường và hướng đã chọn
        const sortedProduct = [...importRequestData].sort((a, b) => {
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
        setSortedProduct(filteredUsers);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - importRequestData.length) : 0;

    const filteredUsers = applySortFilter(importRequestData, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    useEffect(() => {
        getAllInternalImportRequestOfWarehouse()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => {
                        return dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss').diff(
                            dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'),
                        );
                    });
                    setImportRequestData(sortedData);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, [successMessage, isExportFormOpen]);

    console.log(importRequestData);
    useEffect(() => {
        if (successMessage) {

            setSnackbarSuccessOpen(true);
            setSnackbarSuccessMessage(successMessage);
        }
    }, [successMessage]);
    //==============================* filter *==============================
    const pendingApprovalItems = importRequestData.filter(
        (importRequest) => importRequest.status === 'Pending_Approval',
    );

    const otherItems = importRequestData.filter((importRequest) => importRequest.status !== 'Pending_Approval');

    const allItems = [...pendingApprovalItems, ...otherItems];

    const statusArray = allItems.map((item) => item.status);
    const uniqueStatusArray = Array.from(new Set(statusArray));

    // Chỉ chọn những giá trị mà bạn quan tâm
    const filteredStatusArray = uniqueStatusArray.filter(status => (
        status === "Pending_Approval" ||
        status === "Approved" ||
        status === "IN_PROGRESS" ||
        status === "Completed"
    ));

    const translateStatusToVietnamese = (status) => {
        const vietnameseStatusMap = {
            "Pending_Approval": 'Chờ xác nhận',
            "Approved": 'Đã xác nhận',
            "IN_PROGRESS": 'Đang tiến hành',
            "Completed": 'Hoàn thành',
        };

        return vietnameseStatusMap[status] || status;
    };
    const handleStatusChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedStatus(selectedValue);
        setSelectedStatusInVietnamese(translateStatusToVietnamese(selectedValue));
    };
    //==============================* filter *==============================
    const filteredItems = allItems.filter((item) =>
        selectedStatus.length === 0 ? true : selectedStatus.includes(item.status),
    );

    return (
        <>
            <Helmet>
                <title> Nhập kho nội bộ | Minimal UI </title>
            </Helmet>

            {/* <Container> */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Yêu cầu nhập kho nội bộ
                </Typography>
            </Stack>
            {/* ===========================================filter=========================================== */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <FilterAltIcon color="action" />
                <Typography gutterBottom variant="h6" color="text.secondary" component="div" sx={{ m: 1 }}>
                    Bộ lọc tìm kiếm
                </Typography>
            </div>
            <FormControl sx={{ m: 1, width: 300, mb: 2 }}>
                <InputLabel id="demo-multiple-checkbox-label">Trạng thái</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    input={<OutlinedInput label="Trạng thái" />}
                    MenuProps={MenuProps}
                >
                    {filteredStatusArray.map((name) => (
                        <MenuItem key={name} value={name}>
                            {/* <Checkbox checked={selectedStatus.indexOf(name) > -1} /> */}
                            <ListItemText primary={translateStatusToVietnamese(name)} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* ===========================================filter=========================================== */}
            <Card>
                {/* <ProductsListToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                /> */}

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <ProductsListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={importRequestData.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredItems.slice(startIndex, endIndex).map((importReceipt) => {
                                    return (
                                        <React.Fragment key={importReceipt.id}>
                                            <TableRow
                                                hover
                                                key={importReceipt.id}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={selectedImportReceiptId === importReceipt.id}
                                                onClick={() => handleProductClick(importReceipt)}
                                            >

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">
                                                    <Typography variant="subtitle2" noWrap>
                                                        {importReceipt.code}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                        <Typography variant="subtitle2" noWrap>
                                                            {importReceipt.description}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="left">{importReceipt.createdBy}</TableCell>
                                                <TableCell align="left">{importReceipt.createdAt}</TableCell>
                                                {/* <TableCell align="left">{importReceipt.type}</TableCell> */}
                                                <TableCell align="left">
                                                    <Label
                                                        color={
                                                            (importReceipt.status === 'Pending_Approval' &&
                                                                'warning') ||
                                                            (importReceipt.status === 'Approved' && 'success') ||
                                                            (importReceipt.status === 'IN_PROGRESS' && 'primary') ||
                                                            (importReceipt.status === 'Complete' && 'primary') ||
                                                            (importReceipt.status === 'Inactive' && 'error') ||
                                                            'default'
                                                        }
                                                    >
                                                        {importReceipt.status === 'Pending_Approval'
                                                            ? 'Chờ xác nhận'
                                                            : importReceipt.status === 'Approved'
                                                                ? 'Đã xác nhận'
                                                                : importReceipt.status === 'IN_PROGRESS'
                                                                    ? 'Đang tiến hành'
                                                                    : importReceipt.status === 'Completed'
                                                                        ? 'Hoàn thành'
                                                                        : 'Ngừng hoạt động'}
                                                    </Label>
                                                </TableCell>
                                            </TableRow>

                                            {selectedImportReceiptId === importReceipt.id && (
                                                <TableRow>
                                                    <TableCell colSpan={8}>
                                                        <InternalImportRequestDetail
                                                            importReceipt={importRequestData}
                                                            importReceiptId={selectedImportReceiptId}
                                                            updateImportReceiptInList={updateImportReceiptInList}
                                                            updateImportReceiptConfirmInList={
                                                                updateImportReceiptConfirmInList
                                                            }
                                                            onClose={handleCloseProductDetails}
                                                            setIsExportFormOpen={setIsExportFormOpen}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                                {/* {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )} */}
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
                    count={allItems.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </>
    );
};
export default ViewInternalImport;
