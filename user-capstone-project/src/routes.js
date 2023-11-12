import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/user/UserPage';
import LoginPage from './pages/login/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/products/ProductsPage';
import DashboardAppPage from './pages/dashboard/DashboardAppPage';
import CreateProduct from './sections/@dashboard/products/crudProducts/CreateProduct';
import ProductDetail from './pages/productDetail/ProductDetail';
import OdersManagerPage from './pages/manager/items/ItemsManager';
import CategoryPage from './pages/manager/category/CategoryPage';
import BrandPage from './pages/manager/brand/BrandPage';
import UpdateProduct from './sections/@dashboard/products/crudProducts/UpdateProduct';
import ReportPage from './pages/manager/report/ReportPage';
import ReportProductPage from './pages/manager/report/ReportProductPage';
import ReportSalePage from './pages/manager/report/ReportSalePage';
import ProductsPricePage from './pages/products/ProductPrice';
import ForgotPassword from './pages/login/ForgotPassword';
import WarehousePage from './pages/warehouse/WarehousePage';
import SaleProductPage from './pages/sale/SaleProductPage';
import OrderSalePage from './pages/sale/order/OrderSalePage';
import ProductInventoryPage from './pages/inventory_staff/product/ProductInventoryPage';
import ItemsSalePage from './pages/sale/items/ItemsSalePage';
import CustomerSalePage from './pages/sale/customer/CustomerSalePage';
import GoodsReceiptPage from './pages/inventory_staff/transaction/GoodsReceiptPage';
import ViewReceiptPage from './pages/inventory_staff/transaction/ViewReceiptPage';
import ExportsReceipt from './pages/inventory_staff/transaction/ExportsReceipt';
import BadsReceiptPage from './pages/inventory_staff/transaction/BadsReceiptPage';

// ----------------------------------------------------------------------

const Router = () => {
    const routes = useRoutes([
        {
            path: '/dashboard',
            element: <DashboardLayout />,
            children: [
                { element: <Navigate to="/dashboard/app" />, index: true },
                { path: 'app', element: <DashboardAppPage /> },
                { path: 'user', element: <UserPage /> },
                {
                    path: 'products',
                    children: [
                        { element: <Navigate to="/dashboard/products" />, index: true },
                        { path: 'production', element: <ProductsPage /> },
                        { path: 'products-price', element: <ProductsPricePage /> },
                    ],
                },

                { path: 'productsDetail', element: <ProductDetail /> },
                { path: 'odersManager', element: <OdersManagerPage /> },
                { path: 'category', element: <CategoryPage /> },
                { path: 'brand', element: <BrandPage /> },
                { path: 'blog', element: <BlogPage /> },
                { path: 'warehouse', element: <WarehousePage /> },
                {
                    path: 'report',
                    children: [
                        { element: <Navigate to="/dashboard/report" />, index: true },
                        { path: 'report-end-day', element: <ReportPage /> },
                        { path: 'report-sale', element: <ReportSalePage /> },
                        { path: 'report-inventory', element: <ReportProductPage /> },
                    ],
                },
            ],
        },
        {
            path: 'login',
            element: <LoginPage />,
        },
        {
            element: <DashboardLayout />,
            children: [
                { path: 'items-sale', element: <ItemsSalePage /> },
                { path: 'customer-sale', element: <CustomerSalePage /> },
                { path: 'sale', element: <SaleProductPage /> },
                { path: 'order-sale', element: <OrderSalePage /> },
            ],
        },
        {
            path: '/inventory-staff',
            element: <DashboardLayout />,
            children: [
                { path: 'product', element: <ProductInventoryPage /> },
                { path: 'order-sale', element: <OrderSalePage /> },
                { path: 'views-receipt', element: <ViewReceiptPage /> },
                { path: 'goods-receipt', element: <GoodsReceiptPage /> },
                { path: 'exports-receipt', element: <ExportsReceipt /> },
                { path: 'bads-receipt', element: <BadsReceiptPage /> },


            ],
        },
        {
            path: 'forgotpw',
            element: <ForgotPassword />,
        },
        {
            element: <SimpleLayout />,
            children: [
                { element: <Navigate to="/dashboard/app" />, index: true },
                { path: '404', element: <Page404 /> },
                { path: '*', element: <Navigate to="/404" /> },
            ],
        },
        {
            path: '*',
            element: <Navigate to="/404" replace />,
        },
        {
            element: <DashboardLayout />,
            children: [
                { element: <Navigate to="/dashboard/app" />, index: true },
                { path: 'createProducts', element: <CreateProduct /> },
                { path: 'updateProducts', element: <UpdateProduct /> },
            ],
        },
    ]);

    return routes;
};
export default Router;
