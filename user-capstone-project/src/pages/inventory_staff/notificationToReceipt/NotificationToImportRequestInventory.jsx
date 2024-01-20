import React, { useEffect, useState } from 'react';
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
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Scrollbar from '~/components/scrollbar/Scrollbar';
import { InventoryReportListHead } from '~/sections/@dashboard/manager/inventoryReport';
import { editImportReceiptConfirm, editReceiptStartImport, getImportRequestById } from '~/data/mutation/importRequestReceipt/ImportRequestReceipt-mutation';
import SnackbarError from '~/components/alert/SnackbarError';
import Label from '~/components/label/Label';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import CreateImportReceiptForm from '~/sections/auth/inventory_staff/importRequestReceipt/CreateImportReceiptForm';

const TABLE_HEAD = [

    { id: 'id', label: 'Mã phiếu', alignRight: false },
    { id: 'description', label: 'Mô tả', alignRight: false },
    { id: 'createdBy', label: 'Người tạo', alignRight: false },
    { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
    // { id: 'type', label: 'Loại yêu cầu', alignRight: false },
    { id: 'status', label: 'Trạng thái', alignRight: false },
];


const NotificationToImportRequestInventory = ({
    onClose,
    isOpen,
    mode,
}) => {
    const location = useLocation();
    const { state } = location;
    const receiptId = state?.receiptId;

    // const [tab1Data, setTab1Data] = useState({ categories_id: [] });
    // const [tab2Data, setTab2Data] = useState({});

    const navigate = useNavigate();

    const [receiptData, setReceiptData] = useState([]);
    // const [expandedItem, setExpandedItem] = useState(subCategoryId);
    const [currentTab, setCurrentTab] = useState(0);
    //props
    const [isOpenImportForm, setIsOpenImportForm] = useState(false);

    const [currentStatus, setCurrentStatus] = useState('');
    const [selectedReceiptDetailId, setSelectedReceiptDetailId] = useState([]);

    const [importReceipstData, setImportReceipstData] = useState(null);
    //thông báo
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);

    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');

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
    };


    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}></Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="lage" />
            </IconButton>
        </React.Fragment>
    );

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
    const handleItemClickDetail = (item) => {
        setSelectedReceiptDetailId(item.id === selectedReceiptDetailId ? null : item.id);
    };
    //===================================================== Những hàm update thay đổi data =====================================================
    const updateImportReceiptConfirm = async () => {
        try {
            // if (currentStatus !== 'Pending_Approval') {
            //     const errorMessage = 'Không thể xác nhận. Phiếu này không ở trạng thái Chờ phê duyệt !';
            //     handleErrorMessage(errorMessage);
            //     return;
            // }

            const newStatus = 'Approved'; // Set the desired status

            const response = await editImportReceiptConfirm(receiptData.id, newStatus);

            if (response.status === '200 OK') {
                // Handle success if needed
                handleSuccessMessage('Import request receipt confirmed successfully');
            }

            // updateImportReceiptConfirmInList(importReceiptId, newStatus);
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

            // updateImportReceiptConfirmInList(importReceiptId, newStatus);
            setCurrentStatus(newStatus);

            console.log('Product status updated:', response);
        } catch (error) {
            console.error('Error updating category status:', error);
        }
    };

    useEffect(() => {
        getImportRequestById(receiptId)
            .then((response) => {
                const data = response.data;
                setReceiptData(data);
                console.log(receiptData);
            })

            .catch((error) => {
                console.error('Error fetching items:', error);
            });
    }, [receiptId, currentStatus]);

    const handleCloseForm = (isClosed) => {
        setIsOpenImportForm(false);
    };
    const handleCloseAddCategoryDialog = () => {
        setIsOpenImportForm(false);
    };
    const handleOpenForm = () => {
        setIsOpenImportForm(true);
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
    const handleNavigate = () => {
        navigate('/inventory-staff/requests-import-receipt');
    };
    //==========================================================================================================

    return (
        <>
            <Helmet>
                <title>Kiểm kho</title>
            </Helmet>

            <Stack direction="row" alignItems="center" mb={5}>
                <Button onClick={handleNavigate} >
                    <ArrowBackIcon fontSize="large" color="action" />
                </Button>
                <Typography variant="h4" gutterBottom>
                    Phiếu yêu cầu nhập kho
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
                                    <TableCell align="left">{receiptData.description}</TableCell>
                                    <TableCell align="left">{receiptData.createdBy}</TableCell>
                                    <TableCell align="left">{receiptData.createdAt}</TableCell>
                                    <TableCell align="left">
                                        <Label
                                            color={
                                                (receiptData.status === 'Pending_Approval' &&
                                                    'warning') ||
                                                (receiptData.status === 'Approved' && 'success') ||
                                                (receiptData.status === ' IN_PROGRESS' && 'primary') ||
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
                                                {receiptData.status === 'IN_PROGRESS' && (
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Button variant="contained" color="primary" onClick={handleOpenForm}>
                                                            Tạo phiếu nhập kho
                                                        </Button>
                                                    </div>
                                                )}
                                                <Dialog maxWidth="lg" fullWidth open={isOpenImportForm}>
                                                    <DialogTitle style={{ textAlign: 'center' }}>
                                                        Phiếu Nhập Kho
                                                        <IconButton style={{ float: 'right' }} onClick={handleCloseForm}>
                                                            <CloseIcon color="primary" />
                                                        </IconButton>{' '}
                                                    </DialogTitle>

                                                    <CreateImportReceiptForm
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
                                                                value={receiptData.description}
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
                                                            <Typography variant="body1">Loại phiếu:</Typography>
                                                            <TextField
                                                                size="small"
                                                                InputProps={{ readOnly: true }}
                                                                variant="outlined"
                                                                label="Loại phiếu"
                                                                sx={{ width: '70%', pointerEvents: 'none' }}
                                                                value={receiptData.type === 'PHIEU_YEU_CAU_NHAP_KHO' ? 'Phiếu yêu cầu nhập kho' : 'Phiếu khác'}
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
                                                                        <TableCell></TableCell>
                                                                        <TableCell>Mã sản phẩm</TableCell>
                                                                        <TableCell>Tên sản phẩm</TableCell>
                                                                        <TableCell>Số lượng</TableCell>
                                                                        <TableCell>Đơn vị</TableCell>
                                                                        <TableCell>Tổng Giá</TableCell>
                                                                        <TableCell>Thương hiệu</TableCell>
                                                                        <TableCell>Xuất xứ</TableCell>
                                                                        <TableCell>Nhà cung cấp</TableCell>
                                                                    </TableRow>
                                                                    {receiptData.details.map((items) => {
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
                                                                                <TableCell>{items.unitName}</TableCell>
                                                                                <TableCell>
                                                                                    {items.totalPrice?.toLocaleString('vi-VN')}
                                                                                </TableCell>
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
                                                                    <TableCell>{receiptData.totalQuantity}</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </TableContainer>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}

                            </React.Fragment>
                            <Stack spacing={4} margin={2}>
                                <Grid container spacing={1} sx={{ gap: '10px' }}>
                                    {/* {receiptData.status === 'Pending_Approval' && (
                                        <div>
                                            <Button variant="contained" color="primary" onClick={updateImportReceiptConfirm}>
                                                Xác nhận
                                            </Button>
                                        </div>
                                    )}

                                    {receiptData.status === 'Approved' && (
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

export default NotificationToImportRequestInventory;
