import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import React, { useEffect, useState } from 'react';
// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    TableContainer,
    TablePagination,
} from '@mui/material';
// components
import Label from '~/components/label/Label';
import Scrollbar from '~/components/scrollbar/Scrollbar';
// sections
import { InventoryReportListHead, InventoryReportToolbar } from '~/sections/@dashboard/manager/inventoryReport';
// mock
import PRODUCTSLIST from '../../../_mock/products';
// api
import { useLocation } from 'react-router-dom';

import dayjs from 'dayjs';
import { getAllInventoryCheck } from '~/data/mutation/inventoryCheck/InventoryCheck-mutation';

import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import InventoryCheckDetailManager from '~/sections/auth/manager/inventoryCheck/InventoryCheckDetailManager';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    // { id: 'id', label: 'Mã hàng', alignRight: false },
    { id: 'itemName', label: 'Tên hàng', alignRight: false },
    { id: 'itemName', label: 'Mô tả', alignRight: false },
    { id: 'itemName', label: 'Người tạo', alignRight: false },
    { id: 'itemName', label: 'Ngày tạo', alignRight: false },
    { id: 'itemName', label: 'Trạng thái', alignRight: false },
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


const InventoryCheckManagerPage = () => {
    // State mở các form----------------------------------------------------------------
    // const [open, setOpen] = useState(null);

    const [selected, setSelected] = useState([]);

    const [selectedItemCheckId, setSelectedItemCheckId] = useState([]);
    // State cho phần soft theo name-------------------------------------------------------
    const [filterName, setFilterName] = useState('');
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortedProduct, setSortedProduct] = useState([]);
    // const [openOderForm, setOpenOderForm] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // const navigate = useNavigate();

    // State data và xử lý data
    const [inventoryCheckData, setInventoryCheckData] = useState([]);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // const [selectedProduct, setSelectedProduct] = useState(null);
    // const [inventoryCheckDetailOpen, setInventoryCheckDetailOpen] = useState(false);

    const location = useLocation();
    const { state } = location;
    const successMessage = state?.successMessage;
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');

    const handleItemClick = (item) => {
        console.log(item);
        if (selectedItemCheckId === item.id) {
            setSelectedItemCheckId(null); // Đóng nếu đã mở
        } else {
            setSelectedItemCheckId(item.id); // Mở hoặc chuyển sang sản phẩm khác
        }
    };
    // Hàm để thay đổi data mỗi khi Edit xong api-------------------------------------------------------------

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = inventoryCheckData.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };
    // Các hàm xử lý soft theo name--------------------------------------------------------------------------------------------------------------------------------
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        // Sắp xếp danh sách sản phẩm dựa trên trường và hướng đã chọn
        const sortedProduct = [...inventoryCheckData].sort((a, b) => {
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
    // const handleCloseOdersForm = () => {
    //     setOpenOderForm(false);
    // };
    const handleCloseOrderDetails = () => {
        setSelectedOrder(null);
    };
    const updateInventoryReceiptConfirmInList = (inventoryCheckId, newStatus) => {
        const inventoryReceiptIndex = inventoryCheckData.findIndex((inventory) => inventory.id === inventoryCheckId);

        if (inventoryReceiptIndex !== -1) {
            const updatedInventoryReceiptData = [...inventoryCheckData];
            updatedInventoryReceiptData[inventoryReceiptIndex].status = newStatus;

            setInventoryCheckData(updatedInventoryReceiptData);
        }
    };
    //==============================* filter *==============================

    //==============================* filter *==============================
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PRODUCTSLIST.length) : 0;

    const filteredUsers = applySortFilter(PRODUCTSLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    useEffect(() => {
        getAllInventoryCheck()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => {
                        return dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss').diff(
                            dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'),
                        );
                    });
                    setInventoryCheckData(sortedData);
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
            case 'Inventory check receipt created successfully':
                return 'Tạo phiếu kiểm kho thành công';
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
    return (
        <>
            <Helmet>
                <title> Kiểm kho</title>
            </Helmet>

            {/* <Container> */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Kiểm kho
                </Typography>

            </Stack>

            <Card>
                <InventoryReportToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <InventoryReportListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={inventoryCheckData.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {inventoryCheckData.slice(startIndex, endIndex).map((item) => {
                                    return (
                                        <React.Fragment key={item.id}>
                                            <TableRow
                                                hover
                                                key={item.id}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={selectedItemCheckId === item.id}
                                                onClick={() => handleItemClick(item)}
                                            >
                                                <TableCell align="left">{item.code}</TableCell>
                                                <TableCell align="left">{item.description}</TableCell>
                                                <TableCell align="left">{item.createdBy}</TableCell>
                                                <TableCell align="left">{item.updatedAt}</TableCell>
                                                <TableCell align="left">
                                                    <Label
                                                        color={
                                                            (item.status === 'Pending_Approval' &&
                                                                'warning') ||
                                                            (item.status === 'Approved' && 'success') ||
                                                            (item.status === ' IN_PROGRESS' && 'warning') ||
                                                            (item.status === 'Complete' && 'primary') ||
                                                            (item.status === 'Inactive' && 'error') ||
                                                            'default'
                                                        }
                                                    >
                                                        {item.status === 'Pending_Approval'
                                                            ? 'Chờ phê duyệt'
                                                            : item.status === 'Approved'
                                                                ? 'Đã xác nhận'
                                                                : item.status === 'IN_PROGRESS'
                                                                    ? 'Đang tiến hành'
                                                                    : item.status === 'Completed'
                                                                        ? 'Hoàn thành'
                                                                        : 'Ngừng hoạt động'}
                                                    </Label>
                                                </TableCell>
                                            </TableRow>

                                            {selectedItemCheckId === item.id && (
                                                <TableRow>
                                                    <TableCell colSpan={8}>
                                                        <InventoryCheckDetailManager
                                                            inventoryCheckData={inventoryCheckData}
                                                            inventoryCheckId={selectedItemCheckId}
                                                            onClose={handleCloseOrderDetails}
                                                            updateInventoryReceiptConfirmInList={updateInventoryReceiptConfirmInList}
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
                    count={inventoryCheckData.length}
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
export default InventoryCheckManagerPage;
