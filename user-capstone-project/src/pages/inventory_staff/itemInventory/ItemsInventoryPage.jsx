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
    Checkbox,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    Dialog,
    DialogTitle,
    Select,
    FormControl,
    InputLabel,
    OutlinedInput,
    ListItemText,
} from '@mui/material';
// components
import Label from '../../../components/label';

import Scrollbar from '../../../components/scrollbar';
import CloseIcon from '@mui/icons-material/Close';
// sections
import { ItemsInventoryListHead, ItemsInventoryToolbar } from '~/sections/@dashboard/inventoryStaff/items';
import CreateItemsForm from '~/sections/auth/manager/items/CreateItemsForm';
//api 
import USERLIST from '../../../_mock/user';
import { getAllItem, getItemByWarehouse } from '~/data/mutation/items/item-mutation';
import { getAllBrands } from '~/data/mutation/brand/brands-mutation';
import { getAllSubCategory } from '~/data/mutation/subCategory/subCategory-mutation';
import { getAllOrigins } from '~/data/mutation/origins/origins-mutation';

//icons
import FilterAltIcon from '@mui/icons-material/FilterAlt';

//calendar
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import ItemDetaiIventoryForm from '~/sections/auth/inventory_staff/itemInventory/ItemDetaiIventoryForm';
import { useLocation } from 'react-router-dom';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'code', label: 'Mã sản phẩm', alignRight: false },
    { id: 'subCategory', label: 'Danh mục sản phẩm', alignRight: false },
    { id: 'role', label: 'Số lượng', alignRight: false },
    { id: 'status', label: 'Thương hiệu', alignRight: false },
    { id: 'isVerified', label: 'Nhà cung cấp', alignRight: false },
    { id: 'status', label: 'Nguồn gốc', alignRight: false },
    { id: 'status', label: 'Trạng thái', alignRight: false },
];
// const orderDetailFormStyles = {
//     maxHeight: 0,
//     overflow: 'hidden',
//     transition: 'max-height 0.3s ease-in-out',
// };

// ----------------------------------------------------------------------

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

