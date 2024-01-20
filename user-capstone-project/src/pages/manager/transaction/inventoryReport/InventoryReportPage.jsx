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
    TableBody,
    TableCell,
    Typography,
    TableContainer,
    TablePagination,
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
//icons
import FilterAltIcon from '@mui/icons-material/FilterAlt';
// sections
import { InventoryReportListHead, InventoryReportToolbar } from '~/sections/@dashboard/manager/inventoryReport';
// mock
import PRODUCTSLIST from '../../../../_mock/products';
// api

// import ImportReaceiptDetailForm from '~/sections/auth/inventory_staff/importReceipt/ImportReceiptDetailForm';
// import EditCategoryForm from '~/sections/auth/manager/categories/EditCategoryForm';
// import GoodsReceiptPage from '../GoodsReceiptPage';
import { useNavigate } from 'react-router-dom';
import { getAllImportReceipt } from '~/data/mutation/importReceipt/ImportReceipt-mutation';
import ImportReceiptDetailManagerForm from '~/sections/auth/manager/transaction/importReceipt/ImportReceiptDetailManagerForm';
import {
    getAllInventoryByWarehouse,
    getAllInventoryReport,
} from '~/data/mutation/inventoryReport/InventoryReport-mutation';
import { getAllWarehouse } from '~/data/mutation/warehouse/warehouse-mutation';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    // { id: 'id', label: 'Mã hàng', alignRight: false },
    { id: 'itemCode', label: 'Mã hàng', alignRight: false },
    { id: 'itemName', label: 'Tên hàng', alignRight: false },
    { id: 'available', label: 'Hàng có săn', alignRight: false },
    { id: 'averageUnitValue', label: 'Đơn giá trung bình', alignRight: false },
    { id: 'defective', label: 'Hàng hỏng', alignRight: false },
    { id: 'lost', label: 'Hàng mất', alignRight: false },
    { id: 'inboundQuantity', label: 'Số lượng đầu vào', alignRight: false },
    { id: 'inboundValue', label: 'Giá trị đầu vào', alignRight: false },
    { id: 'outboundQuantity', label: 'Số lượng đầu ra', alignRight: false },
    { id: 'outboundValue', label: 'Giá trị đầu ra', alignRight: false },
    { id: 'totalValue', label: 'Tổng giá trị', alignRight: false },
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
const InventoryReportPage = () => {
    // State mở các form----------------------------------------------------------------
    // const [open, setOpen] = useState(null);

    const [selected, setSelected] = useState([]);
    const [selectedInventoryReporttId, setSelectedInventoryReportId] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    // State cho phần soft theo name-------------------------------------------------------
    const [filterName, setFilterName] = useState('');
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortedProduct, setSortedProduct] = useState([]);

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate();

    // State data và xử lý data
    const [selectedInventoryReport, setSelectedInventoryReport] = React.useState([]);
    const [inventoryReportData, setInventoryReportData] = useState([]);
    const [warehouseData, setWarehouseData] = useState([]);
    const filterWarehouses = warehouseData.map((warehouse) => warehouse.name);
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    // Hàm để thay đổi data mỗi khi Edit xong api-------------------------------------------------------------

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = inventoryReportData.map((n) => n.name);
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
        const sortedProduct = [...inventoryReportData].sort((a, b) => {
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
    //==============================* filter *==============================
    const applyFilters = (inventoryReport) => {
        const isWarehouseMatch =
            !selectedInventoryReport ||
            selectedInventoryReport.length === 0 ||
            selectedInventoryReport.some((warehouse) => warehouse === inventoryReport.warehouseDTO?.name);

        const isInventoryReportMatch = filterName
            ? inventoryReport.itemName.toLowerCase().includes(filterName.toLowerCase())
            : true;

        return isWarehouseMatch && isInventoryReportMatch;
    };

    const filteredInventoryReport = inventoryReportData.filter(applyFilters);

    console.log(selectedInventoryReport);

    //==============================* filter *==============================
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PRODUCTSLIST.length) : 0;

    const filteredUsers = applySortFilter(PRODUCTSLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    useEffect(() => {
        getAllInventoryReport()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    setInventoryReportData(data);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
        getAllWarehouse()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    setWarehouseData(data);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);
    console.log(inventoryReportData);
    // useEffect(() => {
    //     if (selectedInventoryReport.length > 0) {
    //         const warehouseId = selectedInventoryReport[0];
    //         getAllInventoryByWarehouse(warehouseId)
    //             .then((response) => {
    //                 const data = response.data;
    //                 if (Array.isArray(data)) {
    //                     console.log('Inventory data:', data);
    //                     const sortedData = data.sort((a, b) => {
    //                         return dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss').diff(
    //                             dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'),
    //                         );
    //                     });
    //                     setInventoryReportData(sortedData);

    //                     const selectedWarehouse = warehouseData.find((warehouse) => warehouse.id === warehouseId);
    //                     setSelectedWarehouse(selectedWarehouse);
    //                 } else {
    //                     console.error('API response is not an array:', data);
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error('Error fetching inventory data:', error);
    //             });
    //     }
    // }, [selectedInventoryReport, warehouseData]);

    return (
        <>
            <Helmet>
                <title> Xuất Nhập Tồn | Minimal UI </title>
            </Helmet>

            {/* <Container> */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Báo cáo xuất nhập tồn {selectedWarehouse ? `(${selectedWarehouse.name})` : ''}
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
                <InputLabel id="demo-multiple-checkbox-label">Chọn kho hàng</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selectedInventoryReport}
                    onChange={(event) => setSelectedInventoryReport(event.target.value)}
                    input={<OutlinedInput label="Chọn kho hàng" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {filterWarehouses.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={selectedInventoryReport.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* ===========================================filter=========================================== */}
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
                                rowCount={inventoryReportData.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredInventoryReport.slice(startIndex, endIndex).map((inventoryReport) => {
                                    return (
                                        <React.Fragment key={inventoryReport.itemId}>
                                            <TableRow key={inventoryReport.itemId}>
                                                <TableCell>{inventoryReport.itemCode}</TableCell>
                                                <TableCell>{inventoryReport.itemName}</TableCell>
                                                <TableCell>{inventoryReport.available}</TableCell>
                                                <TableCell>{inventoryReport.averageUnitValue}</TableCell>
                                                <TableCell>{inventoryReport.defective}</TableCell>
                                                <TableCell>{inventoryReport.lost}</TableCell>
                                                <TableCell>{inventoryReport.inboundQuantity}</TableCell>
                                                <TableCell>{inventoryReport.inboundValue}</TableCell>
                                                <TableCell>{inventoryReport.outboundQuantity}</TableCell>
                                                <TableCell>{inventoryReport.outboundValue}</TableCell>
                                                <TableCell>{inventoryReport.totalValue}</TableCell>
                                            </TableRow>
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
                    count={filteredInventoryReport.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </>
    );
};
export default InventoryReportPage;
