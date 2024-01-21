import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Tab,
    Tabs,
    Stack,
    Grid,
    TextField,
    CardContent,
    Card,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
// icons
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
//notification
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// api

import SnackbarError from '~/components/alert/SnackbarError';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';


const InventoryCheckDetail = ({ inventoryCheckData, inventoryCheckId, onClose, isOpen, mode }) => {
    // const [tab1Data, setTab1Data] = useState({ categories_id: [] });
    // const [tab2Data, setTab2Data] = useState({});

    // const [expandedItem, setExpandedItem] = useState(subCategoryId);
    const [formHeight, setFormHeight] = useState(0);
    const [currentTab, setCurrentTab] = useState(0);
    //props
    const [editedImportReceipt, setEditedImportReceipt] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('');

    // const [positionedSnackbarOpen, setPositionedSnackbarOpen] = useState(false);
    // const [positionedSnackbarError, setPositionedSnackbarError] = useState(false);
    // form

    const [iventoryCheckParams, setInventoryCheckParams] = useState({
        warehouseId: null,
        inventoryStaffId: null,
        description: '',
        details: [],
    });

    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Import request receipt confirmed successfully') {
            setSuccessMessage('Thành công');
        } else if (message === 'Import process started successfully') {
            setSuccessMessage('Thành công');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        setErrorMessage(message);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Receipt is not in the approved state for processing') {
            setErrorMessage('Phiếu không ở trạng thái được phê duyệt để xử lý !');
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

    //========================== Hàm notification của trang ==================================

    // const handleTab1DataChange = (event) => {
    //     // Cập nhật dữ liệu cho tab 1 tại đây
    //     setTab1Data({ ...tab1Data, [event.target.name]: event.target.value });
    // };

    // const handleTab2DataChange = (event) => {
    //     // Cập nhật dữ liệu cho tab 2 tại đây
    //     setTab2Data({ ...tab2Data, [event.target.name]: event.target.value });
    // };
    const handleChangeTab = (event, newValue) => {
        setCurrentTab(newValue);
    };

    useEffect(() => {
        if (isOpen) {
            setFormHeight(1000);
        } else {
            setFormHeight(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (mode === 'create') {
            setInventoryCheckParams({
                warehouseId: 0,
                inventoryStaffId: 0,
                description: 'string',
                details: [
                    {
                        id: 0,
                        itemId: 0,
                        quantity: 0,
                        unitPrice: 0,
                        unitId: 0,
                        description: '',
                    },
                ],
            });
        } else {
            const checkInventory = inventoryCheckData.find((o) => o.id === inventoryCheckId);
            console.log(checkInventory);
            if (checkInventory) {
                const importRecieptParams = {
                    // warehouseId: 0,
                    // inventoryStaffId: 0,
                    // description: "string",
                    // details: [
                    //     {
                    //         id: 0,
                    //         itemId: 0,
                    //         quantity: 0,
                    //         unitPrice: 0,
                    //         unitId: 0,
                    //         description: "",
                    //     }
                    // ]
                };

                setEditedImportReceipt(importRecieptParams);
                setCurrentStatus(checkInventory.status);
                console.log(importRecieptParams);
            }
        }
    }, [inventoryCheckData, inventoryCheckId, mode]);


    //===================================================== Những hàm update thay đổi data =====================================================
    const checkInventory = inventoryCheckData.find((o) => o.id === inventoryCheckId);

    if (!checkInventory) {
        return null;
    }

    //==========================================================================================================

    // const handleDataReload = () => {
    //     getAllImportReceipt()
    //         .then((response) => {
    //             const data = response.data;
    //             if (Array.isArray(data)) {
    //                 setImportReceiptData(data);
    //             } else {
    //                 console.error('API response is not an array:', data);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching import receipts:', error);
    //         });
    // };

    return editedImportReceipt ? (
        <div
            id="productDetailForm"
            className="ProductDetailForm"
            style={{
                backgroundColor: 'white',
                zIndex: 999,
            }}
        >
            <Tabs value={currentTab} onChange={handleChangeTab} indicatorColor="primary" textColor="primary">
                <Tab label="Thông tin" />
                {/* <Tab label="Thông tin thêm" /> */}
                {/* <Tab label="Tồn kho" /> */}
            </Tabs>

            {currentTab === 0 && (
                <div>
                    {/* {currentStatus === 'IN_PROGRESS' && (
                            
                        )} */}

                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Mã phiếu:</Typography>
                                    <TextField
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Tên sản phẩm"
                                        sx={{ width: '70%' }}
                                        value={checkInventory.code}
                                    />
                                </Grid>

                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Mô tả:</Typography>
                                    <TextField
                                        InputProps={{ readOnly: true }}
                                        id="outlined-multiline-static"
                                        multiline
                                        rows={4}
                                        size="small"
                                        variant="outlined"
                                        label="Mô tả"
                                        sx={{ width: '70%' }}
                                        value={checkInventory.description}
                                    />
                                </Grid>
                            </Grid>

                            {/* 5 field bên phải*/}
                            <Grid item xs={6}>
                                <div style={{ marginLeft: 30 }}>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="body1">Trạng thái:</Typography>
                                        <TextField
                                            InputProps={{ readOnly: true }}
                                            size="small"
                                            variant="outlined"
                                            label="Trạng thái"
                                            sx={{ width: '70%', pointerEvents: 'none' }}
                                            value={
                                                currentStatus === 'Pending_Approval'
                                                    ? 'Chờ phê duyệt'
                                                    : currentStatus === 'Approved'
                                                        ? 'Đã xác nhận'
                                                        : currentStatus === 'IN_PROGRESS'
                                                            ? 'Đang tiến hành'
                                                            : currentStatus === 'Completed'
                                                                ? 'Hoàn thành'
                                                                : 'Ngừng hoạt động'
                                            }
                                        />
                                    </Grid>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Người tạo:{' '}
                                        </Typography>
                                        <Grid xs={8.5}>
                                            <TextField
                                                InputProps={{ readOnly: true }}
                                                size="small"
                                                labelId="group-label"
                                                id="group-select"
                                                sx={{ width: '98.5%', fontSize: '14px', marginLeft: 1 }}
                                                value={checkInventory.createdBy}
                                            />
                                            {/* {categories_id.map((category) => (
                                                    <MenuItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </MenuItem>
                                                ))} */}
                                        </Grid>
                                    </Grid>

                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="body1">Ngày tạo:</Typography>
                                        <TextField
                                            InputProps={{ readOnly: true }}
                                            size="small"
                                            variant="outlined"
                                            label="Ngày tạo"
                                            sx={{ width: '70%' }}
                                            value={checkInventory.createdAt}
                                        />
                                    </Grid>
                                </div>
                            </Grid>
                        </Grid>
                    </Stack>

                    <div>
                        <Card sx={{ marginTop: 5 }}>
                            <CardContent>
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            <TableRow
                                                variant="subtitle1"
                                                sx={{
                                                    fontSize: '20px',
                                                    backgroundColor: '#f0f1f3',
                                                    height: 50,
                                                    textAlign: 'start',
                                                    fontFamily: 'bold',
                                                    padding: '10px 0 0 20px',
                                                }}

                                            >
                                                <TableCell>Mã sản phẩm</TableCell>
                                                <TableCell>Tên sản phẩm</TableCell>
                                                <TableCell>Số lượng ban đầu</TableCell>
                                                <TableCell>Số lượng thực tế</TableCell>
                                                <TableCell>Chênh lệch số lượng</TableCell>
                                                <TableCell>Giá trị chênh lệch</TableCell>
                                                <TableCell>Ghi chú</TableCell>
                                            </TableRow>
                                            {checkInventory.details.map((items) => {
                                                return (
                                                    <TableRow key={items.id}
                                                        title={
                                                            [items.locations.map(
                                                                (location) =>
                                                                    `${location.shelfNumber} - ${location.binNumber} - Số lượng: ${location.quantity}`,
                                                            ),
                                                            ].join('\n')}
                                                    >
                                                        <TableCell>{items.codeItem}</TableCell>
                                                        <TableCell>{items.itemName}</TableCell>
                                                        <TableCell>{items.expectedQuantity}</TableCell>
                                                        <TableCell>{items.actualQuantity}</TableCell>
                                                        <TableCell>{items.discrepancyQuantity}</TableCell>
                                                        <TableCell>{items.discrepancyValue}</TableCell>
                                                        <TableCell>{items.note}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    {/* <TableBody style={{ marginTop: 30 }}>
                                        <Typography variant="h6">Thông tin phiếu</Typography>
                                        <TableRow>
                                            <TableCell>Tổng số lượng:</TableCell>
                                            <TableCell>{checkInventory.totalQuantity}</TableCell>
                                        </TableRow>
                                    </TableBody> */}
                                    {/* <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
                                        Xác Nhận
                                    </Button> */}
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </div>
                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={1} sx={{ gap: '10px' }}>
                            <SnackbarSuccess
                                open={open}
                                handleClose={handleClose}
                                message={successMessage}
                                action={action}
                                style={{ bottom: '16px', right: '16px' }}
                            />
                            <SnackbarError
                                open={open1}
                                handleClose={handleClose}
                                message={errorMessage}
                                action={action}
                                style={{ bottom: '16px', right: '16px' }}
                            />
                        </Grid>
                    </Stack>
                </div>
            )}
        </div>
    ) : null;
};

export default InventoryCheckDetail;
