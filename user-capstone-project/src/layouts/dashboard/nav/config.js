// component
import SvgColor from '../../../components/svg-color';
import { ShoppingCart, Person, Assignment, Payments, CategoryOutlined, LocalOfferOutlined, ClassOutlined, CalendarToday, MonetizationOnOutlined, Inventory2Outlined, PriceChangeOutlined, DomainVerification } from '@mui/icons-material';
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Hàng hóa',
    icon: <ShoppingCart />,
    children: [
      {
        title: 'Danh mục',
        path: '/dashboard/products/production',
        icon: <ClassOutlined />,
      },
      {
        title: 'Thiết lập giá',
        path: '/dashboard/products/products-price',
        icon: <PriceChangeOutlined />, 
      },
      {
        title: 'Kiểm kho  ',
        path: '/dashboard/products/products-check',
        icon: <DomainVerification />,
      },
    ],
  },
   
  {
    title: 'Quản lý mục',
    icon: <Person />,
    children: [{
      title: 'Quản lý hóa đơn',
      path: '/dashboard/odersManager',
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
      title: 'Quản lý người bán',
      path: '/dashboard/supplier',
      icon: <LocalOfferOutlined />,
    },
    {
      title: 'Quản lý kho',
      path: '/dashboard/warehouse',
      icon: <Inventory2Outlined/>,
    },
  ],
  },

  {
    title: 'Báo cáo',
    icon: <Assignment />,
    children: [
      {
        title: 'Cuối Ngày',
        path: '/dashboard/report/report-end-day',
        icon: <CalendarToday />,
      },
      {
        title: 'Bán hàng',
        path: '/dashboard/report/report-sale',
        icon: <MonetizationOnOutlined />,
      },
      {
        title: 'Hàng hóa',
        path: '/dashboard/report/report-inventory',
        icon: <Inventory2Outlined/>,
      },
    ],
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];



export default navConfig;
