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
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    Dialog,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemText,
    OutlinedInput,
} from '@mui/material';
// components
import Label from '~/components/label/Label';
import Iconify from '~/components/iconify/Iconify';
import Scrollbar from '~/components/scrollbar/Scrollbar';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
// sections
import { SubCategoryListHead, SubCategoryToolbar } from '~/sections/@dashboard/manager/subCategory';
// mock
import PRODUCTSLIST from '../../../_mock/products';
import { useLocation, useNavigate } from 'react-router-dom';
// api
import ImportRequestReceiptDetailManagerForm from '~/sections/auth/manager/transaction/importRequestReceipt/ImportRequestReceiptDetailManagerForm';
//icons

// import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { getAllCustomerRequest } from '~/data/mutation/customerRequest/CustomerRequest-mutation';
import CreateRequestCustomerPage from './CreateRequestCustomerPage';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import dayjs from 'dayjs';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'image', label: '', alignRight: false },
    { id: 'id', label: 'Mã phiếu', alignRight: false },
    { id: 'description', label: 'Mô tả', alignRight: false },
    { id: 'createdBy', label: 'Người tạo', alignRight: false },
    { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
    // { id: 'type', label: 'Loại yêu cầu', alignRight: false },
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

// function formatDate(dateString) {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();

//     return `${day}/${month}/${year}`;
// }

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

// const filterOptions = ['Ren', 'Ron', 'Abc', 'Test1', 'Test12', 'Test123'];

const CustomerRequestSalePage = () => {
    const location = useLocation();
    const { state } = location;
    const successMessage = state?.successMessage;
    // State mở các form----------------------------------------------------------------
    const [openOderForm, setOpenOderForm] = useState(false);


    const [selected, setSelected] = useState([]);
    const [selectedGoodReceiptId, setSelectedGoodReceiptId] = useState([]);

    // State cho phần soft theo name-------------------------------------------------------
    const [filterName, setFilterName] = useState('');
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortedGoodReceipt, setSortedGoodReceipt] = useState([]);

    const [rowsPerPage, setRowsPerPage] = useState(5);
    // Search data
    const [displayedGoodReceiptData, setDisplayedGoodReceiptData] = useState([]);
    // State data và xử lý data
    const [importRequestData, setImportRequestData] = useState([]);
    const [importRequestStatus, setImportRequestStatus] = useState('');

    const navigate = useNavigate();

    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');
    const [selectedStatus, setSelectedStatus] = React.useState([]);
    // const handleChange = (event) => {
    //     setPersonName(event.target.value);
    //     const selectedValues = event.target.value.length > 0 ? event.target.value : null;
    //     setFilteredCategory(selectedValues);
    //     setSelectedFilterOptions(selectedValues);
    // };

    // ========================== Hàm để thay đổi data mỗi khi Edit xong api=======================================
    const updateGoodReceiptInList = (updatedGoodReceipt) => {
        const importRquestReceiptIndex = importRequestData.findIndex((good_receipt) => good_receipt.id === updatedGoodReceipt.id);

        if (importRquestReceiptIndex !== -1) {
            const UpdatedGoodReceipt = [...importRequestData];
            UpdatedGoodReceipt[importRquestReceiptIndex] = UpdatedGoodReceipt;

            setImportRequestData(UpdatedGoodReceipt);
        }
    };

    const updateGoodReceiptStatusInList = (goodReceiptId, newStatus) => {
        const importRquestReceiptIndex = importRequestData.findIndex((good_receipt) => good_receipt.id === goodReceiptId);

        if (importRquestReceiptIndex !== -1) {
            const UpdatedGoodReceipt = [...importRequestData];
            UpdatedGoodReceipt[importRquestReceiptIndex].status = newStatus;

            setImportRequestData(UpdatedGoodReceipt);
        }
    };

    // const handleCreateGoodReceiptSuccess = (newGoodReceipt) => {
    //     // Close the form
    //     setOpenOderForm(false);
    //     setImportRequestData((prevGoodReceiptData) => [...prevGoodReceiptData, newGoodReceipt]);
    // };

    const handleDataSearch = (searchResult) => {
        // Cập nhật state của trang chính với dữ liệu từ tìm kiếm
        setImportRequestData(searchResult);
        setDisplayedGoodReceiptData(searchResult);
        console.log(displayedGoodReceiptData);
    };

    //===========================================================================================

    const handleSubCategoryClick = (subCategory) => {
        if (selectedGoodReceiptId === subCategory.id) {
            setSelectedGoodReceiptId(null); // Đóng nếu đã mở
        } else {
            setSelectedGoodReceiptId(subCategory.id); // Mở hoặc chuyển sang sản phẩm khác
        }
    };

    const handleCloseSubCategoryDetails = () => {
        setSelectedGoodReceiptId(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    //=========================================== Các hàm xử lý soft theo name===========================================
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = importRequestData.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };


    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        // Sắp xếp danh sách sản phẩm dựa trên trường và hướng đã chọn
        const sortedGoodReceipt = [...importRequestData].sort((a, b) => {
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
        setSortedGoodReceipt(sortedGoodReceipt);
    };

    const handleFilterByName = (event) => {
        setPage(0);
        const query = event.target.value;
        setFilterName(query);

        const filteredUsers = applySortFilter(sortedGoodReceipt, getComparator(order, sortBy), query);
        setSortedGoodReceipt(filteredUsers);
    };

    const handleCloseOdersForm = () => {
        setOpenOderForm(false);
    };
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PRODUCTSLIST.length) : 0;

    const filteredUsers = applySortFilter(PRODUCTSLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    useEffect(() => {
        getAllCustomerRequest()
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
    }, []);

    const mapSuccessMessageToVietnamese = (englishMessage) => {
        switch (englishMessage) {
            case 'Import request receipt created successfully':
                return 'Tạo phiếu yêu cầu xuất kho thành công';
            // Thêm các trường hợp khác nếu cần
            default:
                return englishMessage;
        }
    };

    useEffect(() => {
        if (successMessage) {
            const vietnameseMessage = mapSuccessMessageToVietnamese(successMessage);
            setSnackbarSuccessOpen(true);
            setSnackbarSuccessMessage(vietnameseMessage);
        }
    }, [successMessage]);
    //==============================* filter *==============================
    const pendingApprovalItems = importRequestData.filter((importRequest) => importRequest.status === 'Pending_Approval');

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
    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };
    //==============================* filter *==============================
    const filteredItems = allItems.filter((item) =>
        selectedStatus.length === 0 ? true : selectedStatus.includes(item.status),
    );

    return (
        <>
            <Helmet>
                <title> Quản lý nh| Minimal UI </title>
            </Helmet>

            {/* <Container> */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h4" gutterBottom>
                    Phiếu yêu cầu xuất kho
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={() => navigate('/sale-staff/create-request')}
                >
                    Xử lý hóa đơn
                </Button>
                <Dialog fullWidth maxWidth open={openOderForm} >
                    <DialogTitle>Xử lý đặt hàng  <IconButton style={{ float: 'right' }} onClick={handleCloseOdersForm}>
                        <CloseIcon color="primary" /></IconButton>
                    </DialogTitle>
                    <CreateRequestCustomerPage open={openOderForm} />
                </Dialog>
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
                    multiple
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    input={<OutlinedInput label="Trạng thái" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {filteredStatusArray.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={selectedStatus.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* ===========================================filter=========================================== */}
            <Card>
                <SubCategoryToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                    onDataSearch={handleDataSearch}
                />

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <SubCategoryListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={importRequestData.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredItems.map((importRequest) => {
                                    return (
                                        <React.Fragment key={importRequest.id}>
                                            <TableRow
                                                hover
                                                key={importRequest.id}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={selectedGoodReceiptId === importRequest.id}
                                                onClick={() => handleSubCategoryClick(importRequest)}
                                            >

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">
                                                    <Typography variant="subtitle2" noWrap>
                                                        {importRequest.code}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                        <Typography variant="subtitle2" noWrap>
                                                            {importRequest.note}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="left">{importRequest.createdBy}</TableCell>
                                                <TableCell align="left">{importRequest.createdAt}</TableCell>
                                                {/* <TableCell align="left">{importReceipt.type}</TableCell> */}
                                                <TableCell align="left">
                                                    <Label
                                                        color={
                                                            (importRequest.status === 'Pending_Approval' &&
                                                                'warning') ||
                                                            (importRequest.status === 'Approved' && 'success') ||
                                                            (importRequest.status === ' IN_PROGRESS' && 'warning') ||
                                                            (importRequest.status === 'Complete' && 'primary') ||
                                                            (importRequest.status === 'Inactive' && 'error') ||
                                                            'default'
                                                        }
                                                    >
                                                        {importRequest.status === 'Pending_Approval'
                                                            ? 'Chờ phê duyệt'
                                                            : importRequest.status === 'Approved'
                                                                ? 'Đã xác nhận'
                                                                : importRequest.status === 'IN_PROGRESS'
                                                                    ? 'Đang tiến hành'
                                                                    : importRequest.status === 'Completed'
                                                                        ? 'Hoàn thành'
                                                                        : 'Ngừng hoạt động'}
                                                    </Label>
                                                </TableCell>
                                            </TableRow>

                                            {selectedGoodReceiptId === importRequest.id && (
                                                <TableRow>
                                                    <TableCell colSpan={8}>
                                                        <ImportRequestReceiptDetailManagerForm
                                                            importRequestReceipt={importRequestData}
                                                            importRequestReceiptStatus={importRequestStatus}
                                                            importRequestReceiptId={selectedGoodReceiptId}
                                                            updateGoodReceiptInList={updateGoodReceiptInList}
                                                            updateGoodReceiptStatusInList={
                                                                updateGoodReceiptStatusInList
                                                            }
                                                            onClose={handleCloseSubCategoryDetails}
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
                    count={PRODUCTSLIST.length}
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
export default CustomerRequestSalePage;
