import React, { useState, useEffect } from 'react';
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
import CloseIcon from '@mui/icons-material/Close';
import SnackbarError from '~/components/alert/SnackbarError';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import UpdateLocationsForm from '../itemInventory/UpdateLocationsForm';
import { getAllLocation } from '~/data/mutation/location/location-mutation';
import { getExaminationItem } from '~/data/mutation/items/item-mutation';
import { useNavigate } from 'react-router-dom';

const CreateImportReceiptForm = ({ isOpen, onCloseForm, importReceipst, onClose, onSave }) => {
    const [quantities, setQuantities] = useState({});
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
    const [dataReceiptDetail, setDataReceiptDetail] = useState(null);
    const [locationQuantities, setLocationQuantities] = useState({});
    const [selectedLocationsFlag, setSelectedLocationsFlag] = useState({});
    const [selectedDetailId, setSelectedDetailId] = useState(null);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [toLocation_id, setToLocation_id] = useState([]);
    const [selectedDetailQuantity, setSelectedDetailQuantity] = useState(null);

    const [isSent, setIsSent] = useState(false);
    const getDetailIds = () => {
        return dataReceiptDetail.details.map((detail) => detail.id);
    };

    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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
            setErrorMessage('Các sản phẩm chưa được cập nhật hết vị trí !');
        } else if (message === 'An error occurred while creating the actual import receipt') {
            setErrorMessage('Vui lòng nhập số lượng thực tế !');
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

    useEffect(() => {
        console.log('Selected Locations Flag Updated:', selectedLocationsFlag);
        console.log('Location Quantities Updated:', locationQuantities);
    }, [selectedLocationsFlag, locationQuantities]);

    useEffect(() => {
        getAllLocation()
            .then((response) => {
                const data = response.data;
                const dataArray = Array.isArray(data) ? data : [data];
                setToLocation_id(dataArray);
            })
            .catch((error) => console.error('Error fetching locations:', error));
    }, []);

    const handleSendToManager = async () => {
        try {
            const response = await createImportReceipt(importReceipst.id, quantities);

            // Handle success
            console.log('Response:', response);

            if (response.status === '201 CREATED') {
                setDataReceiptDetail(response.data);
                // handleOpenAddCategoryDialog();
                setIsSent(true);
            }
        } catch (error) {
            // Handle error
            console.error('Error creating import receipt:', error);
            handleErrorMessage(error.response.data.message);
        }
    };

    const handleConfirm = async () => {
        try {
            const response = await getExaminationItem(dataReceiptDetail.id);
            console.log('API Response:', response);
            if (response.status === '200 OK') {
                onSave && onSave(response.message, 'Completed');
                // Đóng form
                onClose && onClose();
                navigate('/inventory-staff/requests-import-receipt', {
                    state: { successMessage: response.message },
                });
                handleSuccessMessage(response.message);
            }
        } catch (error) {
            console.error('Error calling getExaminationItem API:', error);
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

    // const handleClosePopup = () => {
    //     setOpenAddCategoryDialog(false);
    //     onCloseForm(); // Close the main popup
    // };

    const handleUpdateLocations = ({ detailId, locations }) => {
        console.log('Updating flag for detailId:', detailId);

        setSelectedLocations((prevSelectedLocations) => {
            const existingIndex = prevSelectedLocations.findIndex((loc) => loc.detailId === detailId);

            if (existingIndex !== -1) {
                // If detailId already exists, update the locations
                return prevSelectedLocations.map((loc, index) =>
                    index === existingIndex ? { ...loc, locations } : loc,
                );
            } else {
                // If detailId doesn't exist, add a new entry
                return [...prevSelectedLocations, { detailId, locations }];
            }
        });
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
                                        <TableCell>Mã sản phẩm</TableCell>
                                        <TableCell>Tên sản phẩm</TableCell>
                                        <TableCell>Số lượng yêu cầu</TableCell>
                                        <TableCell>Đơn vị</TableCell>
                                        <TableCell>Số lượng thực tế</TableCell>
                                        {/* <TableCell>Tổng giá nhập</TableCell> */}
                                        {/* <TableCell>Số lượng chênh lệch</TableCell> */}
                                        {/* <TableCell>Giá trị chênh lệch</TableCell> */}
                                        <TableCell></TableCell>
                                    </TableRow>
                                    {dataReceiptDetail !== null
                                        ? dataReceiptDetail.details.map((detail) => (
                                              <TableRow key={detail.id}>
                                                  <TableCell>{detail.item.code}</TableCell>
                                                  <TableCell>{detail.item.subcategoryName}</TableCell>
                                                  <TableCell>
                                                      {detail.discrepancyLogs && detail.discrepancyLogs.length > 0
                                                          ? detail.discrepancyLogs[0].requiredQuantity
                                                          : detail.quantity}
                                                  </TableCell>

                                                  <TableCell>{detail.unitName}</TableCell>

                                                  <TableCell>{detail.quantity}</TableCell>

                                                  {/* <TableCell>{detail.totalPrice}</TableCell> */}

                                                  {/* <TableCell>{detail.discrepancyQuantity}</TableCell> */}

                                                  {/* <TableCell>
                                                      {detail.discrepancyLogs && detail.discrepancyLogs.length > 0
                                                          ? detail.discrepancyLogs[0].discrepancyValue
                                                          : detail.discrepancyValue}
                                                  </TableCell> */}

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
                                                  <TableCell>{items.item.code}</TableCell>
                                                  <TableCell>{items.item.subcategoryName}</TableCell>
                                                  <TableCell>{items.quantity}</TableCell>
                                                  <TableCell>{items.unitName}</TableCell>
                                                  <TableCell>
                                                      <TextField
                                                          type="text"
                                                          label="Số lượng nhập thực tế"
                                                          style={{ width: '50%' }}
                                                          value={quantities[items.id] || ''}
                                                          onChange={(e) => {
                                                              const inputValue = e.target.value;
                                                              if (/^\d*$/.test(inputValue)) {
                                                                  handleQuantityChange(items.id, e.target.value);
                                                              }
                                                          }}
                                                          inputProps={{
                                                              inputMode: 'numeric',
                                                              pattern: '[0-9]*',
                                                          }}
                                                      />
                                                  </TableCell>
                                              </TableRow>
                                          ))}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            minWidth: 200,
                                        }}
                                    >
                                        <TableBody>
                                            <Typography variant="h6">Thông tin phiếu</Typography>
                                            <TableRow>
                                                <TableCell>Tổng số lượng:</TableCell>
                                                <TableCell>{importReceipst.totalQuantity}</TableCell>
                                            </TableRow>
                                            {/* <TableRow>
                                                <TableCell>Tổng giá nhập:</TableCell>
                                                <TableCell>{dataReceiptDetail.totalPrice}</TableCell>
                                            </TableRow> */}
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
                            <UpdateLocationsForm
                                open={openAddCategoryDialog}
                                onClose={handleCloseAddCategoryDialog}
                                dataReceiptDetail={dataReceiptDetail}
                                itembylocation={selectedDetailId}
                                detailId={selectedDetailId}
                                onUpdate={handleUpdateLocations}
                                selectedLocations={selectedLocations[selectedDetailId] || []}
                                toLocationData={toLocation_id}
                                onSave={handleSaveLocation}
                                itemId={
                                    dataReceiptDetail?.details && selectedDetailId
                                        ? dataReceiptDetail.details.find((detail) => detail.id === selectedDetailId)
                                              ?.item?.id
                                        : null
                                }
                                selectedDetailQuantity={selectedDetailQuantity}
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

export default CreateImportReceiptForm;
