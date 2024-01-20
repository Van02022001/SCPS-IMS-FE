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
    Dialog,
} from '@mui/material';
//notification
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// api

import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';
import AddLocationToExportReceipt from '../exportReceipt/AddLocationToExportReceipt';


const InternalExportDetail = ({
    importReceipt,
    importReceiptId,
    updateImportReceiptInList,
    updateImportReceiptConfirmInList,
    onClose,
    isOpen,
    mode,
}) => {
    // const [tab1Data, setTab1Data] = useState({ categories_id: [] });
    // const [tab2Data, setTab2Data] = useState({});

    // const [expandedItem, setExpandedItem] = useState(subCategoryId);
    const [formHeight, setFormHeight] = useState(0);
    const [currentTab, setCurrentTab] = useState(0);
    //props
    const [isOpenImportForm, setIsOpenImportForm] = useState(false);
    const [importReceipstData, setImportReceipstData] = useState(null);

    const [editedImportReceipt, setEditedImportReceipt] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('');
    const [importReceiptData, setImportReceiptData] = useState([]);

    // form
    const [importRecieptParams, setImportRecieptParams] = useState({
        warehouseId: null,
        inventoryStaffId: null,
        description: '',
        details: [],
    });
    console.log(importRecieptParams, importReceiptData, importReceipstData, formHeight);
    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Import process started successfully') {
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
            setImportRecieptParams({
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
            const importReceipst = importReceipt.find((o) => o.id === importReceiptId);
            console.log(importReceipst);
            if (importReceipst) {
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
                setCurrentStatus(importReceipst.status);
                console.log(importRecieptParams);
            }
        }
    }, [importReceiptId, importReceipt, mode]);
    //===================================================== Những hàm update thay đổi data =====================================================
    const importReceipst = importReceipt.find((o) => o.id === importReceiptId);

    if (!importReceipst) {
        return null;
    }

    const handleOpenForm = () => {
        const validImportReceipst = importReceipt.find((o) => o.id === importReceiptId);

        if (validImportReceipst && validImportReceipst.status === 'NOT_COMPLETED') {
            setIsOpenImportForm(true);

            setImportReceipstData({
                id: validImportReceipst.id,
                code: validImportReceipst.code,
                description: validImportReceipst.description,
                createdBy: validImportReceipst.createdBy,
                details: validImportReceipst.details || [],
                lastModifiedBy: validImportReceipst.lastModifiedBy || '',
                status: validImportReceipst.status || '',
                totalPrice: validImportReceipst.totalPrice || 0,
                totalQuantity: validImportReceipst.totalQuantity || 0,
                type: validImportReceipst.type || '',
                updatedAt: validImportReceipst.updatedAt || '',
                warehouseId: validImportReceipst.warehouseId || 0,
            });

            console.log(validImportReceipst);
        } else {
            console.error('Không tìm thấy dữ liệu hợp lệ cho importReceiptId: ', importReceiptId);
        }
    };


    const handleSaveImport = (successMessage, newStatus) => {
        // You can handle any logic here after saving the category
        setSnackbarSuccessMessage(
            successMessage === 'Cập nhật vị trí các sản phẩm thành công.'
                ? 'Cập nhật vị trí các sản phẩm thành công.'
                : 'Thành công',
        );
        setSnackbarSuccessOpen(true);
        setCurrentStatus(newStatus);
        console.log(newStatus);
    };
    //==========================================================================================================

    const handleCloseAddCategoryDialog = () => {
        setIsOpenImportForm(false);
    };

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
            </Tabs>

            {currentTab === 0 && (
                <div>
                    <div>
                        {currentStatus === 'NOT_COMPLETED' && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="contained" color="primary" onClick={handleOpenForm}>
                                    Thực hiện cập nhập vị trí
                                </Button>
                            </div>
                        )}
                        <Dialog maxWidth="lg" fullWidth open={isOpenImportForm}>
                            <AddLocationToExportReceipt
                                isOpen={isOpenImportForm}
                                onClose={handleCloseAddCategoryDialog}
                                onSave={handleSaveImport}
                                dataReceiptDetail={importReceipst}
                            />
                        </Dialog>
                    </div>
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
                                    InputProps={{ readOnly: true }}
                                >
                                    <Typography variant="body1">Mã phiếu:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Tên sản phẩm"
                                        sx={{ width: '70%' }}
                                        value={importReceipst.code}
                                    />
                                </Grid>

                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                    InputProps={{ readOnly: true }}
                                >
                                    <Typography variant="body1">Mô tả:</Typography>
                                    <TextField
                                        id="outlined-multiline-static"
                                        multiline
                                        rows={4}
                                        size="small"
                                        variant="outlined"
                                        label="Mô tả"
                                        sx={{ width: '70%' }}
                                        value={importReceipst.description}
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
                                        InputProps={{ readOnly: true }}
                                    >
                                        <Typography variant="body1">Trạng thái:</Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Trạng thái"
                                            sx={{ width: '70%' }}
                                            value={
                                                currentStatus === 'Pending_Approval'
                                                    ? 'Chờ phê duyệt'
                                                    : currentStatus === 'IN_PROGRESS'
                                                        ? 'Đang tiến hành'
                                                        : currentStatus === 'NOT_COMPLETED'
                                                            ? 'Chưa hoàn thành'
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
                                        sx={{ marginBottom: 4, gap: 5, marginLeft: 0.05 }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Người tạo:{' '}
                                        </Typography>
                                        <Grid xs={8.5}>
                                            <TextField
                                                size="small"
                                                labelId="group-label"
                                                id="group-select"
                                                sx={{ width: '99%', fontSize: '14px' }}
                                                value={importReceipst.createdBy}
                                                InputProps={{ readOnly: true }}
                                            />
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
                                            value={importReceipst.createdAt}
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
                                                <TableCell>Số lượng</TableCell>
                                                <TableCell>Tổng giá phiếu</TableCell>
                                                <TableCell>Đơn vị</TableCell>
                                            </TableRow>
                                            {importReceipst.details.map((items) => {
                                                return (
                                                    <TableRow key={items.id}>
                                                        <TableCell>{items.item.code}</TableCell>
                                                        <TableCell>{items.item.subcategoryName}</TableCell>
                                                        <TableCell>{items.quantity}</TableCell>
                                                        <TableCell>{items.totalPrice?.toLocaleString('vi-VN')}</TableCell>
                                                        <TableCell>{items.unitName}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    <TableBody style={{ marginTop: 30 }}>
                                        <Typography variant="h6">Thông tin phiếu</Typography>
                                        <TableRow>
                                            <TableCell>Tổng số lượng:</TableCell>
                                            <TableCell>{importReceipst.totalQuantity?.toLocaleString('vi-VN')}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </div>
                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={1} sx={{ gap: '10px' }}></Grid>
                    </Stack>
                </div>
            )}
            <SnackbarError
                open={open}
                handleClose={handleClose}
                message={errorMessage}
                action={action}
                style={{ bottom: '16px', right: '16px' }}
            />
            <SnackbarSuccess
                open={snackbarSuccessOpen}
                handleClose={() => {
                    setSnackbarSuccessOpen(false);
                    setSnackbarSuccessMessage('');
                }}
                message={snackbarSuccessMessage}
                style={{ bottom: '16px', right: '16px' }}
            />
        </div>
    ) : null;
};

export default InternalExportDetail;
