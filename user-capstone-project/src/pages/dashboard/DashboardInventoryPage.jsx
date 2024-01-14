import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../../components/iconify';
import { useNavigate } from 'react-router-dom';
// sections
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


// ----------------------------------------------------------------------

const DashboardInventoryPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const visibleNotifications = showMore ? notifications : notifications.slice(0, 5);
    const isAuthenticated = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
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
    }, []);

    const getTitleByType = (type) => {
        switch (type) {
            case 'YEU_CAU_NHAP_KHO':
                return 'Thông báo về Yêu cầu nhập kho';
            case 'YEU_CAU_XUAT_KHO':
                return 'Thông báo về Yêu cầu xuất kho';
            case 'XAC_NHAN_NHAP_KHO':
                return 'Thông báo về Xác nhận nhập kho';
            // Thêm các trường hợp khác nếu cần
            default:
                return 'Thông báo';
        }
    };
    return (
        <>
            <Helmet>
                <title> Dashboard | SCPS - IMS </title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Tổng Quan
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <AppWidgetSummary title="Danh mục sản phẩm" total={20} icon={'material-symbols:category'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <AppWidgetSummary title="Sản Phẩm Trong Kho" total={100} color="info" icon={'fluent-mdl2:product-list'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <AppWidgetSummary
                            title="Số lượng kho chứa"
                            total={4}
                            color="warning"
                            icon={'gridicons:product'}
                        />
                    </Grid>

                    {/* <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
                    </Grid> */}

                    <Grid item xs={12} md={6} lg={8}>
                        <AppConversionRates
                            title="Biểu đồ thông kê phiếu"
                            // subheader="(+43%) than last year"
                            chartData={[
                                { label: 'Phiếu yêu cầu nhập kho', value: 400 },
                                { label: 'Phiếu nhập kho', value: 430 },
                                { label: 'Phiếu yêu cầu xuất kho', value: 448 },
                                { label: 'Phiếu xuất kho', value: 470 },
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppCurrentVisits
                            title="Thống kê phiếu hàng"
                            chartData={[
                                { label: 'Phiếu đã Hoàn Thành', value: 1443 },
                                { label: 'Phiếu đang chờ xử lý', value: 305 },
                            ]}
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
                            list={visibleNotifications.map(item => ({
                                id: item.id,
                                title: getTitleByType(item.type),
                                image: `/assets/images/covers/cover_${item.id % 5 + 1}.jpg`,
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
                                    'Quản lý gửi yêu cầu nhập kho',
                                    'Saler gửi yêu cầu khách hàng',
                                    'Quản lý gửi yêu cầu kiểm kho',
                                    'Quản lý gửi yêu cầu chuyển kho',
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
