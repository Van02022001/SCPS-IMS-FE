import React, { useEffect, useState } from 'react';
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

import { createExportReceipt } from '~/data/mutation/exportReceipt/ExportReceipt-mutation';

import { getExaminationItem } from '~/data/mutation/items/item-mutation';
import CloseIcon from '@mui/icons-material/Close';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';

import { useNavigate } from 'react-router-dom';
import UpdateLocationToExportForm from '../exportReceipt/UpdateLocationToExportForm';

const CreateExportRequestReceiptForm = ({ isOpen, onCloseForm, importReceipst, onSave, onClose }) => {
    const [quantities, setQuantities] = useState({});
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
    const [dataReceiptDetail, setDataReceiptDetail] = useState({});
    const [locationQuantities, setLocationQuantities] = useState({});
    const [selectedLocationsFlag, setSelectedLocationsFlag] = useState({});
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [isSent, setIsSent] = useState(false);
    const [selectedDetailId, setSelectedDetailId] = useState(null);
    const [toLocation_id, setToLocation_id] = useState([]);
    const [selectedDetailQuantity, setSelectedDetailQuantity] = useState(null);
    console.log(setToLocation_id, setSelectedLocationsFlag, setLocationQuantities);
    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Export receipt created successfully') {
            setSuccessMessage('Thành công');
        } else if (message === 'Cập nhật vị trí các sản phẩm thành công.') {
            setSuccessMessage('Cập nhật vị trí các sản phẩm thành công.');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === 'Receipt is not in the approved state for processing') {
            setErrorMessage('Phiếu không ở trạng thái được phê duyệt để xử lý !');
        } else if (message === 'Các sản phẩm chưa được cập nhật hết vị trí.') {
            setErrorMessage('Các sản phẩm chưa được cập nhật hết vị trí.');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen1(false);
        setOpen(false);
        setErrorMessage('');
        setSuccessMessage('');
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

    const handleOpenAddCategoryDialog = (detailId) => {
        setSelectedDetailId(detailId);
        const selectedDetail = dataReceiptDetail.details.find((detail) => detail.id === detailId);
        setSelectedDetailQuantity(selectedDetail ? selectedDetail.quantity : null);
        setOpenAddCategoryDialog(true);
    };

    const handleCloseAddCategoryDialog = () => {
        setOpenAddCategoryDialog(false);
    };

    const handleUpdateLocations = ({ detailId, locations }) => {
        console.log('Updating flag for detailId:', detailId);

        setSelectedLocations((prevSelectedLocations) => {
            const existingIndex = prevSelectedLocations.findIndex((loc) => loc.detailId === detailId);

            if (existingIndex !== -1) {
                // If detailId already exists, update the locations
                const updatedLocations = prevSelectedLocations.map((loc, index) =>
                    index === existingIndex ? { ...loc, locations } : loc,
                );
                // Check if all locations are selected
                const allLocationsSelected = locations.every((location) => location.quantity > 0);

                // If all locations are selected, update the flag to hide the button
                if (allLocationsSelected) {
                    updatedLocations[existingIndex].allLocationsSelected = true;
                }

                return updatedLocations;
            } else {
                return [...prevSelectedLocations, { detailId, locations }];
            }
        });
    };

    useEffect(() => {
        console.log('Selected Locations Flag Updated:', selectedLocationsFlag);
        console.log('Location Quantities Updated:', locationQuantities);
    }, [selectedLocationsFlag, locationQuantities]);

    const handleSendToManager = async () => {
        try {
            const quantities = importReceipst.details.reduce((acc, detail) => {
                acc[detail.item.id] = detail.quantity;
                return acc;
            }, {});

            const response = await createExportReceipt(importReceipst.id, quantities);

            // Handle success
            console.log('Response:', response);

            if (response.status === '201 CREATED') {
                setDataReceiptDetail(response.data);
                // handleOpenAddCategoryDialog();
                onCloseForm(true);
                setIsSent(true);
                handleSuccessMessage(response.message);
            }
        } catch (error) {
            // Handle error
            console.error('Error creating import receipt:', error);
            handleErrorMessage(error.response.data.message);
        }
    };
    console.log(dataReceiptDetail);

    const handleConfirm = async () => {
        try {
            const response = await getExaminationItem(dataReceiptDetail.id);
            console.log('API Response:', response);
            if (response.status === '200 OK') {
                onSave && onSave(response.message, 'Completed');
                // Đóng form
                onClose && onClose();
                navigate('/inventory-staff/requests-export-receipt', {
                    state: { successMessage: response.message },
                });
                handleSuccessMessage(response.message);
            }
        } catch (error) {
            console.error('Error calling getExaminationItem API:', error);
            handleErrorMessage(error.response.data.message);
        }
    };

    console.log(importReceipst);

    const handleSaveLocation = (successMessage) => {
        setSnackbarSuccessMessage(
            successMessage === 'Update item locations successfully'
                ? 'Cập nhật vị trí sản phẩm thành công.'
                : 'Thành công',
        );
        setSnackbarSuccessOpen(true);
        onSave && onSave(successMessage);
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
                                        <TableCell>{importReceipst.note}</TableCell>
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
                                        <TableCell>{importReceipst.type}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Khách hàng:</TableCell>
                                        <TableCell>{importReceipst.customerName}</TableCell>
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
                                        <TableCell></TableCell>
                                        <TableCell>Mã sản phẩm</TableCell>
                                        <TableCell>Tên sản phẩm</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                        <TableCell>Đơn vị</TableCell>
                                        <TableCell>Thương hiệu</TableCell>
                                        <TableCell>Xuất xứ</TableCell>
                                        <TableCell>Nhà cung cấp</TableCell>
                                        <TableCell>Giá bán</TableCell>
                                        <TableCell>Tổng giá</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    {dataReceiptDetail.details
                                        ? dataReceiptDetail.details.map((detail) => (
                                              <TableRow key={detail.id}>
                                                  <TableCell>
                                                      <img
                                                          src={detail.item.imageUrl}
                                                          alt={`Item ${detail.code}`}
                                                          width="48"
                                                          height="48"
                                                      />
                                                  </TableCell>
                                                  <TableCell>{detail.item.code}</TableCell>
                                                  <TableCell>{detail.item.subcategoryName}</TableCell>
                                                  <TableCell>{detail.quantity}</TableCell>
                                                  <TableCell>{detail.unitName}</TableCell>
                                                  <TableCell>{detail.item.brandName}</TableCell>
                                                  <TableCell>{detail.item.originName}</TableCell>
                                                  <TableCell>{detail.item.supplierName}</TableCell>

                                                  <TableCell>{detail.price} VNĐ</TableCell>

                                                  <TableCell>{detail.totalPrice} VNĐ</TableCell>

                                                  <TableCell>
                                                      {!locationQuantities[detail.id] > 0 &&
                                                          !selectedLocationsFlag[detail.id] &&
                                                          selectedLocations.find(
                                                              (loc) => loc.detailId === detail.id,
                                                          ) === undefined && (
                                                              <Button
                                                                  variant="contained"
                                                                  color="primary"
                                                                  onClick={() => handleOpenAddCategoryDialog(detail.id)}
                                                                  disabled={selectedLocationsFlag[detail.id]}
                                                              >
                                                                  Chọn vị trí
                                                              </Button>
                                                          )}
                                                  </TableCell>
                                              </TableRow>
                                          ))
                                        : importReceipst.details.map((items) => (
                                              <TableRow key={items.id}>
                                                  {console.log(quantities[items.id])}
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
                                                  <TableCell>{items.item.brandName}</TableCell>
                                                  <TableCell>{items.item.originName}</TableCell>
                                                  <TableCell>{items.item.supplierName}</TableCell>
                                                  <TableCell>
                                                      {/* <TextField
                                                          style={{ width: '50%' }}
                                                          type="number"
                                                          value={quantities[items.id] || ''}
                                                          onChange={(e) =>
                                                              handleQuantityChange(items.id, e.target.value)
                                                          }
                                                          label="Số lượng nhập thực tế"
                                                      /> */}
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
                            {isSent ? (
                                <Button variant="contained" color="secondary" onClick={handleConfirm}>
                                    Lưu lại
                                </Button>
                            ) : (
                                <Button variant="contained" color="primary" onClick={handleSendToManager}>
                                    Gửi Phiếu
                                </Button>
                            )}
                            <UpdateLocationToExportForm
                                open={openAddCategoryDialog} // Use the correct state variable here
                                onClose={handleCloseAddCategoryDialog}
                                dataReceiptDetail={dataReceiptDetail}
                                details={dataReceiptDetail.details}
                                detailId={selectedDetailId}
                                onUpdate={handleUpdateLocations} // Pass the handleUpdateLocations function here
                                selectedLocations={selectedLocations[selectedDetailId] || []}
                                toLocationData={toLocation_id}
                                selectedDetailQuantity={selectedDetailQuantity}
                                onSave={handleSaveLocation}
                                itemId={
                                    dataReceiptDetail?.details && selectedDetailId
                                        ? dataReceiptDetail.details.find((detail) => detail.id === selectedDetailId)
                                              ?.item?.id
                                        : null
                                }
                            />
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

export default CreateExportRequestReceiptForm;
