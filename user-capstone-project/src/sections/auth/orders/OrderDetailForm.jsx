import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    List,
    ListItem,
    Tab,
    Tabs,
    Stack,
    Grid,
    TextField,
    CardContent,
    Card,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Table,
} from '@mui/material';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { editItem } from '~/data/mutation/items/item-mutation';
import SuccessAlerts from '~/components/alert/SuccessAlert';
import ErrorAlerts from '~/components/alert/ErrorAlert';

const OrderDetailForm = ({ orders, orderId, onClose, isOpen, updateItemInList }) => {
    const [expandedItem, setExpandedItem] = useState(orderId);
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0); // Ban đầu chọn tab "Thông tin"

    const [editedItem, setEditedItem] = useState(null);

    const [sub_category_id, setSub_category_id] = useState([]);
    const [brand_id, setBrand_id] = useState([]);
    const [supplier_id, setSupplier_id] = useState([]);
    const [origin_id, setOrigin_id] = useState([]);

    //thông báo
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFormHeight(1000);
        } else {
            setFormHeight(0);
        }
    }, [isOpen]);

    const order = orders.find((o) => o.id === orderId);

    if (!order) {
        return null;
    }

    const handleSave = () => {
        // Xử lý lưu
    };

    const handleDelete = () => {
        // Xử lý xóa
    };

    // useEffect(() => {
    //     if (mode === 'create') {
    //         setEditedProduct({
    //             minStockLevel: 0,
    //             maxStockLevel: 0,
    //             sub_category_id: [],
    //             brand_id: [],
    //             supplier_id: [],
    //             origin_id: [],
                
    //         });
    //     } else {
    //         const item = orders.find((o) => o.id === orderId);
    //         console.log(item);
    //         if (product) {
    //             const categoryIds = product.categories ? product.categories.map((category) => category.id) : [];
    //             const unitId = product.unit ? product.unit.id : 0;
    //             const unitMeaId = product.size.unitMeasurement ? product.size.unitMeasurement.id : 0;

    //             const editedProduct = {
    //                 categories_id: categoryIds,
    //                 unit_id: unitId,
    //                 length: product.size.length ? product.size.length : 0,
    //                 width: product.size ? product.size.width : 0,
    //                 height: product.size ? product.size.height : 0,
    //                 diameter: product.size ? product.size.diameter : 0,
    //                 unit_mea_id: unitMeaId,
    //             };

    //             setEditedProduct(editedProduct);
    //             setCurrentStatus(product.status);
    //             console.log(editedProduct);
    //         }
    //     }
    // }, [productId, products, mode]);

    const updateItems = async () => {
        if (!editedItem) {
            return;
        }
        try {
            const response = await editItem(orderId, editedItem);

            if (response.status === '200 OK') {
                setIsSuccess(true);
                setIsError(false);
                setSuccessMessage(response.message);
            }

            updateItemInList(response.data);
            console.log('Item updated:', response);
        } catch (error) {
            console.error('An error occurred while updating the item:', error);
            setIsError(true);
            setIsSuccess(false);
            setErrorMessage(error.response.data.message);
            if (error.response) {
                console.log('Error response:', error.response);
            }
        }
    };

    return (
        <div
            id="orderDetailForm"
            className="OrderDetailForm"
            style={{
                backgroundColor: 'white',
                zIndex: 999,
            }}
        >
            <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)}>
                <Tab label="Thông tin" />
                <Tab label="Lịch sử thanh toán" />
            </Tabs>

            {selectedTab === 0 && (
                <div style={{ marginLeft: 50 }}>
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
                                    <Typography variant="body1">Mã sản phẩm:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Mã sản phẩm"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={order.code}
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
                                    <Typography variant="body1">Ngày tạo:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Ngày tạo"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={order.createdAt}
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
                                    <Typography variant="body1">Ngày cập nhật:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Ngày cập nhật"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={order.updatedAt}
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
                                    <Typography variant="body1">Khách hàng:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Khách hàng"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={order.customer}
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
                                    <Typography variant="body1">Bảng giá:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Bảng giá"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={order.priceList}
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
                                    <Typography variant="body1">Mã đặt hàng:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Mã đặt hàng"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={order.orderCode}
                                    />
                                </Grid>
                            </Grid>

                            {/* 5 field bên phải*/}
                            <Grid item xs={6}>
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
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={order.status}
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
                                    <Typography variant="body1">Thương hiệu:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Chi nhánh"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={order.brand.name}
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
                                    <Typography variant="body1">Người bán:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Người bán:"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={order.supplier.name}
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
                                    <Typography variant="body1">Người tạo:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Người tạo"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={
                                            order.createdBy.firstName +
                                            ' ' +
                                            order.createdBy.middleName +
                                            ' ' +
                                            order.createdBy.lastName
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
                                    <Typography variant="body1">Xuất xứ:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Xuất xứ"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={order.origin.name}
                                    />
                                </Grid>
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
                                                <TableCell>Mã hàng</TableCell>
                                                <TableCell>Tên hàng</TableCell>
                                                <TableCell>Số lượng</TableCell>
                                                <TableCell>Đơn giá</TableCell>
                                                <TableCell>Giảm giá</TableCell>
                                                <TableCell>Giá bán</TableCell>
                                                <TableCell>Thành tiền</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>{order.name}</TableCell>
                                                <TableCell>{order.productName}</TableCell>
                                                <TableCell>{order.quantity}</TableCell>
                                                <TableCell>{order.unitPrice}</TableCell>
                                                <TableCell>{order.discount}</TableCell>
                                                <TableCell>{order.price}</TableCell>
                                                <TableCell>{order.total}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                        {/* Đoạn tổng kết */}
                        <Grid container spacing={2} sx={{ marginTop: 2 }}>
                            <Grid item xs={6}>
                                <Typography variant="body1">Tổng số hàng: </Typography>
                                <Typography variant="body1">Tổng số tiền: </Typography>
                                <Typography variant="body1">Giảm giá hóa đơn: {order.discount}</Typography>
                                <Typography variant="body1">Khách cần trả:</Typography>
                                <Typography variant="body1">Khách đã trả: {order.amountPaid}</Typography>
                            </Grid>
                        </Grid>
                        {isSuccess && <SuccessAlerts message={successMessage} />}
                        {isError && <ErrorAlerts errorMessage={errorMessage} />}
                        <Button variant="contained" color="primary" onClick={updateItems}>
                            Cập nhật
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleDelete}>
                            Xóa
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleDelete}>
                            Hủy bỏ
                        </Button>
                    </div>
                </div>
            )}
            {selectedTab === 1 && (
                <div style={{ flex: 1 }}>{/* Hiển thị nội dung cho tab "Lịch sử thanh toán" ở đây */}</div>
            )}
        </div>
    );
};

export default OrderDetailForm;
