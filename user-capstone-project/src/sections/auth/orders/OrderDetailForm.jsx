import React, { useEffect, useState } from 'react';
import { Typography, Button, List, ListItem, Tab, Tabs, Stack, Grid, TextField, CardContent, Card, TableContainer, TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';


const OrderDetailForm = ({ orders, orderId, onClose, isOpen }) => {
    const [expandedItem, setExpandedItem] = useState(orderId);
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0); // Ban đầu chọn tab "Thông tin"

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
    }

    const handleDelete = () => {
        // Xử lý xóa
    }

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
                                <Grid container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Mã hóa đơn:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Mã hóa đơn"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={order.invoiceCode}
                                    />
                                </Grid>
                                <Grid container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Thời gian:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Thời gian"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={order.timestamp}
                                    />
                                </Grid>
                                <Grid container
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

                                <Grid container
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
                                <Grid container
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
                            <Grid item xs={6} >
                                <Grid container
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
                                <Grid container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Chi nhánh:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Chi nhánh"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={order.branch}
                                    />
                                </Grid>
                                <Grid container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Người bán:</Typography>
                                    <TextField
                                        size

                                        ="small"
                                        variant="outlined"
                                        label="Người bán"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={order.salesperson}
                                    />
                                </Grid>
                                <Grid container
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
                                        value={order.creator}
                                    />
                                </Grid>
                                <Grid container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Kênh bán:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Kênh bán"
                                        sx={{ width: '70%', marginRight: 5 }}
                                        value={order.salesChannel}
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
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Cập nhập
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
                <div style={{ flex: 1 }}>
                    {/* Hiển thị nội dung cho tab "Lịch sử thanh toán" ở đây */}
                </div>
            )}

        </div>
    );
}

export default OrderDetailForm;