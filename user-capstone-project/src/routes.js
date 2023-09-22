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
        { path: 'products', element: <ProductsPage /> },
        { path: 'productsDetail', element: <ProductDetail />},
        { path: 'odersManager', element: <OdersManagerPage /> },
        { path: 'category', element: <CategoryPage />},
        { path: 'brand', element: <BrandPage />},
        { path: 'blog', element: <BlogPage /> },
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
      ],
    },
  ]);

  return routes;
};
export default Router;
