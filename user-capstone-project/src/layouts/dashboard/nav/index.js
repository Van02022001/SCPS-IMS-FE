import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
import SvgColor from '../../../components/svg-color';
import {
    ShoppingCart,
    Person,
    Assignment,
    Payments,
    CategoryOutlined,
    LocalOfferOutlined,
    ClassOutlined,
    CalendarToday,
    MonetizationOnOutlined,
    Inventory2Outlined,
    PriceChangeOutlined,
    DomainVerification,
    Receipt,
    Warehouse,
    ReceiptLong,
} from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// mock
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import navConfig from './config';
import { authenValidation } from '~/data/mutation/login/login-mutation';
import WarehouseIcon from '@mui/icons-material/Warehouse';
// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
    openNav: PropTypes.bool,
    onCloseNav: PropTypes.func,
};
const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

function getUserRole() {
    const userRole = localStorage.getItem('role'); // Lấy vai trò từ Local Storage hoặc nguồn dữ liệu khác
    return userRole || 'DEFAULT_ROLE'; // Gán một vai trò mặc định nếu không tìm thấy
}
// Cấu hình navbar cho vai trò MANAGER
const managerNavConfig = [
    {
        title: 'Hàng hóa',
        icon: <ShoppingCart />,
        children: [
            {
                title: 'Danh mục',
                path: '/dashboard/products/production',
                icon: <ClassOutlined />,
            }
            // {
            //     title: 'Thiết lập giá',
            //     path: '/dashboard/products/products-price',
            //     icon: <PriceChangeOutlined />,
            // },
            // {
            //     title: 'Kiểm kho  ',
            //     path: '/dashboard/products/products-check',
            //     icon: <DomainVerification />,
            // },
        ],
    },

    {
        title: 'Quản lý mục',
        icon: <Person />,
        children: [
            {
                title: 'Quản lý sản phẩm',
                path: '/dashboard/itemsManager',
                icon: <Payments />,
            },
            {
                title: 'Quản lý thể loại',
                path: '/dashboard/category',
                icon: <CategoryOutlined />,
            },
            {
                title: 'Quản lý nguồn gốc',
                path: '/dashboard/origin',
                icon: <LocalOfferOutlined />,
            },
            {
                title: 'Quản lý thương hiệu',
                path: '/dashboard/brand',
                icon: <LocalOfferOutlined />,
            },
            {
                title: 'Quản lý nhà cung cấp',
                path: '/dashboard/supplier',
                icon: <LocalOfferOutlined />,
            },
            {
                title: 'Quản lý kho',
                path: '/dashboard/warehouse',
                icon: <Inventory2Outlined />,
            },
            {
                title: 'Quản lý đơn vị',
                path: '/dashboard/unit',
                icon: <Inventory2Outlined />,
            },
        ],
    },

    // {
    //     title: 'Báo cáo',
    //     icon: <Assignment />,
    //     children: [
    //         {
    //             title: 'Cuối Ngày',
    //             path: '/dashboard/report/report-end-day',
    //             icon: <CalendarToday />,
    //         },
    //         {
    //             title: 'Bán hàng',
    //             path: '/dashboard/report/report-sale',
    //             icon: <MonetizationOnOutlined />,
    //         },
    //         {
    //             title: 'Hàng hóa',
    //             path: '/dashboard/report/report-inventory',
    //             icon: <Inventory2Outlined />,
    //         },
    //     ],
    // },
    {
        title: 'Giao dịch',
        icon: <ShoppingCart />,
        children: [
            {
                title: 'Nhập hàng',
                icon: <ClassOutlined />,
                children: [
                    {
                        title: 'Yêu cầu nhập kho',
                        path: '/dashboard/request-import-receipt',
                        icon: <ReceiptLong />,
                    },
                    {
                        title: 'Phiếu nhập kho',
                        path: '/dashboard/import-receipt',
                        icon: <Receipt />,
                    },
                ],
            },
            {
                title: 'Xuất kho',
                icon: <PriceChangeOutlined />,
                children: [
                    {
                        title: 'Yêu cầu xuất kho',
                        path: '/dashboard/request-export-receipt',
                        icon: <ReceiptLong />,
                    },
                    {
                        title: 'Phiếu xuất kho',
                        path: '/dashboard/export-receipt',
                        icon: <Receipt />,
                    },
                ]
            },
            {
                title: 'Nhập tồn kho',
                path: '/dashboard/products-check',
                icon: <DomainVerification />,
            },
        ],
    },
    // {
    //   title: 'login',
    //   path: '/login',
    //   icon: icon('ic_lock'),
    // },
    // {
    //   title: 'Not found',
    //   path: '/404',
    //   icon: icon('ic_disabled'),
    // },
];

