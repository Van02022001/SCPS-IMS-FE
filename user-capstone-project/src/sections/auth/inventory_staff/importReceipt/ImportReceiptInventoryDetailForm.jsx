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
import AddLocationsImportForm from './AddLocationsImportForm';
import SnackbarError from '~/components/alert/SnackbarError';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
// import CreateImportReceiptForm from './CreateImportReceiptForm';

const ImportReceiptInventoryDetailForm = ({
    importReceipt,
    importReceiptId,
    updateImportReceiptInList,
    updateImportReceiptConfirmInList,
    onClose,
    isOpen,
    mode,
}) => {
    const [open, setOpen] = React.useState(false);
    // const [expandedItem, setExpandedItem] = useState(subCategoryId);
    const [formHeight, setFormHeight] = useState(0);
    const [currentTab, setCurrentTab] = useState(0);
    //props
    const [isOpenImportForm, setIsOpenImportForm] = useState(false);
    const [importReceipstData, setImportReceipstData] = useState(null);

    const [editedImportReceipt, setEditedImportReceipt] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('');

    const [importRecieptParams, setImportRecieptParams] = useState({
        warehouseId: null,
        inventoryStaffId: null,
        description: '',
        details: [],
    });
    console.log(formHeight, importRecieptParams, importReceipstData);
    // Thông báo
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleMessage = (message) => {
        setOpen(true);
        // Đặt logic hiển thị nội dung thông báo từ API ở đây
        if (message === 'Update SubCategory status successfully.') {
            setMessage('Cập nhập trạng thái danh mục thành công');
        } else if (message === 'Update SubCategory successfully.') {
            setMessage('Cập nhập danh mục thành công');
            console.error('Error message:', errorMessage);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}></Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="lage" />
            </IconButton>
        </React.Fragment>
    );

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
    const handleCloseForm = () => {
        setIsOpenImportForm(false);
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
    console.log(importReceipst, 'Find itemid');
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
                            <AddLocationsImportForm
                                importReceipst={importReceipst}
                                onSave={handleSaveImport}
                                onClose={handleCloseForm}
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
                                >
                                    <Typography variant="body1">Mã phiếu:</Typography>
                                    <TextField
                                        size="small"
                                        InputProps={{ readOnly: true }}
                                        variant="outlined"
                                        label="Tên sản phẩm"
                                        sx={{ width: '70%', pointerEvents: 'none' }}
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
                                >
                                    <Typography variant="body1">Mô tả:</Typography>
                                    <TextField
                                        id="outlined-multiline-static"
                                        InputProps={{ readOnly: true }}
                                        multiline
                                        rows={4}
                                        size="small"
                                        variant="outlined"
                                        label="Mô tả"
                                        sx={{ width: '70%', pointerEvents: 'none' }}
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
                                    >
                                        <Typography variant="body1">Trạng thái:</Typography>
                                        <TextField
                                            size="small"
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            label="Trạng thái"
                                            sx={{ width: '70%', pointerEvents: 'none' }}
                                            value={
                                                currentStatus === 'Pending_Approval'
                                                    ? 'Chờ phê duyệt'
                                                    : currentStatus === 'Approved'
                                                        ? 'Đã xác nhận'
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
                                        sx={{ marginBottom: 4, gap: 5, marginLeft: 0.1 }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Người tạo:{' '}
                                        </Typography>
                                        <Grid xs={8.5}>
                                            <TextField
                                                size="small"
                                                InputProps={{ readOnly: true }}
                                                labelId="group-label"
                                                id="group-select"
                                                sx={{ width: '99%', fontSize: '14px', pointerEvents: 'none' }}
                                                value={importReceipst.createdBy}
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
                                            size="small"
                                            variant="outlined"
                                            label="Ngày tạo"
                                            sx={{ width: '70%', pointerEvents: 'none' }}
                                            value={importReceipst.createdAt}
                                            InputProps={{ readOnly: true }}
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
                                                <TableCell></TableCell>
                                                <TableCell>Mã sản phẩm</TableCell>
                                                <TableCell>Tên sản phẩm</TableCell>
                                                <TableCell>Số lượng</TableCell>
                                                <TableCell>Số lượng chênh lệch</TableCell>
                                                <TableCell>Giá sản phẩm</TableCell>
                                                <TableCell>Tổng</TableCell>
                                                <TableCell>Đơn vị</TableCell>
                                                <TableCell>Thương hiệu</TableCell>
                                                <TableCell>Xuất xứ</TableCell>
                                                <TableCell>Nhà cung cấp</TableCell>
                                            </TableRow>
                                            {importReceipst.details.map((items) => {
                                                return (
                                                    <TableRow key={items.id}>
                                                        <TableCell>
                                                            <img
                                                                src={items.item.imageUrl}
                                                                alt={`Item ${items.code}`}
                                                                width="48"
                                                                height="48"
                                                            />
                                                        </TableCell>
                                                        <TableCell>{items.item.code}</TableCell>
                                                        <TableCell>{items.item.subcategoryName}</TableCell>
                                                        <TableCell>{items.quantity}</TableCell>
                                                        <TableCell>{items.discrepancyQuantity}</TableCell>
                                                        <TableCell>{items.price?.toLocaleString('vi-VN')}</TableCell>
                                                        <TableCell>
                                                            {items.totalPrice?.toLocaleString('vi-VN')}
                                                        </TableCell>
                                                        <TableCell>{items.unitName}</TableCell>
                                                        <TableCell>{items.item.brandName}</TableCell>
                                                        <TableCell>{items.item.originName}</TableCell>
                                                        <TableCell>{items.item.supplierName}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    <TableBody style={{ marginTop: 30 }}>
                                        <Typography mt={2} variant="h6">
                                            Thông tin phiếu
                                        </Typography>
                                        <TableRow>
                                            <TableCell>Tổng số lượng:</TableCell>
                                            <TableCell>
                                                {importReceipst.totalQuantity?.toLocaleString('vi-VN')}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Tổng tiền:</TableCell>
                                            <TableCell>
                                                {importReceipst.totalPrice?.toLocaleString('vi-VN')} VND
                                            </TableCell>
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
            <SnackbarSuccess
                open={snackbarSuccessOpen}
                handleClose={() => {
                    setSnackbarSuccessOpen(false);
                    setSnackbarSuccessMessage('');
                }}
                message={snackbarSuccessMessage}
                style={{ bottom: '16px', right: '16px' }}
            />
            <SnackbarError
                open={open}
                handleClose={handleClose}
                message={errorMessage}
                action={action}
                style={{ bottom: '16px', right: '16px' }}
            />
        </div>
    ) : null;
};

export default ImportReceiptInventoryDetailForm;
