import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Menu, MenuItem, Button } from '@mui/material';
// components
import Iconify from '../../../components/iconify';
// sections
import { AppConversionRates } from '../../../sections/@dashboard/app';

// ----------------------------------------------------------------------

const ReportSalePage = () => {
    const theme = useTheme();
    const [anchorElChart, setAnchorElChart] = useState(null);
    const [anchorElInterested, setAnchorElInterested] = useState(null);
    const [anchorElTime, setAnchorElTime] = useState(null);
    const [anchorElProduct, setAnchorElProduct] = useState(null);
    const [anchorElType, setAnchorElType] = useState(null);
    const [anchorElBrand, setAnchorElBrand] = useState(null);
    //Filter out
    const [selectedFilterChart, setSelectedFilterChart] = useState(null);
    const [selectedFilterInterested, setSelectedFilterInterested] = useState(null);
    const [selectedFilterTime, setSelectedFilterTime] = useState(null);
    const [selectedFilterProduct, setSelectedFilterProduct] = useState(null);
    const [selectedFilterType, setSelectedFilterType] = useState(null);
    const [selectedFilterBrand, setSelectedFilterBrand] = useState(null);

    //
    const handleFilterChartClick = (event) => {
        setAnchorElChart(event.currentTarget);
    };

    const handleFilterInterestedClick = (event) => {
        setAnchorElInterested(event.currentTarget);
    };

    const handleFilterTimeClick = (event) => {
        setAnchorElTime(event.currentTarget);
    };

    const handleFilterProductClick = (event) => {
        setAnchorElProduct(event.currentTarget);
    };

    const handleFilterTypeClick = (event) => {
        setAnchorElType(event.currentTarget);
    };

    const handleFilterBrandClick = (event) => {
        setAnchorElBrand(event.currentTarget);
    };



    //Handle filter
    const handleMenuChartClick = (filter) => {
        setSelectedFilterChart(filter);
        setAnchorElChart(null);
    };

    const handleMenuInterestedClick = (filter) => {
        setSelectedFilterInterested(filter);
        setAnchorElInterested(null);
    };

    const handleMenuTimeClick = (filter) => {
        setSelectedFilterTime(filter);
        setAnchorElTime(null);
    };
    const handleMenuProductClick = (filter) => {
        setSelectedFilterProduct(filter);
        setAnchorElProduct(null);
    };
    const handleMenuTypeClick = (filter) => {
        setSelectedFilterType(filter);
        setAnchorElType(null);
    };
    const handleMenuBrandClick = (filter) => {
        setSelectedFilterBrand(filter);
        setAnchorElBrand(null);
    };

    const handleClose = () => {
        setAnchorElChart(null);
        setAnchorElInterested(null);
        setAnchorElTime(null);
        setAnchorElProduct(null);
        setAnchorElType(null);
        setAnchorElBrand(null);
    };
    const filterChart = [
        'Biểu đồ',
        'Báo cáo',

    ];
    const filterOptions = [
        'Xuất nhập tồn',
        'Giá trị kho',
        'Xuất nhập tồn chi tiết',
    ];
    const filterTime = [
        'Tuần này',
        'Lựa chọn khác',
    ];
    const filterProduct = [
        'Theo mã, tên hàng',
    ];

    const filterType = [
        'Combo - đóng gói',
        'Hàng hóa',
        'Dịch vụ',
    ];

    const filterBrand = [
        'Chọn thương hiệu',
    ];

    return (
        <>
            <Helmet>
                <title> Report | Minimal UI </title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Báo cáo bán hàng
                </Typography>
                <Grid container>
                    <Grid item xs={2}>
                        <Button variant="outlined" onClick={handleFilterChartClick}>
                            {selectedFilterChart || 'Kiểu Hiện thị'}
                        </Button>

                        <Menu
                            anchorEl={anchorElChart}
                            open={Boolean(anchorElChart)}
                            onClose={handleClose}
                        >
                            {filterChart.map((filter, index) => (
                                <MenuItem key={index} onClick={() => handleMenuChartClick(filter)}>
                                    {filter}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Grid>

                    <Grid item xs={2}>
                        <Button variant="outlined" onClick={handleFilterInterestedClick}>
                            {selectedFilterInterested || 'Mối quan tâm'}
                        </Button>

                        <Menu
                            anchorEl={anchorElInterested}
                            open={Boolean(anchorElInterested)}
                            onClose={handleClose}
                        >
                            {filterOptions.map((filter, index) => (
                                <MenuItem key={index} onClick={() => handleMenuInterestedClick(filter)}>
                                    {filter}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" onClick={handleFilterTimeClick}>
                            {selectedFilterTime || 'Thời gian'}
                        </Button>

                        <Menu
                            anchorEl={anchorElTime}
                            open={Boolean(anchorElTime)}
                            onClose={handleClose}
                        >
                            {filterTime.map((filter, index) => (
                                <MenuItem key={index} onClick={() => handleMenuTimeClick(filter)}>
                                    {filter}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" onClick={handleFilterProductClick}>
                            {selectedFilterProduct || 'Hàng hóa'}
                        </Button>

                        <Menu
                            anchorEl={anchorElProduct}
                            open={Boolean(anchorElProduct)}
                            onClose={handleClose}
                        >
                            {filterProduct.map((filter, index) => (
                                <MenuItem key={index} onClick={() => handleMenuProductClick(filter)}>
                                    {filter}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" onClick={handleFilterTypeClick}>
                            {selectedFilterType || 'Loại hàng'}
                        </Button>

                        <Menu
                            anchorEl={anchorElType}
                            open={Boolean(anchorElType)}
                            onClose={handleClose}
                        >
                            {filterType.map((filter, index) => (
                                <MenuItem key={index} onClick={() => handleMenuTypeClick(filter)}>
                                    {filter}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" onClick={handleFilterBrandClick}>
                            {selectedFilterBrand || 'Thương hiệu'}
                        </Button>

                        <Menu
                            anchorEl={anchorElBrand}
                            open={Boolean(anchorElBrand)}
                            onClose={handleClose}
                        >
                            {filterBrand.map((filter, index) => (
                                <MenuItem key={index} onClick={() => handleMenuBrandClick(filter)}>
                                    {filter}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Grid>
                </Grid>

                <Grid spacing={3}>
                    <Grid item xs={12} md={6} lg={8} style={{ margin: '10px 10px 20px 0px' }}>
                        <AppConversionRates
                            title="Doanh thu tuần này"
                            chartData={[
                                { label: 'Ống đồng', value: 400 },
                                { label: 'Ren', value: 430 },
                                { label: 'Móc', value: 1200 },
                                { label: 'Ro', value: 1380 },
                            ]}
                        />
                    </Grid>

                </Grid>

            </Container>
        </>
    );
};
export default ReportSalePage;