// Cấu hình navbar cho vai trò INVENTORY
const inventoryNavConfig = [
    {
        title: 'Hàng hóa',
        icon: <ShoppingCart />,
        children: [
            {
                title: 'Danh mục',
                path: '/inventory-staff/product',
                icon: <ClassOutlined />,
            }
        ],
    },
    {
        title: 'Quản lý kho',
        icon: <Person />,
        children: [
            {
                title: 'Quản lý sản phẩm',
                path: '/inventory-staff/itemsInventory',
                icon: <Payments />,
            },
            {
                title: 'Quản lý địa chỉ',
                path: '/inventory-staff/locationsInventory',
                icon: <WarehouseIcon />,
            },
        ],
    },
    {
        title: 'Giao dịch',
        icon: <ShoppingCart />,
        children: [
            {
                title: 'Nhập hàng',
                icon: <Warehouse />,
                children: [
                    {
                        title: 'Yêu cầu nhập kho',
                        path: '/inventory-staff/requests-import-receipt',
                        icon: <ReceiptLong />,
                    },
                    {
                        title: 'Phiếu nhập kho',
                        path: '/inventory-staff/import-receipt',
                        icon: <Receipt />,
                    },
                ],
            },
            {
                title: 'Xuất hàng',
                icon: <Warehouse />,
                children: [
                    {
                        title: 'Yêu cầu xuất kho',
                        path: '/inventory-staff/requests-export-receipt',
                        icon: <ReceiptLong />,
                    },
                    {
                        title: 'Phiếu xuất kho',
                        path: '/inventory-staff/export-receipt',
                        icon: <Receipt />,
                    },
                    
                ]
            },
            {
                title: 'Nhập tồn kho',
                path: '/inventory-staff/inventory-check',
                icon: <DomainVerification />,
            },
        ],
    },
    // { 
    //     title: 'login',
    //     path: '/login',
    //     icon: icon('ic_lock'),
    // },
    // ...
];

// Cấu hình navbar cho vai trò SALE
const saleNavConfig = [
    {
        title: 'Sản phẩm',
        path: '/sale-staff/items-sale',
        icon: <Payments />,
    },
    {
        title: 'Quản lý khách hàng',
        path: '/sale-staff/customer-sale',
        icon: <Payments />,
    },
    {
        title: 'Quản lý phiếu xuất kho',
        path: '/sale-staff/request-customer',
        icon: <Payments />,
    },
    {
        title: 'Bán hàng',
        path: '/sale',
        icon: icon('ic_disabled'),
    },
    {
        title: 'login',
        path: '/login',
        icon: icon('ic_lock'),
    },

    // ...
];
export default function Nav({ openNav, onCloseNav }) {
    const { pathname } = useLocation();
    const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);
    const isDesktop = useResponsive('up', 'lg');
    const userRole = getUserRole();

    let selectedNavbarConfig = [];

    if (userRole === 'MANAGER') {
        selectedNavbarConfig = managerNavConfig;
    } else if (userRole === 'INVENTORY_STAFF') {
        selectedNavbarConfig = inventoryNavConfig;
    } else if (userRole === 'SALE_STAFF') {
        selectedNavbarConfig = saleNavConfig;
    }

    const handleReportMenuToggle = () => {
        setIsReportMenuOpen(!isReportMenuOpen);
    };

    console.log(userRole);

    const role = localStorage.getItem('role');
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        if (openNav) {
            onCloseNav();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const renderContent = (
        <Scrollbar
            sx={{
                height: 1,
                '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
            }}
        >
            <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
                <Logo />
            </Box>

            <Box sx={{ mb: 5, mx: 2.5 }}>
                <Link underline="none">
                    <StyledAccount>
                        <Avatar src={account.photoURL} alt="photoURL" />

                        <Box sx={{ ml: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                {userName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {userRole}
                            </Typography>
                        </Box>
                    </StyledAccount>
                </Link>
            </Box>

            <NavSection
                data={selectedNavbarConfig}
                onReportClick={handleReportMenuToggle}
                isReportMenuOpen={isReportMenuOpen}
            />

            <Box sx={{ flexGrow: 1 }} />
        </Scrollbar>
    );

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: { lg: 0 },
                width: { lg: NAV_WIDTH },
            }}
        >
            {isDesktop ? (
                <Drawer
                    open
                    variant="permanent"
                    PaperProps={{
                        sx: {
                            width: NAV_WIDTH,
                            bgcolor: 'background.default',
                            borderRightStyle: 'dashed',
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            ) : (
                <Drawer
                    open={openNav}
                    onClose={onCloseNav}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    PaperProps={{
                        sx: { width: NAV_WIDTH },
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        </Box>
    );
}
