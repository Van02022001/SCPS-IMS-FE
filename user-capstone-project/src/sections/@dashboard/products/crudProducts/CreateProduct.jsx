import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Box, Card, Container, Stack, Typography, Button, Grid } from '@mui/material';
// components
import Iconify from '~/components/iconify';
// mock
import { useNavigate } from 'react-router-dom';
// icons
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Label from '~/components/label/Label';
// text
import TextField from '@mui/material/TextField';
// date
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

function CreateProduct() {
    const [value, setValue] = React.useState([dayjs('2022-04-17'), dayjs('2022-04-21')]);

    return (
        <>
            <Helmet>
                <title> Create Products | Minimal UI </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" sx={{ mb: 5 }}>
                        Thêm mới Sản Phẩm
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon icon="eva:plus-fill" />}
                        href="/dashboard/products"
                    >
                        Quay lại
                    </Button>
                </Stack>

                <Grid container spacing={2} columns={16}>
                    <Grid item xs={8}>
                        <Card>
                            <Box sx={{ pt: '50%', position: 'relative' }}>
                                <Label
                                    variant="filled"
                                    sx={{
                                        zIndex: 9,
                                        top: 16,
                                        right: 16,
                                        position: 'absolute',
                                        textTransform: 'uppercase',
                                    }}
                                ></Label>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={8}>
                        <Box
                            sx={{
                                width: 600,
                                maxWidth: '100%',
                                marginBottom: '10px',
                            }}
                        >
                            <TextField fullWidth label="Name" id="Name" />
                        </Box>
                        <Box
                            sx={{
                                width: 600,
                                maxWidth: '100%',
                                marginBottom: '10px',
                            }}
                        >
                            <TextField fullWidth label="Description" id="Description" />
                        </Box>
                        {/*========== ngày ==========*/}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
                                <DemoItem label="1 calendar" component="DateRangePicker">
                                    <DateRangePicker calendars={1} />
                                </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider>
                        {/*========== ngày ==========*/}
                    </Grid>
                </Grid>
                <Stack width={190} direction="row" alignItems="center" justifyContent="space-between" mt={5}>
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                        Thêm
                    </Button>
                    <Button variant="outlined" startIcon={<ClearIcon icon="eva:plus-fill" />}>
                        Hủy
                    </Button>
                </Stack>
            </Container>
        </>
    );
}

export default CreateProduct;
