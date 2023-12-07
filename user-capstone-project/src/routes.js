import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/user/UserPage';
import LoginPage from './pages/login/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/manager/subCategory/SubCategoryPage';
import DashboardAppPage from './pages/dashboard/DashboardAppPage';
import CreateProduct from './sections/@dashboard/products/crudProducts/CreateProduct';
import ProductDetail from './pages/manager/productDetail/ProductDetail';
import ItemsManagerPage from './pages/manager/items/ItemsManager';
import CategoryPage from './pages/manager/category/CategoryPage';
import UpdateProduct from './sections/@dashboard/products/crudProducts/UpdateProduct';
import ReportPage from './pages/manager/report/ReportPage';
import ReportProductPage from './pages/manager/report/ReportProductPage';
import ReportSalePage from './pages/manager/report/ReportSalePage';
import ProductsPricePage from './pages/manager/subCategory/ProductPrice';
import ForgotPassword from './pages/login/ForgotPassword';
import WarehousePage from './pages/manager/warehouse/WarehousePage';
import CreateRequestCustomerPage from './pages/sale/requestCustomer/CreateRequestCustomerPage';
import CustomerRequestSalePage from './pages/sale/requestCustomer/CustomerRequestSalePage';
import ProductInventoryPage from './pages/inventory_staff/product/ProductInventoryPage';
import ItemsSalePage from './pages/sale/items/ItemsSalePage';
import CustomerSalePage from './pages/sale/customer/CustomerSalePage';
import GoodsReceiptPage from './pages/inventory_staff/transaction/GoodsReceiptPage';
import ViewReceiptPage from './pages/inventory_staff/transaction/importRequest/ViewReceiptPage';
import BadsReceiptPage from './pages/inventory_staff/transaction/BadsReceiptPage';
import UnitPage from './pages/manager/unit/UnitPage';
import OriginPage from './pages/manager/origin/OriginPage';
import BrandPage from './pages/manager/brand/BrandPage';
import SupplierPage from './pages/manager/supplier/SupplierPage';
import RequestReceiptManagerPage from './pages/manager/transaction/requestReceipt/RequestReceiptManagerPage';
import CreateGoodReceipt from './pages/manager/transaction/requestReceipt/CreateGoodReceipt';
import ExportReceiptManagerPage from './pages/manager/transaction/exportReceipt/ExportReceiptManagerPage';
import CreateExportReceipt from './pages/manager/transaction/exportReceipt/CreateExportReceipt';
import ImportReceiptPage from './pages/inventory_staff/transaction/importReceipt/ImportReceiptPage';
import ItemsInventoryPage from './pages/inventory_staff/itemInventory/ItemsInventoryPage';
import ImportReceiptManagerPage from './pages/manager/transaction/importReceipt/ImportReceiptManagerPage';
import InventoryReportPage from './pages/manager/transaction/inventoryReport/InventoryReportPage';
import InventoryStaffReportPage from './pages/inventory_staff/inventoryReport/InventoryStaffReportPage';
import LocationInventoryPage from './pages/inventory_staff/locationInventory/LocationInventoryPage';
import CustomerRequestPage from './pages/inventory_staff/transaction/exportRequest/CustomerRequestPage';
import ExportReceiptPage from './pages/inventory_staff/transaction/exportReceipt/ExportReceiptPage';

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
                { path: 'itemsManager', element: <ItemsManagerPage /> },
                { path: 'category', element: <CategoryPage /> },
                { path: 'origin', element: <OriginPage /> },
                { path: 'brand', element: <BrandPage /> },
                { path: 'supplier', element: <SupplierPage /> },
                { path: 'unit', element: <UnitPage/> },
                { path: 'blog', element: <BlogPage /> },
                { path: 'warehouse', element: <WarehousePage /> },
                { path: 'goods-receipt', element: <RequestReceiptManagerPage /> }, 
                { path: 'create-good-receipt', element: <CreateGoodReceipt/> },
                { path: 'import-receipt', element: <ImportReceiptManagerPage/> },
                { path: 'export-receipt', element: <ExportReceiptManagerPage /> },
                { path: 'create-export-receipt', element: <CreateExportReceipt/> },
                { path: 'products-check', element: <InventoryReportPage/> },
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
            path: '/sale-staff/',
            element: <DashboardLayout />,
            children: [
                { path: 'items-sale', element: <ItemsSalePage /> },
                { path: 'customer-sale', element: <CustomerSalePage /> },
                { path: 'create-request', element: <CreateRequestCustomerPage /> },
                { path: 'request-customer', element: <CustomerRequestSalePage /> },
            ],
        },
        {
            path: '/inventory-staff',
            element: <DashboardLayout />,
            children: [
                { path: 'product', element: <ProductInventoryPage /> },
                { path: 'itemsInventory', element: <ItemsInventoryPage /> },
                { path: 'locationsInventory', element: <LocationInventoryPage /> },
                
                // { path: 'order-sale', element: <OrderSalePage /> },
                { path: 'requests-import-receipt', element: <ViewReceiptPage /> },

                { path: 'import-receipt', element: <ImportReceiptPage /> },

                { path: 'inventory-check', element: <InventoryStaffReportPage /> },

                { path: 'goods-receipt', element: <GoodsReceiptPage /> },
                { path: 'requests-export-receipt', element: <CustomerRequestPage/> },
                { path: 'export-receipt', element: <ExportReceiptPage /> },
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
