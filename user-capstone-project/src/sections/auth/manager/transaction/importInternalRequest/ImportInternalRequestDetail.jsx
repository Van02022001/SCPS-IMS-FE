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
import { useParams } from 'react-router-dom';

const ImportInternalRequestDetail = ({ importRequestReceipt, importRequestReceiptId, onClose, isOpen, mode }) => {
    const [open, setOpen] = React.useState(false);

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

    //thông báo

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

    // const handleOpenAddSubCategoryMetaForm = () => {
    //     setOpenAddSubCategoryMetaForm(true);
    // };

    // const handleCloseAddSubCategoryMetaForm = () => {
    //     setOpenAddSubCategoryMetaForm(false);
    // };

    useEffect(() => {
        // Sử dụng importRequestReceiptId để fetch thông tin chi tiết phiếu từ API hoặc state của bạn
        // Gọi API hoặc thay đổi state để lấy thông tin chi tiết phiếu
        // ...
    }, [importRequestReceiptId]);
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
            const importReceipst = importRequestReceipt.find((o) => o.id === importRequestReceiptId);
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
    }, [importRequestReceiptId, importRequestReceipt, mode]);

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
    const importReceipst = importRequestReceipt.find((o) => o.id === importRequestReceiptId);

    if (!importReceipst) {
        return null;
    }

    // const updateImportReceipt = async () => {
    //     if (!editedImportReceipt) {
    //         return;
    //     }
    //     try {
    //         const response = await editImportReceipt(importRequestReceiptId, editedImportReceipt);

    //         if (response.status === '200 OK') {
    //             setIsSuccess(true);
    //             setIsError(false);
    //             setSuccessMessage(response.message);
    //             handleMessage(response.message);
    //         }
    //         updateImportReceiptInList(response.data);
    //         console.log('Product updated:', response);
    //     } catch (error) {
    //         console.error('An error occurred while updating the product:', error);
    //         setIsError(true);
    //         setIsSuccess(false);
    //         if (error.response?.data?.message === 'Invalid request') {
    //             setErrorMessage('Yêu cầu không hợp lệ');
    //         }
    //         if (error.response?.data?.error === '404 NOT_FOUND') {
    //             setErrorMessage('Mô tả quá dài');
    //         }
    //     }
    // };

    // const updateImportReceiptConfirm = async () => {
    //     try {
    //         let newStatus = currentStatus === 'Pending_Approval' ? 'Inactive' : 'Approved';

    //         const response = await editImportReceiptConfirm(importRequestReceiptId, newStatus);

    //         if (response.status === '200 OK') {
    //             setIsSuccess(true);
    //             setIsError(false);
    //             setSuccessMessage(response.message);
    //             handleMessage(response.message);
    //         }

    //         updateImportReceiptConfirmInList(importRequestReceiptId, newStatus);
    //         setCurrentStatus(newStatus);

    //         console.log('Product status updated:', response);
    //     } catch (error) {

    //     }
    // };
    // const updateReceiptStartImport = async () => {
    //     try {
    //         let newStatus = currentStatus === 'Approved' ? 'Inactive' : 'Completed';

    //         const response = await editReceiptStartImport(importRequestReceiptId, newStatus);

    //         if (response.status === '200 OK') {
    //             setIsSuccess(true);
    //             setIsError(false);
    //             setSuccessMessage(response.message);
    //             handleMessage(response.message);
    //         }

    //         updateImportReceiptConfirmInList(importRequestReceiptId, newStatus);
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
    // const handleOpenForm = () => {
    //     const validImportReceipst = importRequestReceipt.find((o) => o.id === importRequestReceiptId);

    //     if (validImportReceipst && validImportReceipst.status === 'IN_PROGRESS') {
    //         setIsOpenImportForm(true);

    //         setImportReceipstData({
    //             id: validImportReceipst.id,
    //             code: validImportReceipst.code,
    //             description: validImportReceipst.description,
    //             createdBy: validImportReceipst.createdBy,
    //             details: validImportReceipst.details || [],
    //             lastModifiedBy: validImportReceipst.lastModifiedBy || '',
    //             status: validImportReceipst.status || '',
    //             totalPrice: validImportReceipst.totalPrice || 0,
    //             totalQuantity: validImportReceipst.totalQuantity || 0,
    //             type: validImportReceipst.type || '',
    //             updatedAt: validImportReceipst.updatedAt || '',
    //             warehouseId: validImportReceipst.warehouseId || 0,
    //         });

    //         console.log(validImportReceipst);
    //     } else {
    //         console.error('Không tìm thấy dữ liệu hợp lệ cho importReceiptId: ', importRequestReceiptId);
    //     }
    // };
    // const handleCloseForm = () => {
    //     setIsOpenImportForm(false);
    // };
    //==========================================================================================================

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
                    <div></div>
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
                                        label="Mã phiếu"
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
                                        multiline
                                        rows={4}
                                        InputProps={{ readOnly: true }}
                                        size="small"
                                        variant="outlined"
                                        label="Mô tả"
                                        sx={{ width: '70%', pointerEvents: 'none' }}
                                        value={importReceipst.note}
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
                                                    ? 'Chờ xác nhận'
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
                                                sx={{
                                                    width: '98.5%',
                                                    fontSize: '14px',
                                                    pointerEvents: 'none',
                                                    marginLeft: 1,
                                                }}
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
                                            InputProps={{ readOnly: true }}
                                            size="small"
                                            variant="outlined"
                                            label="Ngày tạo"
                                            sx={{ width: '70%', pointerEvents: 'none' }}
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
                                                <TableCell></TableCell>
                                                <TableCell>Mã sản phẩm</TableCell>
                                                <TableCell>Tên sản phẩm</TableCell>
                                                <TableCell>Số lượng</TableCell>
                                                <TableCell>Đơn vị</TableCell>
                                                <TableCell>Giá</TableCell>
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
                                                        <TableCell>{items.unitName}</TableCell>
                                                        <TableCell>{items.price?.toLocaleString('vi-VN')}</TableCell>
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
                                            <TableCell>{importReceipst.totalQuantity}</TableCell>
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
        </div>
    ) : null;
};

export default ImportInternalRequestDetail;
