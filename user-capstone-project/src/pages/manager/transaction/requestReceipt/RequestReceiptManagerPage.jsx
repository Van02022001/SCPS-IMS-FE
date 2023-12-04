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
} from '@mui/material';
// components
import Label from '~/components/label/Label';
import Iconify from '~/components/iconify/Iconify';
import Scrollbar from '~/components/scrollbar/Scrollbar';
import CloseIcon from '@mui/icons-material/Close';

// sections
import { SubCategoryListHead, SubCategoryToolbar } from '~/sections/@dashboard/manager/subCategory';
// mock
import PRODUCTSLIST from '../../../../_mock/products';
import { useNavigate } from 'react-router-dom';
// api

import SubCategoryDetailForm from '~/sections/auth/manager/subCategory/SubCategoryDetailForm';
//icons
// import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CreateGoodReceipt from './CreateGoodReceipt';
import { getAllImportRequest } from '~/data/mutation/importRequestReceipt/ImportRequestReceipt-mutation';

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

const RequestReceiptManagerPage = () => {
    // State mở các form----------------------------------------------------------------
    const [open, setOpen] = useState(null);
    const [openOderForm, setOpenOderForm] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false);

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
    const [goodReceiptData, setGoodReceiptData] = useState([]);
    const [goodReceiptStatus, setGoodReceiptStatus] = useState('');

    const [selectedGoodReceipt, setSelectedGoodReceipt] = useState(null);

    const [filteredCategory, setFilteredCategory] = useState(null);

    // const [anchorElOptions, setAnchorElOptions] = useState(null);

    const [selectedFilterOptions, setSelectedFilterOptions] = useState(null);

    const [personName, setPersonName] = React.useState([]);
    const navigate = useNavigate();

    const handleChange = (event) => {
        setPersonName(event.target.value);
        const selectedValues = event.target.value.length > 0 ? event.target.value : null;
        setFilteredCategory(selectedValues);
        setSelectedFilterOptions(selectedValues);
    };

    // ========================== Hàm để thay đổi data mỗi khi Edit xong api=======================================
    const updateGoodReceiptInList = (updatedGoodReceipt) => {
        const goodReceiptIndex = goodReceiptData.findIndex((good_receipt) => good_receipt.id === updatedGoodReceipt.id);

        if (goodReceiptIndex !== -1) {
            const UpdatedGoodReceipt = [...goodReceiptData];
            UpdatedGoodReceipt[goodReceiptIndex] = UpdatedGoodReceipt;

            setGoodReceiptData(UpdatedGoodReceipt);
        }
    };

    const updateGoodReceiptStatusInList = (goodReceiptId, newStatus) => {
        const goodReceiptIndex = goodReceiptData.findIndex((good_receipt) => good_receipt.id === goodReceiptId);

        if (goodReceiptIndex !== -1) {
            const UpdatedGoodReceipt = [...goodReceiptData];
            UpdatedGoodReceipt[goodReceiptIndex].status = newStatus;

            setGoodReceiptData(UpdatedGoodReceipt);
        }
    };

    const handleCreateGoodReceiptSuccess = (newGoodReceipt) => {
        // Close the form
        setOpenOderForm(false);
        setGoodReceiptData((prevGoodReceiptData) => [...prevGoodReceiptData, newGoodReceipt]);
    };

    const handleDataSearch = (searchResult) => {
        // Cập nhật state của trang chính với dữ liệu từ tìm kiếm
        setGoodReceiptData(searchResult);
        setDisplayedGoodReceiptData(searchResult);
        console.log(displayedGoodReceiptData);
    };

    //===========================================================================================
    // const handleOpenMenu = (event, subCategory) => {
    //     setSelectedProduct(subCategory);
    //     setOpen(event.currentTarget);
    // };

    const handleCloseMenu = () => {
        setOpen(null);
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
            const newSelecteds = goodReceiptData.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleCheckboxChange = (event, subCategoryId) => {
        if (event.target.checked) {
            // Nếu người dùng chọn checkbox, thêm sản phẩm vào danh sách đã chọn.
            setSelectedGoodReceiptId([...selectedGoodReceiptId, subCategoryId]);
        } else {
            // Nếu người dùng bỏ chọn checkbox, loại bỏ sản phẩm khỏi danh sách đã chọn.
            setSelectedGoodReceiptId(selectedGoodReceiptId.filter((id) => id !== subCategoryId));
        }
    };
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        // Sắp xếp danh sách sản phẩm dựa trên trường và hướng đã chọn
        const sortedGoodReceipt = [...goodReceiptData].sort((a, b) => {
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

    const handleCloseEditsForm = () => {
        setOpenEditForm(false);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PRODUCTSLIST.length) : 0;

    const filteredUsers = applySortFilter(PRODUCTSLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    useEffect(() => {
        getAllImportRequest()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    setGoodReceiptData(data);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    //==============================* filter *==============================
    const pendingApprovalItems = goodReceiptData.filter((importRequest) => importRequest.status === 'Pending_Approval');

    const otherItems = goodReceiptData.filter((importRequest) => importRequest.status !== 'Pending_Approval');

    const allItems = [...pendingApprovalItems, ...otherItems];
    //==============================* filter *==============================

    return (
        <>
            <Helmet>
                <title> Quản lý nh| Minimal UI </title>
            </Helmet>

            {/* <Container> */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h4" gutterBottom>
                    Quản lý phiếu yêu cầu nhập kho
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={() => navigate('/dashboard/create-good-receipt')}
                >
                    Tạo phiếu yêu cầu nhập kho
                </Button>
                <Dialog fullWidth maxWidth open={openOderForm}>
                    <DialogTitle>
                        Tạo phiếu yêu cầu nhập kho{' '}
                        <IconButton style={{ float: 'right' }} onClick={handleCloseOdersForm}>
                            <CloseIcon color="primary" />
                        </IconButton>{' '}
                    </DialogTitle>
                    <CreateGoodReceipt onClose={handleCreateGoodReceiptSuccess} open={openOderForm} />
                </Dialog>
            </Stack>

            {/* ===========================================filter=========================================== */}
            {/* <div style={{ display: 'flex', alignItems: 'center' }}>
                <FilterAltIcon color="action" />
                <Typography gutterBottom variant="h6" color="text.secondary" component="div" sx={{ m: 1 }}>
                    Bộ lọc tìm kiếm
                </Typography>
            </div> */}
            {/* <FormControl sx={{ m: 1, width: 300, mb: 2 }}>
                <InputLabel id="demo-multiple-checkbox-label">Nhóm hàng</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Nhóm hàng" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {filterOptions.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={personName.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> */}
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
                                rowCount={goodReceiptData.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {allItems.map((importRequest) => {
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
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedGoodReceiptId === importRequest.id}
                                                        onChange={(event) =>
                                                            handleCheckboxChange(event, importRequest.id)
                                                        }
                                                        // checked={selectedUser}
                                                        // onChange={(event) => handleClick(event, name)}
                                                    />
                                                </TableCell>

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
                                                            {importRequest.description}
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
                                                            : importRequest.status === 'Complete'
                                                            ? 'Hoàn thành'
                                                            : 'Ngừng hoạt động'}
                                                    </Label>
                                                </TableCell>
                                            </TableRow>

                                            {selectedGoodReceiptId === importRequest.id && (
                                                <TableRow>
                                                    <TableCell colSpan={8}>
                                                        <SubCategoryDetailForm
                                                            goodReceipt={goodReceiptData}
                                                            goodReceiptStatus={goodReceiptStatus}
                                                            goodReceiptId={selectedGoodReceiptId}
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
        </>
    );
};
export default RequestReceiptManagerPage;
