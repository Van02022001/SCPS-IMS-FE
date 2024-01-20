import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, FormControl, InputLabel, MenuItem, Select, Button } from '@mui/material';
// components
import Iconify from '../../components/iconify';
import { useNavigate } from 'react-router-dom';
// sections
import SearchIcon from '@mui/icons-material/Search';

import {
    AppTasks,
    AppNewsUpdate,
    AppOrderTimeline,
    AppCurrentVisits,
    // AppWebsiteVisits,
    // AppTrafficBySite,
    AppWidgetSummary,
    // AppCurrentSubject,
    AppConversionRates,
} from '../../sections/@dashboard/app';
import { getAllNotification } from '~/data/mutation/notification/notification-mutation';
import { createReports, getReports } from '~/data/mutation/report/report_mutation';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import Button from '~/theme/overrides/Button';

// ----------------------------------------------------------------------

const DashboardInventoryPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [reportData, setReportData] = useState();
    const [selectedDate, setSelectedDate] = useState(null);
    const [age, setAge] = React.useState('');
    const [saveData, setSaveData] = useState(null);

    const [chartData, setChartData] = useState([]);
    const [chartCircleData, setChartCircleData] = useState([]);

    const roleUser = localStorage.getItem('role');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSearchButtonClick = () => {
        handleSave();
    };

    const visibleNotifications = showMore ? notifications : notifications.slice(0, 5);
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    };

    useEffect(() => {
        isAuthenticated();
        const userId = localStorage.getItem('id');
        getAllNotification(userId)
            .then((response) => {
                // Process and set notifications data
                setNotifications(response.data);
            })
            .catch((error) => {
                console.error('Error fetching notifications:', error);
            });
        getReports()
            .then((response) => {
                const data = response.data;
                setReportData(data);
                setChartData([
                    {
                        label: 'Tổng giá trị nhập',
                        value: data?.subcategoryReportResponse?.totalItemImportValue ?? 0,
                    },
                    {
                        label: 'Tổng giá trị xuất',
                        value: data?.subcategoryReportResponse?.totalItemExportValue ?? 0,
                    },
                    {
                        label: 'Tổng giá trị tồn kho',
                        value: data?.subcategoryReportResponse?.totalInventoryValue ?? 0,
                    },
                ]);
                setChartCircleData([
                    {
                        label: 'Tổng số sản phẩm nhập',
                        value: data?.subcategoryReportResponse?.totalItemImportQuantity ?? 0,
                    },
                    {
                        label: 'Tổng số sản phẩm xuất',
                        value: data?.subcategoryReportResponse?.totalItemExportQuantity ?? 0,
                    },
                    {
                        label: 'Tổng sản phẩm hỏng',
                        value: data?.subcategoryReportResponse?.totalDefectiveItemQuantity ?? 0,
                    },
                    {
                        label: 'Tổng sản phẩm bị mất',
                        value: data?.subcategoryReportResponse?.totalLostItemQuantity ?? 0,
                    },
                ]);
            })
            .catch((error) => {
                console.error('Error fetching reports:', error);
            });
    }, []);

    const getTitleByType = (type) => {
        switch (type) {
            case 'CANH_BAO_HET_HANG':
                return 'Thông báo về Hết hàng trong kho';
            case 'CANH_BAO_THUA_HANG':
                return 'Thông báo về Thừa hàng trong kho';
            default:
                return 'Thông báo! Kiểm tra kĩ';
        }
    };

    const handleSave = async () => {
        if (!selectedDate || !age) {
            // Handle validation or show an error message
            return;
        }

        const localDate = new Date(selectedDate);

        const year = localDate.getFullYear();
        const month = localDate.getMonth() + 1; // Months are zero-indexed
        const day = localDate.getDate();

        const isoDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        const reportsParams = {
            date: isoDate, // Convert date to ISO string
            type: age === 10 ? 'Ngày' : age === 20 ? 'Tháng' : 'Năm',
        };

        try {
            const response = await createReports(reportsParams);
            // Handle the response as needed

            console.log(response);

            const newChartData = [
                {
                    label: 'Giá trị sản phẩm nhập',
                    value: response.data?.importedItemValue ?? 0,
                },
                {
                    label: 'Giá trị sản phẩm xuất',
                    value: response.data?.exportedItemValue ?? 0,
                },
                // {
                //     label: 'Tổng giá trị tồn kho',
                //     value: reportData?.subcategoryReportResponse?.totalInventoryValue ?? 0,
                // },
            ];

            setChartData(newChartData);

            const newChartCircleData = [
                {
                    label: 'Số sản phẩm nhập',
                    value: response.data?.numberImportItem ?? 0,
                },
                {
                    label: 'Số sản phẩm xuất',
                    value: response.data?.numberExportItem ?? 0,
                },
                // {
                //     label: 'Tổng sản phẩm hỏng',
                //     value: reportData?.subcategoryReportResponse?.totalDefectiveItemQuantity ?? 0,
                // },
                // {
                //     label: 'Tổng sản phẩm bị mất',
                //     value: reportData?.subcategoryReportResponse?.totalLostItemQuantity ?? 0,
                // },
            ];

            setChartCircleData(newChartCircleData);

            // You might want to perform additional actions here after saving the report.
        } catch (error) {
            console.error('Error creating reports', error);
        }
    };

    console.log(reportData, 'REPORT');
    console.log(saveData, 'SAVE DATA');
    console.log(chartData, 'CHART DATA');
    return (
        <>
            <Helmet>
                <title> Dashboard | SCPS - IMS </title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
                    Tổng Quan
                    <FormControl sx={{ ml: 116, width: 270 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} sx={{ paddingTop: 0 }}>
                                <DatePicker label="" value={selectedDate} onChange={handleDateChange} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </FormControl>
                    <FormControl sx={{ minWidth: 80, mr: 1 }}>
                        <InputLabel id="demo-simple-select-label">Loại</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={age}
                            label="Age"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ngày</MenuItem>
                            <MenuItem value={20}>Tháng</MenuItem>
                            <MenuItem value={30}>Năm</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="outlined" sx={{ padding: 0.8, minWidth: 0 }} onClick={handleSearchButtonClick}>
                        <SearchIcon />
                    </Button>
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary
                            title="Danh mục sản phẩm"
                            total={reportData?.subcategoryReportResponse?.totalSubcategory || 0}
                            icon={'material-symbols:category'}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary
                            title="Sản phẩm trong kho"
                            total={reportData?.subcategoryReportResponse?.totalItem || 0}
                            color="info"
                            icon={'fluent-mdl2:product-list'}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary
                            title="Tổng số tồn kho"
                            total={reportData?.subcategoryReportResponse?.totalItemQuantity || 0}
                            color="warning"
                            icon={'gridicons:product'}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary
                            title="Tổng giá trị tồn kho"
                            total={reportData?.subcategoryReportResponse?.totalInventoryValue || 0}
                            color="warning"
                            icon={'grommet-icons:money'}
                        />
                    </Grid>
                    {roleUser !== 'MANAGER' ||
                        roleUser !== 'INVENTORY_STAFF' ||
                        (roleUser !== 'SALE_STAFF' && (
                            <>
                                <Grid item xs={12} sm={6} md={3}>
                                    <AppWidgetSummary
                                        title="Tổng số nhân viên"
                                        total={reportData?.staffReportResponse?.totalStaff || 0}
                                        color="success"
                                        icon={'mdi:human-male'}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <AppWidgetSummary
                                        title="Tổng số quản lý"
                                        total={reportData?.staffReportResponse?.totalManager || 0}
                                        color="success"
                                        icon={'mdi:human-male'}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <AppWidgetSummary
                                        title="Tổng số nhân viên quản kho"
                                        total={reportData?.staffReportResponse?.totalInventoryStaff || 0}
                                        color="error"
                                        icon={'mdi:human-male'}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <AppWidgetSummary
                                        title="Tổng số nhân viên bán hàng"
                                        total={reportData?.staffReportResponse?.totalSaleStaff || 0}
                                        color="error"
                                        icon={'mdi:human-male'}
                                    />
                                </Grid>
                            </>
                        ))}
                    {/* <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
                    </Grid> */}

                    <Grid item xs={12} md={6} lg={8}>
                        <AppConversionRates
                            title="Biểu đồ thông giá trị nhập xuất"
                            // subheader="(+43%) than last year"
                            chartData={chartData}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppCurrentVisits
                            title="Thống kê nhập xuất"
                            chartData={chartCircleData}
                            chartColors={[
                                theme.palette.primary.main,
                                theme.palette.info.main,
                                theme.palette.warning.main,
                                theme.palette.error.main,
                            ]}
                        />
                    </Grid>

                    {/* <Grid item xs={12} md={6} lg={8}>
                        <AppWebsiteVisits
                            title="Biểu đồ doanh số bán hàng"
                            subheader="(+43%) than last year"
                            chartLabels={[
                                '01/01/2003',
                                '02/01/2003',
                                '03/01/2003',
                                '04/01/2003',
                                '05/01/2003',
                                '06/01/2003',
                                '07/01/2003',
                                '08/01/2003',
                                '09/01/2003',
                                '10/01/2003',
                                '11/01/2003',
                            ]}
                            chartData={[
                                // {
                                //   name: 'Team A',
                                //   type: 'column',
                                //   fill: 'solid',
                                //   data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                                // },
                                // {
                                //   name: 'Team B',
                                //   type: 'area',
                                //   fill: 'gradient',
                                //   data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                                // },
                                {
                                    name: 'Team C',
                                    type: 'line',
                                    fill: 'solid',
                                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                                },
                            ]}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <AppCurrentSubject
                            title="Current Subject"
                            chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
                            chartData={[
                                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
                            ]}
                            chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
                        />
                    </Grid> */}

                    <Grid item xs={12} md={6} lg={8}>
                        <AppNewsUpdate
                            title="Thông báo"
                            list={visibleNotifications.map((item) => ({
                                id: item.id,
                                title: getTitleByType(item.type),
                                image: `/assets/images/covers/cover_${(item.id % 5) + 1}.jpg`,
                                postedAt: item.createdAt,
                            }))}
                        />
                        {/* {!showMore && notifications.length > 5 && (
                            <button onClick={() => setShowMore(true)}>Xem thêm</button>
                        )} */}
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppOrderTimeline
                            title="Dòng thời gian gửi phiếu"
                            list={[...Array(5)].map((_, index) => ({
                                id: faker.datatype.uuid(),
                                title: [
                                    'Nhân viên quản kho xác nhận yêu cầu nhập kho',
                                    'Nhân viên quản kho tiến hành nhập kho',
                                    'Nhân viên quản kho tạo phiếu nhập kho',
                                    'Sản phẩm trong kho xắp hết',
                                    'Phiếu kiểm kho vừa được tạo',
                                ][index],
                                type: `order${index + 1}`,
                                time: faker.date.past(),
                            }))}
                        />
                    </Grid>

                    {/* <Grid item xs={12} md={6} lg={4}>
                        <AppTrafficBySite
                            title="Traffic by Site"
                            list={[
                                {
                                    name: 'FaceBook',
                                    value: 323234,
                                    icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                                },
                                {
                                    name: 'Google',
                                    value: 341212,
                                    icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                                },
                                {
                                    name: 'Linkedin',
                                    value: 411213,
                                    icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                                },
                                {
                                    name: 'Twitter',
                                    value: 443232,
                                    icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                                },
                            ]}
                        />
                    </Grid> */}

                    <Grid item xs={12} md={6} lg={8}>
                        <AppTasks
                            title="Nhắc nhở"
                            list={[
                                { id: '1', label: 'Kiểm tra sản phẩm' },
                                { id: '2', label: 'Kiểm tra kho' },
                                { id: '3', label: 'Kiểm tra thông báo' },
                            ]}
                        />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};
export default DashboardInventoryPage;
