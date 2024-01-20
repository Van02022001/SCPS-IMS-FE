import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Typography,
    Button,
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
    DialogTitle,
} from '@mui/material';
// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
//notification
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// api

import Scrollbar from '~/components/scrollbar/Scrollbar';
import { InventoryReportListHead } from '~/sections/@dashboard/manager/inventoryReport';
import { editExportRequestReceipt, getCustomerRequestById } from '~/data/mutation/customerRequest/CustomerRequest-mutation';

import SnackbarError from '~/components/alert/SnackbarError';
import Label from '~/components/label/Label';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import { editImportReceiptConfirm, editReceiptStartImport } from '~/data/mutation/importRequestReceipt/ImportRequestReceipt-mutation';
import CreateExportRequestReceiptForm from '~/sections/auth/inventory_staff/exportRequestReceipt/CreateExportRequestReceiptForm';


const TABLE_HEAD = [

    { id: 'id', label: 'Mã phiếu', alignRight: false },
    { id: 'description', label: 'Mô tả', alignRight: false },
    { id: 'createdBy', label: 'Người tạo', alignRight: false },
    { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
    // { id: 'type', label: 'Loại yêu cầu', alignRight: false },
    { id: 'status', label: 'Trạng thái', alignRight: false },
];


const NotificationToExportRequestInventory = ({
    onClose,
    isOpen,
    mode,
}) => {
    const location = useLocation();
    const { state } = location;
    const receiptId = state?.receiptId;

    const [receiptData, setReceiptData] = useState([]);
    // const [expandedItem, setExpandedItem] = useState(subCategoryId);
    const [currentTab, setCurrentTab] = useState(0);
    //props
    const [currentStatus, setCurrentStatus] = useState('');
    const [selectedReceiptDetailId, setSelectedReceiptDetailId] = useState([]);
    const [importReceipstData, setImportReceipstData] = useState(null);

    const [isOpenImportForm, setIsOpenImportForm] = useState(false);
    //thông báo
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);

    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');

    const navigate = useNavigate();
    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Customer request receipt retrieved successfully') {
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
        setSelectedReceiptDetailId(item.id === selectedReceiptDetailId ? null : item.id);
    };
    //===================================================== Những hàm update thay đổi data =====================================================

    useEffect(() => {
        getCustomerRequestById(receiptId)
            .then((response) => {
                const data = response.data;

                setReceiptData(data);
                setCurrentStatus(data.status);
                console.log(receiptData);
            })

            .catch((error) => {
                console.error('Error fetching items:', error);
            });
    }, [receiptId, currentStatus]);

    const updateExportReceiptConfirm = async () => {
        try {
            // if (currentStatus !== 'Pending_Approval') {
            //     const errorMessage = 'Không thể xác nhận. Phiếu này không ở trạng thái Chờ phê duyệt !';
            //     handleErrorMessage(errorMessage);
            //     return;
            // }

            const newStatus = 'IN_PROGRESS';

            const response = await editExportRequestReceipt(receiptData.id, newStatus);

            if (response.status === '200 OK') {
                // Handle success if needed
                handleSuccessMessage('Customer request receipt retrieved successfully');
            }

            setCurrentStatus(newStatus);

            console.log('Product status updated:', response);
        } catch (error) {
            console.error('Error updating category status:', error);
            handleErrorMessage(error.response?.data?.message || 'An error occurred.');
        }
    };

    const updateReceiptStartImport = async () => {
        try {
            // if (currentStatus !== 'Approved') {
            //     const errorMessage = 'Không thể Tiến hành nhập kho. Phiếu này không ở trạng thái Đã xác nhận !';
            //     handleErrorMessage(errorMessage);
            //     return;
            // }

            const newStatus = 'IN_PROGRESS';

            const response = await editReceiptStartImport(receiptData.id, newStatus);

            if (response.status === '200 OK') {
                handleSuccessMessage(response.message);
            }

            setCurrentStatus(newStatus);

            console.log('Product status updated:', response);
        } catch (error) {
            console.error('Error updating category status:', error);
        }
    };
    const handleOpenForm = () => {

        if (receiptData && receiptData.status === 'IN_PROGRESS') {
            setIsOpenImportForm(true);

            setImportReceipstData({
                id: receiptData.id,
                code: receiptData.code,
                description: receiptData.description,
                createdBy: receiptData.createdBy,
                details: receiptData.details || [],
                lastModifiedBy: receiptData.lastModifiedBy || '',
                status: receiptData.status || '',
                totalPrice: receiptData.totalPrice || 0,
                totalQuantity: receiptData.totalQuantity || 0,
                type: receiptData.type || '',
                updatedAt: receiptData.updatedAt || '',
                warehouseId: receiptData.warehouseId || 0,
            });

            console.log(receiptData);
        } else {
            const errorMessage = 'Tiến hành nhập kho để tạo phiếu !';
            handleErrorMessage(errorMessage);
        }
    };

    const handleSaveLocation = (successMessage, newStatus) => {
        setSnackbarSuccessMessage(
            successMessage === 'Cập nhật vị trí các sản phẩm thành công.'
                ? 'Cập nhật vị trí các sản phẩm thành công.'
                : 'Thành công',
        );
        setSnackbarSuccessOpen(true);
        setCurrentStatus(newStatus);
        console.log(newStatus);
    };

    const handleCloseAddCategoryDialog = () => {
        setIsOpenImportForm(false);
    };

    // const handleCloseCreateExportRequestForm = (isClosed) => {
    //     setIsExportFormOpen(isClosed);
    // };
    const handleCloseForm = (isClosed) => {
        setIsOpenImportForm(false);
    };

    const handleNavigate = () => {
        navigate('/inventory-staff/requests-export-receipt');
    };
    //==========================================================================================================

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
                    Yêu cầu xuất kho
                </Typography>
            </Stack>
            <Card>

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <InventoryReportListHead
                                // order={order}
                                // orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={receiptData.length}
                            // numSelected={selected.length}
                            />

                            <React.Fragment key={receiptData.id}>
                                <TableRow
                                    hover
                                    key={receiptData.id}
                                    tabIndex={-1}

                                    selected={selectedReceiptDetailId === receiptData.id}
                                    onClick={() => handleItemClickDetail(receiptData)}
                                >
                                    <TableCell align="left">{receiptData.code}</TableCell>
                                    <TableCell align="left">{receiptData.note}</TableCell>
                                    <TableCell align="left">{receiptData.createdBy}</TableCell>
                                    <TableCell align="left">{receiptData.createdAt}</TableCell>
                                    <TableCell align="left">
                                        <Label
                                            color={
                                                (receiptData.status === 'Pending_Approval' &&
                                                    'warning') ||
                                                (receiptData.status === 'Approved' && 'success') ||
                                                (receiptData.status === ' IN_PROGRESS' && 'warning') ||
                                                (receiptData.status === 'Complete' && 'primary') ||
                                                (receiptData.status === 'Inactive' && 'error') ||
                                                'default'
                                            }
                                        >
                                            {receiptData.status === 'Pending_Approval'
                                                ? 'Chờ xác nhận'
                                                : receiptData.status === 'Approved'
                                                    ? 'Đã xác nhận'
                                                    : receiptData.status === 'IN_PROGRESS'
                                                        ? 'Đang tiến hành'
                                                        : receiptData.status === 'Completed'
                                                            ? 'Hoàn thành'
                                                            : 'Ngừng hoạt động'}
                                        </Label>
                                    </TableCell>
                                </TableRow>

                                {selectedReceiptDetailId === receiptData.id && (
                                    <TableRow>
                                        <TableCell colSpan={8}>
                                            {/* <div>
                                                {currentStatus === 'IN_PROGRESS' && (
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Button variant="contained" color="primary" onClick={handleOpenForm}>
                                                            Tạo phiếu xuất kho
                                                        </Button>
                                                    </div>
                                                )}
                                                <Dialog maxWidth="lg" fullWidth open={isOpenImportForm}>
                                                    <DialogTitle style={{ textAlign: 'center' }}>
                                                        Phiếu Xuất Kho
                                                        <IconButton style={{ float: 'right' }} onClick={handleCloseForm}>
                                                            <CloseIcon color="primary" />
                                                        </IconButton>{' '}
                                                    </DialogTitle>

                                                    <CreateExportRequestReceiptForm
                                                        isOpen={isOpenImportForm}
                                                        onClose={handleCloseAddCategoryDialog}
                                                        importReceipst={receiptData}
                                                        onSave={handleSaveLocation}

                                                    />
                                                </Dialog>
                                            </div> */}
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
                                                                value={receiptData.code}
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
                                                                value={receiptData.note}
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
                                                                            ? 'Chờ xác nhận'
                                                                            : currentStatus === 'Approved'
                                                                                ? 'Đã xác nhận'
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
                                                                sx={{ marginBottom: 4, gap: 5 }}
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
                                                                        sx={{ width: '100%', fontSize: '14px', pointerEvents: 'none' }}
                                                                        value={receiptData.createdBy}
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
                                                                    disabled
                                                                    size="small"
                                                                    variant="outlined"
                                                                    label="Ngày tạo"
                                                                    sx={{ width: '70%', pointerEvents: 'none' }}
                                                                    value={receiptData.createdAt}
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
                                                                <Typography variant="body1">Ngày cập nhập:</Typography>
                                                                <TextField
                                                                    disabled
                                                                    size="small"
                                                                    variant="outlined"
                                                                    label="Ngày tạo"
                                                                    sx={{ width: '70%', pointerEvents: 'none' }}
                                                                    value={receiptData.updatedAt}
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
                                                                        <TableCell>Đơn vị</TableCell>
                                                                    </TableRow>
                                                                    {receiptData.details.map((items) => {
                                                                        return (
                                                                            <TableRow key={items.id}>
                                                                                <TableCell>{items.item.code}</TableCell>
                                                                                <TableCell>{items.item.subcategoryName}</TableCell>
                                                                                <TableCell>{items.quantity}</TableCell>
                                                                                <TableCell>{items.unitName}</TableCell>
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
                                                                    <TableCell>{receiptData.totalQuantity}</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell>Tổng tiền:</TableCell>
                                                                    <TableCell>{receiptData.totalPrice} VND</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </TableContainer>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                )}
                                <Stack spacing={4} margin={2}>
                                    <Grid container spacing={1} sx={{ gap: '10px' }}>
                                        {/* <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveIcon />}
                                onClick={updateImportReceipt}
                            >
                                Cập nhật
                            </Button> */}

                                        {/* {currentStatus === 'Pending_Approval' && (
                                            <div>
                                                <Button variant="contained" color="primary" onClick={updateExportReceiptConfirm}>
                                                    Xác nhận
                                                </Button>
                                            </div>
                                        )}

                                        {currentStatus === 'Approved' && (
                                            <div>
                                                <Button variant="contained" color="warning" onClick={updateReceiptStartImport}>
                                                    Tiến hành nhập kho
                                                </Button>
                                            </div>
                                        )} */}
                                        <SnackbarSuccess
                                            open={open}
                                            handleClose={handleClose}
                                            message={successMessage}
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
                                        <SnackbarError
                                            open={open1}
                                            handleClose={handleClose}
                                            message={errorMessage}
                                            action={action}
                                            style={{ bottom: '16px', right: '16px' }}
                                        />

                                    </Grid>
                                </Stack>
                            </React.Fragment>
                        </Table>

                    </TableContainer>
                </Scrollbar>

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

export default NotificationToExportRequestInventory;
