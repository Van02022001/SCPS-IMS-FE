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
    DialogTitle,
    Dialog,
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
import {
    editImportReceipt,
    editImportReceiptConfirm,
    editReceiptStartImport,
} from '~/data/mutation/importRequestReceipt/ImportRequestReceipt-mutation';

import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';

import { getAllImportReceipt } from '~/data/mutation/importReceipt/ImportReceipt-mutation';
import { editExportRequestReceipt } from '~/data/mutation/customerRequest/CustomerRequest-mutation';
import CreateExportReceiptForm from './CreateExportReceiptForm';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';

const ExportReceiptDetailForm = ({
    importReceipt,
    importReceiptId,
    updateImportReceiptInList,
    updateImportReceiptConfirmInList,
    onClose,
    isOpen,
    mode,
}) => {
    const [tab1Data, setTab1Data] = useState({ categories_id: [] });
    const [tab2Data, setTab2Data] = useState({});

    // const [expandedItem, setExpandedItem] = useState(subCategoryId);
    const [formHeight, setFormHeight] = useState(0);
    const [currentTab, setCurrentTab] = useState(0);
    //props
    const [isOpenImportForm, setIsOpenImportForm] = useState(false);
    const [importReceipstData, setImportReceipstData] = useState(null);

    const [editedImportReceipt, setEditedImportReceipt] = useState(null);
    const [editSubCategoryMeta, setEditSubCategoryMeta] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('');
    const [importReceiptData, setImportReceiptData] = useState([]);
    // const [positionedSnackbarOpen, setPositionedSnackbarOpen] = useState(false);
    // const [positionedSnackbarError, setPositionedSnackbarError] = useState(false);
    // form
    const [openAddSubCategoryMetaForm, setOpenAddSubCategoryMetaForm] = useState(false);

    const [importRecieptParams, setImportRecieptParams] = useState({
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

    const handleTab1DataChange = (event) => {
        // Cập nhật dữ liệu cho tab 1 tại đây
        setTab1Data({ ...tab1Data, [event.target.name]: event.target.value });
    };

    const handleTab2DataChange = (event) => {
        // Cập nhật dữ liệu cho tab 2 tại đây
        setTab2Data({ ...tab2Data, [event.target.name]: event.target.value });
    };
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

    // useEffect(() => {

    // }, []);

    // useEffect(() => {
    //     if (mode === 'create') {

    //         setEditSubCategoryMeta({
    //             key: '',
    //             description: '',

    //         });
    //     } else {
    //         if (subCategoryMeta) {

    //             const editedSubCategoryMeta = {
    //                 key: subCategoryMeta.key,
    //                 description: subCategoryMeta.description,
    //             };
    //             setEditSubCategoryMeta(editedSubCategoryMeta);
    //         }
    //     }
    // }, []);
    //===================================================== Những hàm update thay đổi data =====================================================
    const importReceipst = importReceipt.find((o) => o.id === importReceiptId);

    if (!importReceipst) {
        return null;
    }

    const updateImportReceipt = async () => {
        if (!editedImportReceipt) {
            return;
        }
        try {
            const response = await editImportReceipt(importReceiptId, editedImportReceipt);

            if (response.status === '200 OK') {
            }
            updateImportReceiptInList(response.data);
            console.log('Product updated:', response);
        } catch (error) {
            console.error('An error occurred while updating the product:', error);
        }
    };

    const updateExportReceiptConfirm = async () => {
        try {
            const newStatus = 'IN_PROGRESS';

            const response = await editExportRequestReceipt(importReceiptId, newStatus);

            if (response.status === '200 OK') {
                handleSuccessMessage(response.message);
            }

            updateImportReceiptConfirmInList(importReceiptId, newStatus);
            setCurrentStatus(newStatus);

            console.log('Product status updated:', response);
        } catch (error) {
            // console.error('Error updating category status:', error);
            // setIsError(true);
            // setIsSuccess(false);
            // setErrorMessage(error.response.data.message);
            // if (error.response) {
            //     console.log('Error response:', error.response);
            // }
        }
    };
    // const updateReceiptStartImport = async () => {
    //     try {
    //         let newStatus = currentStatus === 'Approved' ? 'Inactive' : 'Completed';

    //         const response = await editExportRequestReceipt(importReceiptId, newStatus);

    //         if (response.status === '200 OK') {
    //             setIsSuccess(true);
    //             setIsError(false);
    //             setSuccessMessage(response.message);
    //             handleMessage(response.message);
    //         }

    //         updateImportReceiptConfirmInList(importReceiptId, newStatus);
    //         setCurrentStatus(newStatus);

    //         console.log('Product status updated:', response);
    //     } catch (error) {
    //         console.error('Error updating category status:', error);
    //         setIsError(true);
    //         setIsSuccess(false);
    //         setErrorMessage(error.response.data.message);
    //         if (error.response) {
    //             console.log('Error response:', error.response);
    //         }
    //     }
    // };
    const handleOpenForm = () => {
        const validImportReceipst = importReceipt.find((o) => o.id === importReceiptId);

        if (validImportReceipst && validImportReceipst.status === 'IN_PROGRESS') {
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
    //==========================================================================================================

    // const handleEdit = (field, value) => {
    //     console.log(`Field: ${field}, Value: ${value}`);
    //     if (field === 'categories_id') {
    //         const categoryIds = value.map(Number).filter(Boolean);
    //         setEditedImportReceipt((prevProduct) => ({
    //             ...prevProduct,
    //             [field]: categoryIds,
    //         }));
    //     } else if (field === 'unit_id' || field === 'unit_mea_id') {
    //         const id = parseInt(value);
    //         setEditedImportReceipt((prevProduct) => ({
    //             ...prevProduct,
    //             [field]: id,
    //         }));
    //     } else {
    //         setEditedImportReceipt((prevProduct) => ({
    //             ...prevProduct,
    //             [field]: value,
    //         }));
    //     }
    // };

    const handleDelete = () => {
        // Xử lý xóa
    };
    const handleDataReload = () => {
        getAllImportReceipt()
            .then((response) => {
                const data = response.data;
                if (Array.isArray(data)) {
                    setImportReceiptData(data);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching import receipts:', error);
            });
    };

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
                {/* <Tab label="Thông tin thêm" /> */}
                {/* <Tab label="Tồn kho" /> */}
            </Tabs>

            {currentTab === 0 && (
                <div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color="primary" onClick={handleOpenForm}>
                                Tạo phiếu xuất kho
                            </Button>
                        </div>
                        <Dialog maxWidth="lg" fullWidth open={isOpenImportForm}>
                            <DialogTitle style={{ textAlign: 'center' }}>
                                Phiếu Xuất Kho
                                <IconButton style={{ float: 'right' }} onClick={handleCloseForm}>
                                    <CloseIcon color="primary" />
                                </IconButton>{' '}
                            </DialogTitle>

                            <CreateExportReceiptForm
                                isOpen={isOpenImportForm}
                                onClose={handleCloseAddCategoryDialog}
                                importReceipst={importReceipst}
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
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Người tạo:{' '}
                                        </Typography>
                                        <Grid xs={8.5}>
                                            <TextField
                                                size="small"
                                                labelId="group-label"
                                                id="group-select"
                                                sx={{ width: '100%', fontSize: '14px' }}
                                                value={importReceipst.createdBy}
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
                                                <TableCell>Tên sản phẩm</TableCell>
                                                <TableCell>Số lượng</TableCell>
                                                <TableCell>Tổng giá phiếu</TableCell>
                                                <TableCell>Đơn vị</TableCell>
                                            </TableRow>
                                            {importReceipst.details.map((items) => {
                                                return (
                                                    <TableRow key={items.id}>
                                                        <TableCell>{items.itemName}</TableCell>
                                                        <TableCell>{items.quantity}</TableCell>
                                                        <TableCell>{items.totalPrice}</TableCell>
                                                        <TableCell>{items.unitName}</TableCell>
                                                        <TableCell>{/* Thêm thành tiền nếu có */}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    <TableBody style={{ marginTop: 30 }}>
                                        <Typography variant="h6">Thông tin phiếu</Typography>
                                        <TableRow>
                                            <TableCell>Tổng số lượng:</TableCell>
                                            <TableCell>{importReceipst.totalQuantity}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* {isSuccess && <SuccessAlerts message={successMessage} />}
                    {isError && <ErrorAlerts errorMessage={errorMessage} />} */}
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

                            <div>
                                {currentStatus === 'Pending_Approval' && (
                                    <Button variant="contained" color="primary" onClick={updateExportReceiptConfirm}>
                                        Xác nhận
                                    </Button>
                                )}

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
                            </div>
                            {/* <div>
                                <Button variant="contained" color="warning" onClick={updateReceiptStartImport}>
                                    Tiến hành nhập kho
                                </Button>
                                <Snackbar
                                    open={open}
                                    autoHideDuration={6000}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    message={message}
                                    action={action}
                                    style={{ bottom: '16px', right: '16px' }}
                                />
                            </div> */}
                            {/* <Button variant="outlined" color="error" onClick={handleClear}>
                                Hủy bỏ
                            </Button> */}
                        </Grid>
                    </Stack>
                </div>
            )}
        </div>
    ) : null;
};

export default ExportReceiptDetailForm;
