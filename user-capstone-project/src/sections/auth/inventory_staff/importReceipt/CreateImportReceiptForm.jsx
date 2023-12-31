import React, { useState } from 'react';
import {
    DialogContent,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    Typography,
    IconButton,
} from '@mui/material';
import { createImportReceipt } from '~/data/mutation/importReceipt/ImportReceipt-mutation';
import AddLocationsForm from '../itemInventory/AddLocationsForm';
import CloseIcon from '@mui/icons-material/Close';
import SnackbarError from '~/components/alert/SnackbarError';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';

const CreateImportReceiptForm = ({ isOpen, onCloseForm, importReceipst, onClose }) => {
    const [quantities, setQuantities] = useState({});
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
    const [dataReceiptDetail, setDataReceiptDetail] = useState({});
    //========================== Hàm notification của trang ==================================
    const [open1, setOpen1] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');

    const handleErrorMessage = (message) => {
        setOpen1(true);
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

        setOpen1(false);
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

    const handleQuantityChange = (itemId, value) => {
        setQuantities((prev) => ({ ...prev, [itemId]: value }));
    };

    const handleOpenAddCategoryDialog = () => {
        setOpenAddCategoryDialog(true);
    };

    const handleCloseAddCategoryDialog = () => {
        setOpenAddCategoryDialog(false);
    };

    const handleSendToManager = async () => {
        try {
            const response = await createImportReceipt(importReceipst.id, quantities);

            // Handle success
            console.log('Response:', response);

            if (response.status === '201 CREATED') {
                setDataReceiptDetail(response.data);
                handleOpenAddCategoryDialog();
                onClose && onClose();
            }
        } catch (error) {
            // Handle error
            console.error('Error creating import receipt:', error);
            handleErrorMessage(error.response.data.message);
        }
    };
    console.log(dataReceiptDetail);

    const handleSaveLocation = (successMessage) => {
        setSnackbarSuccessMessage(
            successMessage === 'Cập nhật vị trí các sản phẩm thành công.'
                ? 'Cập nhật vị trí các sản phẩm thành công.'
                : 'Thành công',
        );
        setSnackbarSuccessOpen(true);
    };

    const handleClosePopup = () => {
        setOpenAddCategoryDialog(false);
        onCloseForm(); // Close the main popup
      };

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <DialogContent>
                    <Card>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Mã code:</TableCell>
                                        <TableCell>{importReceipst.code}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Mô tả:</TableCell>
                                        <TableCell>{importReceipst.description}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Người tạo phiếu:</TableCell>
                                        <TableCell>{importReceipst.createdBy}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Ngày tạo phiếu:</TableCell>
                                        <TableCell>{importReceipst.createdAt}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Loại phiếu:</TableCell>
                                        <TableCell>
                                            {importReceipst.type === 'PHIEU_YEU_CAU_NHAP_KHO'
                                                ? 'Phiếu Yêu Cầu Nhập Kho'
                                                : 'Phiếu khác'}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card style={{ marginTop: 10 }}>
                        <CardContent>
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
                                        <TableCell>Số lượng yêu cầu</TableCell>
                                        <TableCell>Giá mua</TableCell>
                                        <TableCell>Tổng tiền</TableCell>
                                        <TableCell>Đơn vị</TableCell>
                                        <TableCell>Só lượng thực tế</TableCell>
                                    </TableRow>
                                    {importReceipst.details.map((items) => (
                                        <TableRow key={items.id}>
                                            <TableCell>{items.itemName}</TableCell>
                                            <TableCell>{items.quantity}</TableCell>
                                            <TableCell>{items.price}</TableCell>
                                            <TableCell>{items.totalPrice}</TableCell>
                                            <TableCell>{items.unitName}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    style={{ width: '50%' }}
                                                    type="number"
                                                    value={quantities[items.id] || ''}
                                                    onChange={(e) => handleQuantityChange(items.id, e.target.value)}
                                                    label="Số lượng nhập thực tế"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            minWidth: 100,
                                        }}
                                    >
                                        <TableBody>
                                            <Typography variant="h6">Thông tin phiếu</Typography>
                                            <TableRow>
                                                <TableCell>Tổng số lượng:</TableCell>
                                                <TableCell>{importReceipst.totalQuantity}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </div>
                                </TableBody>
                            </Table>
                        </CardContent>
                        <Grid container justifyContent="flex-end" style={{ marginTop: 10 }}>
                            <Button variant="contained" color="primary" onClick={handleSendToManager}>
                                Gửi Phiếu
                            </Button>
                            <AddLocationsForm
                                open={openAddCategoryDialog}
                                onClose={handleCloseAddCategoryDialog}
                                dataReceiptDetail={dataReceiptDetail}
                                updateDataReceiptDetail={(newData) => setDataReceiptDetail(newData)} // Pass the update function
                                details={dataReceiptDetail.details}
                                onSave={(message) => {
                                    handleSaveLocation(message);
                                    handleClosePopup();
                                  }}
                            />
                            <SnackbarError
                                open={open1}
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
                        </Grid>
                    </Card>
                </DialogContent>
            </div>
        </>
    );
};

export default CreateImportReceiptForm;
