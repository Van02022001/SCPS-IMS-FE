import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import {
    DialogTitle,
    DialogActions,
    Button,
    TextField,
    Stack,
    Typography,
    TableRow,
    TableCell,
    Table,
    TableContainer,
    Card,
} from '@mui/material';

import Iconify from '~/components/iconify/Iconify';
import Scrollbar from '~/components/scrollbar/Scrollbar';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getItemByWarehouse } from '~/data/mutation/items/item-mutation';
import { InventoryReportListHead, InventoryReportToolbar } from '~/sections/@dashboard/manager/inventoryReport';
import CreateInventoryCheckDetail from '~/sections/auth/inventory_staff/inventoryCheck/CreateInventoryCheckDetail';
import { createInventoryCheck } from '~/data/mutation/inventoryCheck/InventoryCheck-mutation';

const TABLE_HEAD = [
    // { id: 'id', label: 'Mã hàng', alignRight: false },
    { id: 'itemName', label: 'Mã sản phẩm', alignRight: false },
    { id: 'quantity', label: 'Số lượng hiện tại', alignRight: false },
    { id: 'actualQuantity', label: 'Số lượng thực tế', alignRight: false },
    { id: 'description', alignRight: false },
];
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

const CreateInventoryCheck = ({
    selectedItemCheckId,
    inventoryCheckData,
    open,
    onClose,
}) => {
    const [filterName, setFilterName] = useState('');
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortedProduct, setSortedProduct] = useState([]);

    const [openOderForm, setOpenOderForm] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [updatedQuantities, setUpdatedQuantities] = useState({});
    const [itemsCheckData, setItemsCheckData] = useState([]);

    const [selectedItemCheckDetailId, setSelectedItemCheckDetailId] = useState([]);

    const [description, setDescription] = useState('');
    const [actualQuantities, setActualQuantities] = useState({});
    const [productDescriptions, setProductDescriptions] = useState({});

    const handleItemClick = (item) => {
        console.log(item);
        if (selectedItemCheckId === item.id) {
            setSelectedItemCheckDetailId(null); // Đóng nếu đã mở
        } else {
            setSelectedItemCheckDetailId(item.id); // Mở hoặc chuyển sang sản phẩm khác
        }
    };

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

    // const handleUpdateQuantities = async () => {
    //     try {
    //         // Tạo một array details từ updatedQuantities
    //         const detailsArray = Object.keys(updatedQuantities).map((locationId) => {
    //             return {
    //                 itemId: 0,
    //                 actualQuantity: 0,
    //                 note: 'string',
    //                 locationQuantities: [
    //                     {
    //                         locationId: parseInt(locationId, 10),
    //                         quantity: parseInt(updatedQuantities[locationId], 10),
    //                     },
    //                 ],
    //             };
    //         });

    //         // Gửi request API
    //         const response = await createInventoryCheck({
    //             description: 'string',
    //             details: detailsArray,
    //         });
    //         console.log(response);
    //         onClose();
    //     } catch (error) {
    //         console.error('Error updating quantities:', error);
    //         // Xử lý lỗi nếu cần
    //     }
    // };
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };
    const handleProductDescriptionChange = (itemId, event) => {
        setProductDescriptions((prevDescriptions) => ({
            ...prevDescriptions,
            [itemId]: event.target.value,
        }));
    };
    const handleActualQuantityChange = (itemId, event) => {
        setActualQuantities((prevQuantities) => ({
            ...prevQuantities,
            [itemId]: event.target.value,
        }));
    };
    const handleUpdateQuantities = async () => {
        try {
            const detailsArray = Object.keys(updatedQuantities).map((itemId) => {
                const actualQuantity = parseInt(actualQuantities[itemId], 10);
                const item = itemsCheckData.find((item) => item.id === parseInt(itemId, 10));

                // Tính toán số lượng thực tế mới và tạo note
                const updatedQuantity = actualQuantity - item.quantity;
                const note = updatedQuantity > 0 ? `Sản phẩm có thêm ${updatedQuantity} cái` : '';

                // Tạo locationQuantities array từ các vị trí đã có
                const locationQuantities = item.locations.map((location) => ({
                    locationId: location.id,
                    quantity: location.item_quantity,
                }));

                // Cập nhật quantity trong locationQuantities array
                for (const locationQuantity of locationQuantities) {
                    locationQuantity.quantity = Math.min(locationQuantity.quantity, actualQuantity);
                    actualQuantity -= locationQuantity.quantity;
                }

                // Nếu còn dư actualQuantity, thêm vào location cuối cùng
                if (actualQuantity > 0) {
                    locationQuantities.push({
                        locationId: item.locations[item.locations.length - 1].id,
                        quantity: actualQuantity,
                    });
                }

                return {
                    itemId: parseInt(itemId, 10),
                    actualQuantity,
                    note,
                    locationQuantities,
                    description: productDescriptions[itemId] || '',
                };
            });

            // Gửi request API
            const response = await createInventoryCheck({
                description,
                details: detailsArray,
            });

            console.log(response);
            onClose();
        } catch (error) {
            console.error('Error updating quantities:', error);
            // Xử lý lỗi nếu cần
        }
    };
    useEffect(() => {
        getItemByWarehouse()
            .then((response) => {
                const data = response.data;
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => a.id - b.id);
                    setItemsCheckData(sortedData);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching items:', error);
            });
    }, []);

    return (
        <>
            <Helmet>
                <title>Kiểm kho</title>
            </Helmet>


            <Stack direction="row" alignItems="center" mb={5}>
                <Button>
                    <ArrowBackIcon fontSize="large" color="action" />
                </Button>
                <Typography variant="h4" gutterBottom>
                    Tiến hành kiểm kho
                </Typography>
            </Stack>
            <Card>
                <InventoryReportToolbar
                    // numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />
                <DialogTitle>Chi tiết kiểm kho</DialogTitle>
                <TextField
                    label="Mô tả phiếu"
                    fullWidth
                    value={description}
                    onChange={handleDescriptionChange}
                    sx={{ marginBottom: 2 }}
                />
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <InventoryReportListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={itemsCheckData.length}
                                // numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                            />
                            {itemsCheckData.map((item) => (
                                <React.Fragment key={item.id}>
                                    <TableRow
                                        hover
                                        key={item.id}
                                        tabIndex={-1}
                                        role="checkbox"
                                        selected={selectedItemCheckDetailId === item.id}
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <TableCell align="left">{item.code}</TableCell>
                                        <TableCell align="left">{item.quantity}</TableCell>
                                        <TableCell>
                                            <TextField
                                                label="Số lượng thực tế"
                                                type="number"
                                                value={actualQuantities[item.id] || ''}
                                                onChange={(event) => handleActualQuantityChange(item.id, event)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                label="Mô tả sản phẩm"
                                                fullWidth
                                                multiline
                                                rows={2}
                                                value={productDescriptions[item.id] || ''}
                                                onChange={(event) => handleProductDescriptionChange(item.id, event)}
                                            />
                                        </TableCell>
                                    </TableRow>

                                    {selectedItemCheckDetailId === item.id && (
                                        <TableRow>
                                            <TableCell colSpan={8}>
                                                <CreateInventoryCheckDetail
                                                    inventoryCheckData={itemsCheckData}
                                                    inventoryCheckId={selectedItemCheckDetailId}
                                                    actualQuantity={item.actualQuantity}
                                                    note={item.note}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </Table>
                    </TableContainer>
                </Scrollbar>
                <DialogActions>
                    <Button onClick={onClose}>Đóng</Button>
                    <Button onClick={handleUpdateQuantities} color="primary">
                        Cập nhật
                    </Button>
                </DialogActions>
            </Card>
        </>
    );
};

export default CreateInventoryCheck;
