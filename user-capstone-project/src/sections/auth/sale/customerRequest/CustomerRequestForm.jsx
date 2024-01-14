import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Card,
    CardContent,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Grid,
    Typography,
} from '@mui/material';

// api




const CustomerRequestForm = ({ open, onClose, onSave }) => {

    return (
        <>
            <div
                id="customerRequestForm"
                className="CustomerRequestForm"
                style={{
                    backgroundColor: 'white',
                    zIndex: 999,
                }}
            >
                <div style={{ minHeight: 600 }}>
                    <Card sx={{ marginTop: 5 }}>
                        <CardContent>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow
                                            variant="subtitle1"
                                            sx={{
                                                fontSize: '20px',
                                                backgroundColor: '#2065D1',
                                                height: 50,
                                                textAlign: 'start',
                                                borderRadius: 5,
                                                padding: '10px 0 0 20px',
                                            }}
                                        >
                                            <TableCell
                                                sx={{
                                                    color: 'white', // Màu chữ
                                                    fontWeight: 'bold',
                                                    border: '1px solid white',
                                                }}
                                            >
                                                Mã đặt hàng
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    border: '1px solid white',
                                                }}
                                            >
                                                Thời gian
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    border: '1px solid white',
                                                }}
                                            >
                                                Khách hàng
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    border: '1px solid white',
                                                }}
                                            >
                                                Tổng cộng
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    border: '1px solid white',
                                                }}
                                            >
                                                Trạng thái
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    border: '1px solid white',
                                                }}
                                            >
                                                Ghi chú
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>BH1020</TableCell>
                                            <TableCell>11-20</TableCell>
                                            <TableCell>{ }</TableCell>
                                            <TableCell>{ }</TableCell>
                                            <TableCell>{ }</TableCell>
                                            <TableCell>{ }</TableCell>
                                            <TableCell>{ }</TableCell>
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
                            <Typography variant="body1">Giảm giá hóa đơn: { }</Typography>
                            <Typography variant="body1">Khách cần trả:</Typography>
                            <Typography variant="body1">Khách đã trả: { }</Typography>
                        </Grid>
                    </Grid>
                    <Button variant="contained" color="primary">
                        Cập nhập
                    </Button>
                    <Button variant="outlined" color="secondary" >
                        Xóa
                    </Button>
                    <Button variant="outlined" color="secondary">
                        Hủy bỏ
                    </Button>
                </div>
            </div>
        </>
    );
};

export default CustomerRequestForm;