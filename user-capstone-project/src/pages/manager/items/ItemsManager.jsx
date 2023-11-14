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
import ItemsForm from '~/sections/auth/items/ItemsForm';
import ItemDetailForm from '~/sections/auth/items/ItemDetailForm';
import USERLIST from '../../../_mock/user';
import { getAllItem } from '~/data/mutation/items/item-mutation';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'code', label: 'Mã sản phẩm', alignRight: false },
    { id: 'subCategory', label: 'Danh mục sản phẩm', alignRight: false },
    { id: 'role', label: 'Số lượng', alignRight: false },
    { id: 'status', label: 'Thương hiệu', alignRight: false },
    { id: 'isVerified', label: 'Nhà cung cấp', alignRight: false },
    { id: 'status', label: 'Nguồn gốc', alignRight: false },
    { id: 'status', label: 'Trạng thái', alignRight: false },
    { id: '' },
];
// const orderDetailFormStyles = {
//     maxHeight: 0,
//     overflow: 'hidden',
//     transition: 'max-height 0.3s ease-in-out',
// };

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

const ItemsManagerPage = () => {
    const [open, setOpen] = useState(null);

    const [openOderForm, setOpenOderForm] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);
    //-------------------------------------------------
    const [openOderFormDetail, setOpenOderFormDetail] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [selectedItemId, setSelectedItemId] = useState([]);
    // State data và xử lý data
    const [itemsData, setItemData] = useState([]);
    const [itemStatus, setItemStatus] = useState('');
    const [sortedItem, setSortedItem] = useState([]);

    const handleCloseOrderDetails = () => {
        setSelectedOrder(null);
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
    const handleCloseOdersForm = () => {
        setOpenOderForm(false);
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

    const handleItemClick = (item) => {
        console.log(item);
        if (selectedItemId === item.id) {
            setSelectedItemId(null); // Đóng nếu đã mở
        } else {
            setSelectedItemId(item.id); // Mở hoặc chuyển sang sản phẩm khác
        }
    };
    // Các hàm xử lý soft theo name--------------------------------------------------------------------------------------------------------------------------------
    const handleCheckboxChange = (event, itemId) => {
        if (event.target.checked) {
            // Nếu người dùng chọn checkbox, thêm sản phẩm vào danh sách đã chọn.
            setSelectedItemId([...selectedItemId, itemId]);
        } else {
            // Nếu người dùng bỏ chọn checkbox, loại bỏ sản phẩm khỏi danh sách đã chọn.
            setSelectedItemId(selectedItemId.filter((id) => id !== itemId));
        }
    };
    // Hàm để thay đổi data mỗi khi Edit xong api-------------------------------------------------------------
    const updateItemInList = (updatedItem) => {
        const itemIndex = itemsData.findIndex((item) => item.id === updatedItem.id);

        if (itemIndex !== -1) {
            const updatedItemData = [...itemsData];
            updatedItemData[itemIndex] = updatedItem;

            setItemData(updatedItemData);
        }
    };
    const updateItemStatusInList = (itemId, newStatus) => {
        const itemIndex = itemsData.findIndex((item) => item.id === itemId);

        if (itemIndex !== -1) {
            const updatedItemData = [...itemsData];
            updatedItemData[itemIndex].status = newStatus;
            setItemData(updatedItemData);
        }
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

    const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    useEffect(() => {
        getAllItem()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    setItemData(data);
                    setSortedItem(data);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    console.log(itemsData);

    return (
        <>
            <Helmet>
                <title> Quản lý sản phẩm | Minimal UI </title>
            </Helmet>

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Quản lý sản phẩm
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={() => setOpenOderForm(true)}
                >
                    Thêm sản phẩm
                </Button>
                <Dialog fullWidth maxWidth="md" open={openOderForm}>
                    <DialogTitle>
                        Tạo sản phẩm{' '}
                        <IconButton style={{ float: 'right' }} onClick={handleCloseOdersForm}>
                            <CloseIcon color="primary" />
                        </IconButton>{' '}
                    </DialogTitle>
                    <ItemsForm />
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
                                {itemsData.map((item) => {
                                    return (
                                        <React.Fragment key={item.id}>
                                            <TableRow
                                                hover
                                                key={item.id}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={selectedItemId === item.id}
                                                onClick={() => handleItemClick(item)}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedItemId === item.id}
                                                        onChange={(event) => handleCheckboxChange(event, item.id)}
                                                    // checked={selectedUser}
                                                    // onChange={(event) => handleClick(event, name)}
                                                    />
                                                </TableCell>

                                                <TableCell align="left">
                                                    <Typography variant="subtitle2" noWrap>
                                                        {item.code}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell align="left">{item.subCategory.name}</TableCell>

                                                <TableCell align="left">{item.quantity}</TableCell>

                                                <TableCell align="left">{item.brand.name}</TableCell>

                                                <TableCell align="left">{item.supplier.name}</TableCell>

                                                <TableCell align="left">{item.origin.name}</TableCell>

                                                <TableCell align="left">
                                                    <Label color={(item.status === 'Inactive' && 'error') || 'success'}>
                                                        {item.status === 'Active'
                                                            ? 'Đang hoạt động'
                                                            : 'Ngừng hoạt động'}
                                                    </Label>
                                                </TableCell>

                                                <TableCell align="right">
                                                    <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                                                        <Iconify icon={'eva:more-vertical-fill'} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>

                                            {selectedItemId === item.id && (
                                                <TableRow>
                                                    <TableCell colSpan={8}>
                                                        <ItemDetailForm
                                                            items={itemsData}
                                                            itemId={selectedItemId}
                                                            onClose={handleCloseOrderDetails}
                                                            updateItemInList={updateItemInList}
                                                            updateItemStatusInList={updateItemStatusInList}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    );
                                })}

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
                            </TableBody>
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

            {/* <Popover
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
            </Popover> */}
        </>
    );
};
export default ItemsManagerPage;
