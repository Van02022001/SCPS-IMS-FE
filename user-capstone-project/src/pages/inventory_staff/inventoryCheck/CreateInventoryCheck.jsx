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
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
//api
import { getItemByWarehouse } from '~/data/mutation/items/item-mutation';
import { InventoryReportListHead, InventoryReportToolbar } from '~/sections/@dashboard/manager/inventoryReport';

import { createInventoryCheck } from '~/data/mutation/inventoryCheck/InventoryCheck-mutation';
import SnackbarError from '~/components/alert/SnackbarError';
import Scrollbar from '~/components/scrollbar/Scrollbar';

const TABLE_HEAD = [
    { id: 'itemName', label: 'Mã sản phẩm', alignRight: false },
    { id: 'quantity', label: 'Số lượng hiện tại', alignRight: false },
    { id: 'actualQuantity', label: 'Số lượng thực tế', alignRight: false },
    { id: 'description', alignRight: false },
];

const CreateInventoryCheck = ({
    selectedItemCheckId,
    inventoryCheckData,

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
    //Thông bao
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    //State sử lý quanity bên detail
    const navigate = useNavigate();
    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Import request receipt created successfully') {
            setSuccessMessage('Tạo phiếu thành công');
        } else if (message === 'Update sub category successfully.') {
            setSuccessMessage('Cập nhập danh mục thành công');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Inventory Staff not found!') {
            setErrorMessage('Không tìm thấy nhân viên !');
        } else if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ');
        } else if (message === '404 NOT_FOUND') {
            setErrorMessage('Mô tả quá dài');
        } else if (message === 'Warehouse not found!') {
            setErrorMessage('Hãy chọn kho và nhân viên !');
        } else if (message === 'An error occurred while creating the inventory check receipt') {
            setErrorMessage('Hãy nhập số lượng thực tế !');
        }
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setOpen1(false);
        setSuccessMessage('');
        setErrorMessage('');
    };
    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}></Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="lage" />
            </IconButton>
        </React.Fragment>
    );

    const handleItemClickDetail = (item) => {
        setSelectedItemCheckDetailId(item.id === selectedItemCheckDetailId ? null : item.id);
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

            if (response.status === '201 CREATED') {
                handleSuccessMessage(response.message);
                // Chuyển hướng và truyền thông báo
                navigate('/inventory-staff/inventory-check-item', {
                    state: { successMessage: response.message },
                });
            }
        } catch (error) {
            handleErrorMessage(error.response?.data?.message);
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
                    // fullWidth
                    value={description}
                    onChange={handleDescriptionChange}
                    sx={{ marginBottom: 2, marginLeft: 2, width: 400 }}
                />
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <InventoryReportListHead
                                // order={order}
                                // orderBy={orderBy}
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
                                        <TableCell align="left">{item.subCategory.name}</TableCell>
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
                                                label="Ghi chú"
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
                                            <TableCell colSpan={12} style={{ marginLeft: '100px' }}>
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
                                                            <TableCell sx={{ width: '44%' }}>{`${location.shelfNumber} - ${location.binNumber}`}</TableCell>
                                                            <TableCell sx={{ width: '40%' }}>{location.item_quantity}</TableCell>
                                                            <TableCell sx={{ width: '40%' }}>
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
                                                        <TableCell colSpan={1} sx={{ fontWeight: "bold" }}>Tổng số vị trí: {totalQuantities.totalLocations}</TableCell>
                                                        <TableCell sx={{ fontWeight: "bold" }}>Tổng số lượng hiện tại: {totalQuantities.totalActualQuantity}</TableCell>
                                                        <TableCell sx={{ fontWeight: "bold" }}>Tổng số lượng thực tế: {totalQuantities.totalQuantity}</TableCell>
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
            <SnackbarError
                open={open1}
                handleClose={handleClose}
                message={errorMessage}
                action={action}
                style={{ bottom: '16px', right: '16px' }}
            />
        </>
    );
};

export default CreateInventoryCheck;
