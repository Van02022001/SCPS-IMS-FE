// component
import SvgColor from '../../../components/svg-color';
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: icon('ic_analytics'),
  // },
  
  {
    title: 'Hàng hóa',
    icon: icon('ic_cart'),
    children: [
      {
        title: 'Danh mục',
        path: '/dashboard/products/production',
      },
      {
        title: 'Thiết lập giá',
        path: '/dashboard/products/products-price',
      },
      {
        title: 'Kiểm kho  ',
        path: '/dashboard/products',
      },
    ],
  },
  {
    title: 'Quản lý hóa đơn',
    path: '/dashboard/odersManager',
    icon: icon('ic_user'),
  },
  {
    title: 'Quản lý thể loại',
    path: '/dashboard/category',
    icon: icon('ic_blog'),
  },
  {
    title: 'Quản lý thương hiệu',
    path: '/dashboard/brand',
    icon: icon('ic_blog'),
  },
  {
    title: 'Báo cáo',
    icon: icon('ic_blog'),
    children: [
      {
        title: 'Cuối Ngày',
        path: '/dashboard/report/report-end-day',
      },
      {
        title: 'Bán hàng',
        path: '/dashboard/report/report-sale',
      },
      {
        title: 'Hàng hóa',
        path: '/dashboard/report/report-inventory',
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
