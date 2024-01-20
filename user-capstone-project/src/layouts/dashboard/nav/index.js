import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar } from '@mui/material';
import SvgColor from '../../../components/svg-color';
import {
    Person,
    Payments,
    CategoryOutlined,
    LocalOfferOutlined,
    Inventory2Outlined,
    DomainVerification,
    Receipt,
    Warehouse,
    ReceiptLong,
    Category,
    Assessment,
    Description,
    AddHome,
    Class,
} from '@mui/icons-material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
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
import PlaceIcon from '@mui/icons-material/Place';
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
    const userRole = localStorage.getItem('role');
    return userRole || 'DEFAULT_ROLE';
}
// Cấu hình navbar cho vai trò MANAGER
const managerNavConfig = [
    {
        title: 'Hàng hóa',
        icon: <Inventory2Icon />,
        children: [
            {
                title: 'Danh mục',
                path: '/dashboard/products/production',
                icon: <Category />,
            },
            // {
            //     title: 'Thiết lập giá',
            //     path: '/dashboard/products/products-price',
            //     icon: <PriceChangeOutlined />,
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
                icon: <Description />,
            },
            {
                title: 'Quản lý thể loại',
                path: '/dashboard/category',
                icon: <CategoryOutlined />,
            },
            {
                title: 'Quản lý xuất xứ',
                path: '/dashboard/origin',
                icon: <Class />,
            },
            {
                title: 'Quản lý thương hiệu',
                path: '/dashboard/brand',
                icon: <LocalOfferOutlined />,
            },
            {
                title: 'Quản lý nhà cung cấp',
                path: '/dashboard/supplier',
                icon: <AddHome />,
            },
            {
                title: 'Kho',
                path: '/dashboard/warehouse',
                icon: <Inventory2Outlined />,
            },
            {
                title: 'Quản lý đơn vị',
                path: '/dashboard/unit',
                icon: <Class />,
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
        title: 'Nhập kho',
        icon: <Warehouse />,
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
        icon: <Warehouse />,
        children: [
            // {
            //     title: 'Yêu cầu xuất kho',
            //     path: '/dashboard/request-export-receipt',
            //     icon: <ReceiptLong />,
            // },
            {
                title: 'Phiếu xuất kho',
                path: '/dashboard/export-receipt',
                icon: <Receipt />,
            },
        ],
    },
    {
        title: 'Kiểm kho',
        icon: <Assessment />,
        children: [
            {
                title: 'Phiếu kiểm kho',
                path: '/dashboard/inventory-check-manager',
                icon: <ReceiptLong />,
            },
        ],
    },
    {
        title: 'Nhập tồn kho',
        path: '/dashboard/products-check',
        icon: <DomainVerification />,
    },
    {
        title: 'Chuyển kho',
        icon: <Warehouse />,
        children: [
            {
                title: 'Nhập kho nội bộ',
                icon: <ReceiptLong />,
                children: [
                    {
                        title: 'Yêu cầu nhập kho nội bộ',
                        path: '/dashboard/internal-import-request',
                        icon: <ReceiptLong />,
                    },
                    {
                        title: 'Phiếu nhập kho nội bộ',
                        path: '/dashboard/internal-import',
                        icon: <Receipt />,
                    },
                ],
            },
            {
                title: 'Xuất kho nội bộ',
                icon: <Receipt />,
                children: [
                    {
                        title: 'Yêu cầu xuất kho nội bộ',
                        path: '/dashboard/internal-exprot-request',
                        icon: <ReceiptLong />,
                    },
                    {
                        title: 'Phiếu xuất kho nội bộ',
                        path: '/dashboard/internal-export',
                        icon: <Receipt />,
                    },
                ]
            },
        ],
    },
    
];

// Cấu hình navbar cho vai trò INVENTORY
const inventoryNavConfig = [
    // {
    //     title: 'Hàng hóa',
    //     icon: <ShoppingCart />,
    //     children: [
    //         {
    //             title: 'Danh mục',
    //             path: '/inventory-staff/product',
    //             icon: <ClassOutlined />,
    //         }
    //     ],
    // },
    {
        title: 'Quản lý kho',
        icon: <Person />,
        children: [
            {
                title: 'Quản lý sản phẩm',
                path: '/inventory-staff/itemsInventory',
                icon: <Class />,
            },
            {
                title: 'Quản lý vị trí',
                path: '/inventory-staff/locationsInventory',
                icon: <PlaceIcon />,
            },
            // {
            //     title: 'Chuyển kho',
            //     path: '/inventory-staff/warehousesInventory',
            //     icon: <WarehouseIcon />,
            // },
        ],
    },
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
        ],
    },
    {
        title: 'Kiểm kho',
        icon: <Assessment />,
        children: [
            {
                title: 'Kiểm kho',
                icon: <ReceiptLong />,
                path: '/inventory-staff/inventory-check-item',
            },
        ],
    },
    {
        title: 'Nhập tồn kho',
        path: '/inventory-staff/inventory-check',
        icon: <DomainVerification />,
    },
    {
        title: 'Chuyển kho',
        icon: <Warehouse />,
        children: [
            {
                title: 'Nhập kho nội bộ',
                icon: <ReceiptLong />,
                children: [
                    {
                        title: 'Yêu cầu nhập kho nội bộ',
                        path: '/inventory-staff/requests-internal-import',
                        icon: <ReceiptLong />,
                    },
                    {
                        title: 'Phiếu nhập kho nội bộ',
                        path: '/inventory-staff/internal-import-receipt',
                        icon: <Receipt />,
                    }
                ],
            },
            {
                title: 'Xuất kho nội bộ',
               icon: <Receipt />,
               children: [
                {
                    title: 'Yêu cầu xuất kho nội bộ',
                    path: '/inventory-staff/internal-export-request-staff',
                    icon: <ReceiptLong />,
                },
                {
                    title: 'Phiếu xuất kho nội bộ',
                    path: '/inventory-staff/internal-export-staff',
                    icon: <Receipt />,
                }
            ],
            },
        ],
    }

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
        icon: <Person />,
    },
    {
        title: 'Quản lý khách hàng',
        path: '/sale-staff/customer-sale',
        icon: <Payments />,
    },
    {
        title: 'Quản lý phiếu xuất kho',
        path: '/sale-staff/request-customer',
        icon: <ReceiptLong />,
    },
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

    const getRoleLabel = (role) => {
        switch (role) {
            case 'SALE_STAFF':
                return 'Nhân viên bán hàng';
            case 'INVENTORY_STAFF':
                return 'Nhân viên quản kho';
            case 'MANAGER':
                return 'Quản lý';
            default:
                return 'Không xác định';
        }
    };
    console.log(userRole);

    const role = localStorage.getItem('role');
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        if (openNav) {
            onCloseNav();
        }
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
                                {getRoleLabel(userRole)}
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