const ItemsInventoryPage = () => {
    const [openOderForm, setOpenOderForm] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);
    //-------------------------------------------------
    // const [openOderFormDetail, setOpenOderFormDetail] = useState(false);
    // const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [selectedItemId, setSelectedItemId] = useState([]);
    // State data và xử lý data
    const [itemsData, setItemData] = useState([]);
    const location = useLocation();
    const { state } = location;
    const successMessage = state?.successMessage;

    const [sortedItem, setSortedItem] = useState([]);
    //--------------------Filter------------------------
    const [personName, setPersonName] = React.useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = React.useState([]);
    const [selectedFilterOptions, setSelectedFilterOptions] = useState(null);
    const [selectedSuppliers, setSelectedSuppliers] = React.useState([]);
    const [selectedOrigins, setSelectedOrigins] = React.useState([]);
    // fiter brand //
    const [brandData, setBrandData] = useState([]);
    const filterOptions = brandData.map((brand) => brand.name);
    // fiter subcate //
    const [subCategoryData, setSubCategoryData] = useState([]);
    const filterSubCategories = subCategoryData.map((subcate) => subcate.name);
    // fiter Suppliers //
    const [originData, setOriginData] = useState([]);
    const filterOrigins = originData.map((origin) => origin.name);
    // fiter createdAt //
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const handleChange = (event) => {
        setPersonName(event.target.value);
        const selectedValues = event.target.value.length > 0 ? event.target.value : null;
        setSelectedFilterOptions(selectedValues);
    };
    const handleChangeCategories = (event) => {
        setSelectedSubCategories(event.target.value);
    };

    const handleCloseOrderDetails = () => {
        setSelectedOrder(null);
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
    // ============================================== Các hàm xử lý soft theo name==============================================
    // const handleCheckboxChange = (event, itemId) => {
    //     if (event.target.checked) {
    //         // Nếu người dùng chọn checkbox, thêm sản phẩm vào danh sách đã chọn.
    //         setSelectedItemId([...selectedItemId, itemId]);
    //     } else {
    //         // Nếu người dùng bỏ chọn checkbox, loại bỏ sản phẩm khỏi danh sách đã chọn.
    //         setSelectedItemId(selectedItemId.filter((id) => id !== itemId));
    //     }
    // };

    //============================================== Hàm để thay đổi data mỗi khi Edit xong api=============================================
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
    const handleCreateItemsSuccess = (newItems) => {
        // Close the form
        setOpenOderForm(false);
        setItemData((prevItemsData) => [...prevItemsData, newItems]);
    };
    //===========================================================================================

    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

    const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    useEffect(() => {
        getItemByWarehouse()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => {
                        return dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss').diff(
                            dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'),
                        );
                    });
                    setItemData(sortedData);
                    setSortedItem(sortedData);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, [successMessage]);

    useEffect(() => {
        
        getAllBrands()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    setBrandData(data);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
        getAllSubCategory()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    setSubCategoryData(data);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
        getAllOrigins()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    setOriginData(data);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    console.log(itemsData);

    //==============================* filter *==============================//
    const applyFilters = (item) => {
        const isSubCategoryMatch =
            !selectedSubCategories ||
            selectedSubCategories.length === 0 ||
            selectedSubCategories.includes(item.subCategory.name);

        const isBrandMatch =
            !selectedFilterOptions ||
            selectedFilterOptions.length === 0 ||
            (Array.isArray(item.brand) && item.brand.some((brand) => selectedFilterOptions.includes(brand.name))) ||
            (!Array.isArray(item.brand) && selectedFilterOptions.includes(item.brand.name));

        const isSupplierMatch =
            !selectedSuppliers || selectedSuppliers.length === 0 || selectedSuppliers.includes(item.supplier.name);

        const isOriginMatch =
            !selectedOrigins || selectedOrigins.length === 0 || selectedOrigins.includes(item.origin.name);

        const isDateInRange =
            (!startDate || dayjs(item.createdAt, 'DD/MM/YYYY HH:mm:ss').isSameOrAfter(dayjs(startDate), 'day')) &&
            (!endDate || dayjs(item.createdAt, 'DD/MM/YYYY HH:mm:ss').isSameOrBefore(dayjs(endDate), 'day'));

        console.log('startDate:', startDate);
        console.log('endDate:', endDate);
        console.log('item.createdAt:', item.createdAt);

        return isSubCategoryMatch && isBrandMatch && isSupplierMatch && isOriginMatch && isDateInRange;
    };

    const filteredItems = itemsData.filter(applyFilters);
    //==============================* filter *==============================//

    return (
        <>
            <Helmet>
                <title> Quản lý sản phẩm | Minimal UI </title>
            </Helmet>

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Quản lý sản phẩm kho
                </Typography>

                <Dialog fullWidth maxWidth="md" open={openOderForm}>
                    <DialogTitle>
                        Tạo sản phẩm{' '}
                        <IconButton style={{ float: 'right' }} onClick={handleCloseOdersForm}>
                            <CloseIcon color="primary" />
                        </IconButton>{' '}
                    </DialogTitle>
                    <CreateItemsForm onClose={handleCreateItemsSuccess} open={openOderForm} />
                </Dialog>
            </Stack>

            {/* ===========================================filter=========================================== */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <FilterAltIcon color="action" />
                <Typography gutterBottom variant="h6" color="text.secondary" component="div" sx={{ m: 1 }}>
                    Bộ lọc tìm kiếm
                </Typography>
            </div>
            <FormControl sx={{ m: 1, width: 200, mb: 2 }}>
                <InputLabel id="demo-multiple-checkbox-label">Danh mục sản phẩm</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selectedSubCategories}
                    onChange={handleChangeCategories}
                    input={<OutlinedInput label="Danh mục sản phẩm" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {filterSubCategories.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={selectedSubCategories.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ m: 1, width: 200, mb: 2 }}>
                <InputLabel id="demo-multiple-checkbox-label">Thương hiệu</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Thương hiệu" />}
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
            </FormControl>

            <FormControl sx={{ m: 1, width: 200, mb: 2 }}>
                <InputLabel id="demo-multiple-checkbox-label">Nguồn gốc</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selectedOrigins}
                    onChange={(event) => setSelectedOrigins(event.target.value)}
                    input={<OutlinedInput label="Nguồn gốc" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {filterOrigins.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={selectedOrigins.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ ml: 72, width: 300 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateRangePicker']}>
                        <DateRangePicker
                            startText="Ngày tạo"
                            endText="Ngày kết thúc"
                            value={[startDate, endDate]}
                            onChange={(newValue) => {
                                setStartDate(newValue[0]);
                                setEndDate(newValue[1]);
                            }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            </FormControl>
            {/* ===========================================filter=========================================== */}

            <Card>
                <ItemsInventoryToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <ItemsInventoryListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={USERLIST.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredItems.slice(startIndex, endIndex).map((item) => {
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
                                                {/* <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedItemId === item.id}
                                                        // onChange={(event) => handleCheckboxChange(event, item.id)}
                                                        // checked={selectedUser}
                                                        onChange={(event) => handleClick(event, item.name)}
                                                    />
                                                </TableCell> */}

                                                <TableCell align="left">
                                                    <Typography variant="subtitle2" noWrap>
                                                        {item.code}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell align="left">{item.subCategory.name}</TableCell>

                                                <TableCell align="left">{item.available}</TableCell>

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
                                            </TableRow>

                                            {selectedItemId === item.id && (
                                                <TableRow>
                                                    <TableCell colSpan={8}>
                                                        <ItemDetaiIventoryForm
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
                    count={filteredItems.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </>
    );
};
export default ItemsInventoryPage;
