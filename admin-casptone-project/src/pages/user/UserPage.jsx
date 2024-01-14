import { Helmet } from 'react-helmet-async';
import { filter, sortBy } from 'lodash';
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
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import UserDetailForm from 'src/sections/auth/admin/user/UserDetailForm';
import USERLIST from '../../_mock/user';
import UserForm from '../../sections/auth/home/UserForm';
import { getAllUser, deleteUser } from '../../data/mutation/user/user-mutation';
import dayjs from 'dayjs';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Họ và tên', alignRight: false },
    { id: 'phone', label: 'Số điện thoại', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'role', label: 'Vị trí', alignRight: false },
    { id: 'registeredAt', label: 'Ngày tạo tài khoản', alignRight: false },
    // { id: 'status', label: 'Trạng thái', alignRight: false },
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

const UserPage = () => {
    const [open, setOpen] = useState(null);
    const [openUserForm, setOpenUserForm] = useState(false);

    const [page, setPage] = useState(0);
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [userData, setUserData] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [sortedUsers, setSortedUsers] = useState([]);

    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };
    const handleCloseUserForm = () => {
        setOpenUserForm(false);
    };
    const handleCloseUserDetails = () => {
        setSelectedUserIds(null);
    };
    const handleUserClick = (user) => {
        if (selectedUserIds === user.id) {
            setSelectedUserIds(null); // Đóng nếu đã mở
        } else {
            setSelectedUserIds(user.id); // Mở hoặc chuyển sang sản phẩm khác
        }
    };
    const handleCheckboxChange = (event, userId) => {
        if (event.target.checked) {
            // Nếu người dùng chọn checkbox, thêm sản phẩm vào danh sách đã chọn.
            setSelectedUserIds([...selectedUserIds, userId]);
        } else {
            // Nếu người dùng bỏ chọn checkbox, loại bỏ sản phẩm khỏi danh sách đã chọn.
            setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
        }
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        // Sắp xếp danh sách sản phẩm dựa trên trường và hướng đã chọn
        const sortedUsers = [...userData].sort((a, b) => {
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
        setSortedUsers(sortedUsers);
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
        const query = event.target.value;
        setFilterName(query);

        const filteredUsers = applySortFilter(sortedUsers, getComparator(order, sortBy), query);
        setSortedUsers(filteredUsers);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

    const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    const handleDeleteUser = (id) => {
        deleteUser(id);
        console.log(id);
    };

    useEffect(() => {
        getAllUser()
            .then((respone) => {
                const data = respone.data;
                if (data && data.length > 0) {
                    const sortedData = data.sort((a, b) => {
                        return dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss').diff(
                            dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'),
                        );
                    });
                    setUserData(sortedData);
                    setSortedUsers(data);
                } else {
                    console.error('No users found');
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return (
        <>
            <Helmet>
                <title> Tài khoản </title>
            </Helmet>

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Tài khoản người dùng
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={() => setOpenUserForm(true)}
                >
                    Tạo tài khoản
                </Button>
                <Dialog fullWidth maxWidth="md" open={openUserForm}>
                    <DialogTitle>
                        Tạo tài khoản{' '}
                        <IconButton style={{ float: 'right' }} onClick={handleCloseUserForm}>
                            <CloseIcon color="primary" />
                        </IconButton>{' '}
                    </DialogTitle>
                    <UserForm />
                </Dialog>
            </Stack>

            <Card>
                <UserListToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                // onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <UserListHead
                                // order={order}
                                // orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={userData.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                            // onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {userData.slice(startIndex, endIndex).map((users) => {
                                    return (
                                        <React.Fragment key={users.id}>
                                            <TableRow
                                                hover
                                                key={users.id}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={selectedUserIds === users.id}
                                                onClick={() => handleUserClick(users)}
                                            >
                                                <TableCell padding="checkbox">

                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        {users.middleName} {users.lastName} {users.firstName}
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{users.phone}</TableCell>

                                                <TableCell align="left">{users.email}</TableCell>

                                                <TableCell align="left">
                                                    {users.role.name === 'MANAGER' && 'Quản lý'}
                                                    {users.role.name === 'ADMIN' && 'Admin'}
                                                    {users.role.name === 'INVENTORY_STAFF' && 'Nhân viên quản kho'}
                                                    {users.role.name === 'SALE_STAFF' && 'Nhân viên bán hàng'}
                                                </TableCell>

                                                <TableCell align="left">{formatDate(users.registeredAt)}</TableCell>

                                                {/* <TableCell align="left">
                                                    <Label
                                                        color={(users.role.status === 'banned' && 'error') || 'success'}
                                                    >
                                                        {users.role.status}
                                                    </Label>
                                                </TableCell> */}
                                                <TableCell align="left">{users.company}</TableCell>
                                                {/* <TableCell align="right">
                                                    <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                                                        <Iconify icon={'eva:more-vertical-fill'} />
                                                    </IconButton>
                                                </TableCell> */}
                                            </TableRow>

                                            {selectedUserIds === users.id && (
                                                <TableRow>
                                                    <TableCell colSpan={8}>
                                                        <UserDetailForm
                                                            users={userData}
                                                            usersId={selectedUserIds}
                                                            onClose={handleCloseUserDetails}
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
                    count={userData.length}
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
          Chỉnh sửa
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} onClick={() => handleDeleteUser(users.id)} />
          Xóa
        </MenuItem>
      </Popover> */}
        </>
    );
};
export default UserPage;
