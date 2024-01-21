import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
    Select,
    MenuItem,
    Input,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
//api
import { getItemByWarehouse } from '~/data/mutation/items/item-mutation';
import { InventoryReportListHead, InventoryReportToolbar } from '~/sections/@dashboard/manager/inventoryReport';

import { createInventoryCheck } from '~/data/mutation/inventoryCheck/InventoryCheck-mutation';
import SnackbarError from '~/components/alert/SnackbarError';
import Scrollbar from '~/components/scrollbar/Scrollbar';

const TABLE_HEAD = [
    { id: 'itemCode', label: 'Mã sản phẩm', alignRight: false },
    { id: 'itemName', label: 'Tên sản phẩm', alignRight: false },
    { id: 'quantity', label: 'Số lượng', alignRight: false },
    { id: 'actualQuantity', label: 'Số lượng thực tế', alignRight: false },
    { id: 'statusQuantity', label: 'Số lượng chênh lệch', alignRight: false },
    { id: 'description', label: 'Ghi chú', alignRight: false },
];

const CreateInventoryCheck = ({
    selectedItemCheckId,
    inventoryCheckData,

    onClose,
}) => {
    const [filterName, setFilterName] = useState('');
    const [itemsCheckData, setItemsCheckData] = useState([]);
    const [selectedItemCheckDetailId, setSelectedItemCheckDetailId] = useState([]);
    const [description, setDescription] = useState('');
    const [actualQuantities, setActualQuantities] = useState({});
    const [productDescriptions, setProductDescriptions] = useState({});
    const [locationQuantities, setLocationQuantities] = useState({});

    const [statusQuantities, setStatusQuantities] = useState({});
    // total
    const [totalQuantities, setTotalQuantities] = useState({
        totalQuantity: 0,
        totalActualQuantity: 0,
        totalLocations: 0,
    });
    //Thông báo
    const [actualQuantityError, setActualQuantityError] = useState(null);
    const [locationQuantityError, setLocationQuantityError] = useState(null);

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
        } else if (message === 'Hãy nhập số lượng!') {
            setErrorMessage('Hãy nhập số lượng thực tế !');
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

    const validateActualQuantity = (value) => {
        if (value === '0') {
            return 'Số lượng thực tế không được phép là 0.';
        } else if (isNaN(value) || value === '') {
            return 'Số lượng thực tế không được để trống và phải là một số.';
        } else if (Number(value) < 0) {
            return 'Số lượng thực tế không được là số âm.';
        }
        return null;
    };
    const validateLocationQuantity = (value) => {
        if (Number(value) < 0) {
            return 'Số lượng thực tế không được là số âm.';
        }
        return null;
    };


    const handleActualQuantityChange = (itemId, event) => {
        const newActualQuantity = event.target.value;

        // Perform validation
        const validationError = validateActualQuantity(newActualQuantity);
        setActualQuantityError(validationError);

        // Allow deletion if the input is empty

        setActualQuantities((prevQuantities) => {
            const newQuantities = { ...prevQuantities };
            delete newQuantities[itemId];

            const newTotalActualQuantity = Object.values(newQuantities).reduce((acc, val) => acc + Number(val), 0);
            setTotalQuantities((prevTotal) => ({
                ...prevTotal,
                totalActualQuantity: newTotalActualQuantity,
            }));

            return newQuantities;
        });

        setActualQuantities((prevQuantities) => {
            const newQuantities = { ...prevQuantities, [itemId]: newActualQuantity };

            const newTotalActualQuantity = Object.values(newQuantities).reduce((acc, val) => acc + Number(val), 0);
            setTotalQuantities((prevTotal) => ({
                ...prevTotal,
                totalActualQuantity: newTotalActualQuantity,
            }));

            return newQuantities;
        });
    };

    // const handleUpdateStatusQuantities = (locationId, value) => {
    //     console.log('value', value, locationId);
    //     const newStatusQuantity = value;
    // }

    const handleUpdateStatusQuantities = (itemId, value) => {
        console.log("Lúc nhập số lượng vào", itemId, value);
        setStatusQuantities((prevStatusQuantities) => ({
            ...prevStatusQuantities,
            [itemId]: value,
        }));
    };
    console.log(statusQuantities);
    const handleLocationQuantityChange = (locationId, event) => {
        const newQuantity = event.target.value;

        const validationError = validateLocationQuantity(newQuantity);
        setLocationQuantityError(validationError);

        setLocationQuantities((prevQuantities) => ({
            ...prevQuantities,
            [locationId]: newQuantity,
        }));
        const newTotalQuantity = Object.values({ ...locationQuantities, [locationId]: newQuantity }).reduce(
            (acc, val) => acc + (parseInt(val, 10) || 0),
            0
        );
        const newTotalLocations = Object.keys({ ...locationQuantities, [locationId]: newQuantity }).length;

        setTotalQuantities((prevTotal) => ({
            ...prevTotal,
            totalQuantity: newTotalQuantity,
            totalLocations: newTotalLocations,
        }));
    };
    //=================================================================
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



    const handleUpdateQuantities = async () => {
        // if (itemsCheckData.some((item) => !item.actualQuantities || parseInt(item.actualQuantities, 10) <= 0)) {
        //     handleErrorMessage('Hãy nhập số lượng');
        //     return;
        // }

        try {
            const details = itemsCheckData.map((item) => ({
                itemId: item.id,
                actualQuantity: actualQuantities[item.id] || 0,
                note: productDescriptions[item.id] || '',
                locationQuantities: item.locations.map((location) => ({
                    locationId: location.id,
                    quantity: locationQuantities[location.id] || 0,
                })),
                statusQuantities: statusQuantities[item.id] || 0,
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

    const handleNavigate = () => {
        navigate('/inventory-staff/inventory-check-item');
    };

    return (
        <>
            <Helmet>
                <title>Kiểm kho</title>
            </Helmet>

            <Stack direction="row" alignItems="center" mb={5}>
                <Button onClick={handleNavigate}>
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
                                        <TableCell align="left">{item.code}</TableCell>
                                        <TableCell align="left">{item.subCategory.name}</TableCell>
                                        <TableCell align="left">{item.quantity}</TableCell>
                                        <TableCell>
                                            <TextField
                                                helperText={actualQuantityError}
                                                error={Boolean(actualQuantityError)}
                                                label="Số lượng thực tế"
                                                type="number"
                                                value={actualQuantities[item.id] || ''}
                                                onChange={(event) => handleActualQuantityChange(item.id, event)}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: '30%' }}>
                                            <StatusQuality onChange={(e) => { handleUpdateStatusQuantities(item.id, e) }} />
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
                                                        <TableCell>Số lượng</TableCell>
                                                        <TableCell>Số lượng thực tế</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {item.locations.map((location) => (
                                                        <TableRow key={location.id}>
                                                            <TableCell
                                                                sx={{ width: '44%' }}
                                                            >{`${location.shelfNumber} - ${location.binNumber}`}</TableCell>
                                                            <TableCell sx={{ width: '40%' }}>
                                                                {location.item_quantity}
                                                            </TableCell>
                                                            <TableCell sx={{ width: '40%' }}>
                                                                <TextField
                                                                    helperText={locationQuantityError}
                                                                    error={Boolean(locationQuantityError)}
                                                                    label="Số lượng thực tế tại vị trí"
                                                                    type="number"
                                                                    value={locationQuantities[location.id] || ''}
                                                                    onChange={(event) =>
                                                                        handleLocationQuantityChange(location.id, event)
                                                                    }
                                                                />
                                                            </TableCell>

                                                        </TableRow>
                                                    ))}
                                                    <TableRow>
                                                        <TableCell colSpan={1} sx={{ fontWeight: 'bold' }}>
                                                            Tổng số vị trí: {totalQuantities.totalLocations}
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>
                                                            Tổng số lượng thực tế:{' '}
                                                            {totalQuantities.totalActualQuantity}
                                                            {statusQuantities[item.id]?.LOST > 0 && (
                                                                <span> (Thiếu: {statusQuantities[item.id].LOST})</span>
                                                            )}
                                                            {statusQuantities[item.id]?.DEFECTIVE > 0 && (
                                                                <span> (Hư: {statusQuantities[item.id].DEFECTIVE})</span>
                                                            )}
                                                            {statusQuantities[item.id]?.REDUNDANT > 0 && (
                                                                <span> (Thừa: {statusQuantities[item.id].REDUNDANT})</span>
                                                            )}
                                                            {statusQuantities[item.id]?.ENOUGH === 0 && (
                                                                <span> (Đủ)</span>
                                                            )}
                                                        </TableCell>

                                                        <TableCell sx={{ fontWeight: 'bold' }}>
                                                            Tổng số lượng tại vị trí: {totalQuantities.totalQuantity}
                                                        </TableCell>
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


const StatusQuality = ({ onChange }) => {
    const [statusQuantities, setStatusQuantities] = useState('');
    const [lostAmount, setLostAmount] = useState(0);
    const [defectiveAmount, setDefectiveAmount] = useState(0);
    const [redundantAmount, setRedundantAmount] = useState(0);

    const IStatusQuantity = {
        LOST: 'LOST',
        DEFECTIVE: 'DEFECTIVE',
        REDUNDANT: 'REDUNDANT',
        ENOUGH: 'ENOUGH'
    };

    const hasLostData = lostAmount > 0;
    const hasRedundantData = redundantAmount > 0;

    const handleOnChange = (value) => {
        const numericValue = parseInt(value, 10);

        switch (statusQuantities) {
            case IStatusQuantity.LOST:
                setLostAmount((prevLostAmount) => {
                    onChange({
                        LOST: numericValue,
                        DEFECTIVE: defectiveAmount,
                        REDUNDANT: redundantAmount,
                    });
                    return numericValue;
                });
                break;
            case IStatusQuantity.DEFECTIVE:
                setDefectiveAmount((prevDefectiveAmount) => {
                    onChange({
                        LOST: lostAmount,
                        DEFECTIVE: numericValue,
                        REDUNDANT: redundantAmount,
                    });
                    return numericValue;
                });
                break;
            case IStatusQuantity.REDUNDANT:
                setRedundantAmount((prevRedundantAmount) => {
                    onChange({
                        LOST: lostAmount,
                        DEFECTIVE: defectiveAmount,
                        REDUNDANT: numericValue,
                    });
                    return numericValue;
                });
                break;
            case IStatusQuantity.ENOUGH:
                onChange({
                    ENOUGH: 0,
                });
                break;
            default:
                onChange({
                    LOST: lostAmount,
                    DEFECTIVE: defectiveAmount,
                    REDUNDANT: redundantAmount,
                });
                break;
        }

    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Select
                value={statusQuantities}
                onChange={(e) => {
                    setStatusQuantities(e.target.value);
                }}
                style={{ width: '200px' }}
            >
                {!hasRedundantData && (
                    <MenuItem value={IStatusQuantity.LOST}>Sản phẩm bị thiếu</MenuItem>
                )}
                <MenuItem value={IStatusQuantity.DEFECTIVE}>Sản phẩm bị hư</MenuItem>
                {!hasLostData && (
                    <MenuItem value={IStatusQuantity.REDUNDANT}>Sản phẩm thừa</MenuItem>
                )}
                <MenuItem value={IStatusQuantity.ENOUGH}>Đủ sản phẩm</MenuItem>
            </Select>
            <Input
                type={'number'}
                placeholder={'Nhập số lượng'}
                value={
                    statusQuantities === IStatusQuantity.LOST
                        ? lostAmount
                        : statusQuantities === IStatusQuantity.DEFECTIVE
                            ? defectiveAmount
                            : redundantAmount
                }
                onChange={(e) => {
                    handleOnChange(e.target.value);
                }}
                style={{ width: '200px' }}
            />
        </div>
    );
};


export default CreateInventoryCheck;
