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
    TableHead,
    TableBody,
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

    const [itemsCheckData, setItemsCheckData] = useState([]);
    const [selectedItemCheckDetailId, setSelectedItemCheckDetailId] = useState([]);
    const [description, setDescription] = useState('');
    const [actualQuantities, setActualQuantities] = useState({});
    const [productDescriptions, setProductDescriptions] = useState({});
    const [locationQuantities, setLocationQuantities] = useState({});

    const [totalQuantities, setTotalQuantities] = useState({
        totalQuantity: 0,
        totalActualQuantity: 0,
        totalLocations: 0,
    });
    //State sử lý quanity bên details

    const handleItemClickDetail = (item) => {
        setSelectedItemCheckDetailId(item.id === selectedItemCheckDetailId ? null : item.id);
    };

    const handleItemClick = (item) => {
        console.log(item);
        if (selectedItemCheckId === item.id) {
            setSelectedItemCheckDetailId(null);
        } else {
            setSelectedItemCheckDetailId(item.id);
        }
    };

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
        const newActualQuantity = parseInt(event.target.value, 10) || 0;
        setActualQuantities((prevQuantities) => {
            const newQuantities = { ...prevQuantities, [itemId]: newActualQuantity };

            // Calculate and update total actual quantities
            const newTotalActualQuantity = Object.values(newQuantities).reduce((acc, val) => acc + val, 0);
            setTotalQuantities((prevTotal) => ({
                ...prevTotal,
                totalActualQuantity: newTotalActualQuantity,
            }));

            return newQuantities;
        });
    };

    const handleLocationQuantityChange = (locationId, event) => {
        const newQuantity = parseInt(event.target.value, 10) || 0;
        setLocationQuantities((prevQuantities) => {
            const newQuantities = { ...prevQuantities, [locationId]: newQuantity };

            // Calculate and update total quantities and total locations
            const newTotalQuantity = Object.values(newQuantities).reduce((acc, val) => acc + val, 0);
            const newTotalLocations = Object.keys(newQuantities).length;
            setTotalQuantities((prevTotal) => ({
                ...prevTotal,
                totalQuantity: newTotalQuantity,
                totalLocations: newTotalLocations,
            }));

            return newQuantities;
        });
    };

    const handleUpdateQuantities = async () => {
        try {
            const details = itemsCheckData.map((item) => ({
                itemId: item.id,
                actualQuantity: actualQuantities[item.id] || 0,
                note: productDescriptions[item.id] || "",
                locationQuantities: item.locations.map((location) => ({
                    locationId: location.id,
                    quantity: locationQuantities[location.id] || 0,
                })),
            }));

            const checkInventoryParams = {
                description: description,
                details: details,
            };

            const response = await createInventoryCheck(checkInventoryParams);

            // Handle the response as needed

        } catch (error) {
            console.error('Error updating quantities:', error);
        }
    };

    useEffect(() => {
        getItemByWarehouse()
            .then((response) => {
                const data = response.data;
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => a.id - b.id);
                    setItemsCheckData(sortedData);
                    console.log(itemsCheckData, 'response');
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
                            />
                            {itemsCheckData.map((item) => (
                                <React.Fragment key={item.id}>
                                    <TableRow
                                        hover
                                        key={item.id}
                                        tabIndex={-1}
                                        role="checkbox"
                                        selected={selectedItemCheckDetailId === item.id}
                                        onClick={() => handleItemClickDetail(item)}
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
                                            <TableCell colSpan={3}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Vị trí</TableCell>
                                                        <TableCell>Số lượng hiện tại</TableCell>
                                                        <TableCell>Số lượng thực tế</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {item.locations.map((location) => (
                                                        <TableRow key={location.id}>
                                                            <TableCell>{`${location.shelfNumber} - ${location.binNumber}`}</TableCell>
                                                            <TableCell>{location.item_quantity}</TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    label="Số lượng"
                                                                    type="number"
                                                                    value={locationQuantities[location.id] || ''}
                                                                    onChange={(event) => handleLocationQuantityChange(location.id, event)}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    <TableRow>
                                                        <TableCell colSpan={1}>Tổng số vị trí: {totalQuantities.totalLocations}</TableCell>
                                                        <TableCell>Tổng số lượng hiện tại: {totalQuantities.totalActualQuantity}</TableCell>
                                                        <TableCell>Tổng số lượng thực tế: {totalQuantities.totalQuantity}</TableCell>
                                                    </TableRow>
                                                </TableBody>
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
