import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/user/UserPage';
import LoginPage from './pages/login/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/dashboard/DashboardAppPage';
import CreateProduct from './sections/@dashboard/products/crudProducts/CreateProduct';
import ProductDetail from './pages/productDetail/ProductDetail';
import OdersManagerPage from './pages/odersManager/OdersManager';
import CategoryPage from './pages/category/CategoryPage';
import BrandPage from './pages/brand/BrandPage';
import UpdateProduct from './sections/@dashboard/products/crudProducts/UpdateProduct';
import ReportPage from './pages/report/ReportPage';
import ReportProductPage from './pages/report/ReportProductPage';
import ReportSalePage from './pages/report/ReportSalePage';
import ProductsPricePage from './pages/products/ProductPrice';

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
        { path: 'products', 
        children: [
          {element: <Navigate to="/dashboard/products"/>, index: true},
          {path: 'production', element: <ProductsPage/>},
          {path: 'products-price', element: <ProductsPricePage/>} ] },

        { path: 'productsDetail', element: <ProductDetail />},
        { path: 'odersManager', element: <OdersManagerPage /> },
        { path: 'category', element: <CategoryPage />},
        { path: 'brand', element: <BrandPage />},
        { path: 'blog', element: <BlogPage /> },
        {
          path: 'report',
          children: [
            {element: <Navigate to="/dashboard/report" />, index: true },
            { path: 'report-end-day', element: <ReportPage /> }, // Con đường dẫn cho "Cuối Ngày"
            { path: 'report-sale', element: <ReportSalePage/> }, // Con đường dẫn cho "Bán hàng"
            { path: 'report-inventory', element: <ReportProductPage /> }, // Con đường dẫn cho "Hàng hóa"
          ],
        },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
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
