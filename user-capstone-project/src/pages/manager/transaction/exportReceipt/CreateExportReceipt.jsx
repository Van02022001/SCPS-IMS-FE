import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Box,
    Grid,
    Table,
    Button,
    DialogActions,
    DialogContent,
    Stack,
    TextField,
    Typography,
    TableContainer,
    FormControl,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
// sections
import { UserListHead } from '~/sections/@dashboard/user';
// mock
import USERLIST from '~/_mock/user';
import Scrollbar from '~/components/scrollbar/Scrollbar';
// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useNavigate } from 'react-router-dom';

function CreateExportReceipt() {
    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [selected, setSelected] = useState([]);

    const navigate = useNavigate();

    const TABLE_HEAD = [
        { id: 'name', label: 'Name', alignRight: false },
        { id: 'company', label: 'Company', alignRight: false },
        { id: 'role', label: 'Role', alignRight: false },
        { id: 'isVerified', label: 'Verified', alignRight: false },
        { id: 'status', label: 'Status', alignRight: false },
        { id: '' },
    ];

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = USERLIST.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleNavigate = () => {
        navigate("/dashboard/export-receipt");
    };



    // useEffect(() => {
    //     getAllSubCategory()
    //         .then((respone) => {
    //             const data = respone.data;
    //             if (Array.isArray(data)) {
    //                 setProductData(data);
    //                 setSortedProduct(data);
    //             } else {
    //                 console.error('API response is not an array:', data);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching users:', error);
    //         });
    // }, []);

    return (
        <>
            <Helmet>
                <title> Xuất Kho </title>
            </Helmet>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1}>
                    <Grid xs={8}>
                        <Stack direction="row" alignItems="center" mb={5}>
                            <Button onClick={handleNavigate}>
                                <ArrowBackIcon fontSize="large" color="action" />
                            </Button>
                            <Typography variant="h4" gutterBottom>
                                Xuất kho
                            </Typography>
                        </Stack>
                        <Scrollbar>
                            <TableContainer sx={{ minWidth: 800 }}>
                                <Table>
                                    <UserListHead
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        rowCount={USERLIST.length}
                                        numSelected={selected.length}
                                        onRequestSort={handleRequestSort}
                                        onSelectAllClick={handleSelectAllClick}
                                    />
                                </Table>
                            </TableContainer>
                        </Scrollbar>
                    </Grid>

                    {/* bên phải */}
                    <Grid xs={4}>
                        <>
                            <div style={{ textAlign: 'center' }}>
                                <DialogContent
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        minHeight: '720px',
                                    }}
                                >
                                    {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
                                    <Stack spacing={2} margin={2}>
                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                            <Grid xs={6}>
                                                <TextField variant="standard" label="Lê Sơn Tùng" />
                                            </Grid>
                                            <Grid xs={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker variant="standard" label="Today's Date" />
                                                </LocalizationProvider>
                                            </Grid>
                                        </Grid>
                                        <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                                    Mã phiếu nhập:{' '}
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    variant="standard"
                                                    label="Mã phiếu tự động"
                                                    sx={{ width: '40%' }}
                                                />
                                            </Grid>
                                        </FormControl>
                                        <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                                    Mã đặt hàng nhập:{' '}
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    variant="standard"
                                                    label="Tên hàng"
                                                    sx={{ width: '40%' }}
                                                />
                                            </Grid>
                                        </FormControl>
                                        <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                                    Trạng thái:{' '}
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    variant="standard"
                                                    label="Phiếu tạm"
                                                    sx={{ width: '40%' }}
                                                />
                                            </Grid>
                                        </FormControl>
                                        <TextField
                                            id="outlined-multiline-static"
                                            multiline
                                            // rows={4}
                                            label="Ghi chú"
                                            sx={{ width: '100%', border: 'none' }}
                                            variant="standard"
                                        />
                                    </Stack>
                                    <Button color="primary" variant="contained">
                                        Lưu
                                    </Button>
                                </DialogContent>
                                <DialogActions>
                                    {/* <Button color="success" variant="contained">Yes</Button>
                            <Button onClick={closepopup} color="error" variant="contained">Close</Button> */}
                                </DialogActions>
                            </div>
                        </>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default CreateExportReceipt;
