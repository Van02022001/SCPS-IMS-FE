import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//page
import BlogPage from './pages/BlogPage';
import UserPage from './pages/user/UserPage';
import LoginPage from './pages/login/LoginPage';
import Page404 from './pages/Page404';
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
import SubCategoryInventoryPage from './pages/inventory_staff/subCategory/SubCategoryInventoryPage';
import ItemsSalePage from './pages/sale/items/ItemsSalePage';
import CustomerSalePage from './pages/sale/customer/CustomerSalePage';
import ViewReceiptPage from './pages/inventory_staff/transaction/importRequest/ViewReceiptPage';
import UnitPage from './pages/manager/unit/UnitPage';
import OriginPage from './pages/manager/origin/OriginPage';
import BrandPage from './pages/manager/brand/BrandPage';
import SupplierPage from './pages/manager/supplier/SupplierPage';
import RequestReceiptManagerPage from './pages/manager/transaction/requestImportReceipt/RequestReceiptManagerPage';
import CreateGoodReceipt from './pages/manager/transaction/requestImportReceipt/CreateGoodReceipt';
import CreateExportReceipt from './pages/manager/transaction/requestExportReceipt/CreateExportReceipt';
import ImportReceiptPage from './pages/inventory_staff/transaction/importReceipt/ImportReceiptPage';
import ItemsInventoryPage from './pages/inventory_staff/itemInventory/ItemsInventoryPage';
import ImportReceiptManagerPage from './pages/manager/transaction/importReceipt/ImportReceiptManagerPage';
import InventoryReportPage from './pages/manager/transaction/inventoryReport/InventoryReportPage';
import InventoryStaffReportPage from './pages/inventory_staff/inventoryReport/InventoryStaffReportPage';
import LocationInventoryPage from './pages/inventory_staff/locationInventory/LocationInventoryPage';
import WarehouseInventoryPage from './pages/inventory_staff/warehouseInventory/WarehouseInventoryPage';
import CustomerRequestPage from './pages/inventory_staff/transaction/exportRequest/CustomerRequestPage';
import ExportReceiptPage from './pages/inventory_staff/transaction/exportReceipt/ExportReceiptPage';
import ExportRequestReceiptManagerPage from './pages/manager/transaction/requestExportReceipt/ExportRequestReceiptManagerPage';
import ExportReceiptManagerPage from './pages/manager/transaction/exportReceipt/ExportReceiptManagerPage';
import CreateTransferForm from './sections/auth/inventory_staff/warehouseInventory/CreateTransferForm';
import InventoryCheckPage from './pages/inventory_staff/inventoryCheck/InventoryCheckPage';
import CreateInventoryCheck from './pages/inventory_staff/inventoryCheck/CreateInventoryCheck';
import DashboardInventoryPage from './pages/dashboard/DashboardInventoryPage';
import SubCategoryPage from './pages/manager/subCategory/SubCategoryPage';
import InventoryCheckManagerPage from './pages/manager/inventoryCheck/InventoryCheckManagerPage';
import NotificationToImportRequest from './pages/manager/notificationToReceipt/NotificationToImportRequest';
import NotificationToExportRequest from './pages/manager/notificationToReceipt/NotificationToExportRequest';
import NotificationToImportRequestInventory from './pages/inventory_staff/notificationToReceipt/NotificationToImportRequestInventory';
import NotificationToExportRequestInventory from './pages/inventory_staff/notificationToReceipt/NotificationToExportRequestInventory';

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
                        { path: 'production', element: <SubCategoryPage /> },
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

                { path: 'request-import-receipt', element: <RequestReceiptManagerPage /> }, 
                { path: 'create-good-receipt', element: <CreateGoodReceipt/> },
                { path: 'import-receipt', element: <ImportReceiptManagerPage/> },

                { path: 'request-export-receipt', element: <ExportRequestReceiptManagerPage /> },
                { path: 'create-export-receipt', element: <CreateExportReceipt/> },
                { path: 'export-receipt', element: <ExportReceiptManagerPage/> },
                { path: 'products-check', element: <InventoryReportPage/> },
                { path: 'inventory-check-manager', element: <InventoryCheckManagerPage/> },
                { path: 'notfication-to-request-receipt', element: <NotificationToImportRequest/> },
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
            path: 'forgetPassword',
            element: <ForgotPassword />,
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
                { path: 'dashboard', element: <DashboardInventoryPage /> },
                { path: 'product', element: <SubCategoryInventoryPage /> },
                { path: 'itemsInventory', element: <ItemsInventoryPage /> },
                { path: 'locationsInventory', element: <LocationInventoryPage /> },
                {path: 'warehousesInventory', element: <WarehouseInventoryPage />},
                { path: 'warehouse-transfer', element: <CreateTransferForm/> },
                
                // { path: 'order-sale', element: <OrderSalePage /> },
                { path: 'requests-import-receipt', element: <ViewReceiptPage /> },
                { path: 'import-receipt', element: <ImportReceiptPage /> },

                { path: 'inventory-check', element: <InventoryStaffReportPage /> },

                { path: 'requests-export-receipt', element: <CustomerRequestPage/> },
                { path: 'export-receipt', element: <ExportReceiptPage /> },
              
                { path: 'inventory-check-item', element: <InventoryCheckPage/> },
                { path: 'create-inventory-check', element: <CreateInventoryCheck/> },
                { path: 'notfication-to-import-request-receipt', element: <NotificationToImportRequestInventory/> },
                { path: 'notfication-to-export-request-receipt', element: <NotificationToExportRequestInventory/> },
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
