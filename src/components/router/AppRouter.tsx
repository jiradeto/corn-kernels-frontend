import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import RequireAuth from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';
import StockDashboardPage from '@app/pages/DashboardPages/StockDashboardPage';

const NewsFeedPage = React.lazy(() => import('@app/pages/NewsFeedPage'));
const KanbanPage = React.lazy(() => import('@app/pages/KanbanPage'));
const DataTablesPage = React.lazy(() => import('@app/pages/DataTablesPage'));
const StockListPage = React.lazy(() => import('@app/pages/StockListPage'));
const ProductListPage = React.lazy(() => import('@app/pages/ProductListPage'));
const ServerErrorPage = React.lazy(() => import('@app/pages/ServerErrorPage'));
const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));
const NewStockPage = React.lazy(() => import('@app/pages/NewStockPage'));
const NewProductPage = React.lazy(() => import('@app/pages/NewProductPage'));
const Logout = React.lazy(() => import('./Logout'));

export const DASHBOARD_PATH = '/';
export const MEDICAL_DASHBOARD_PATH = '/medical-dashboard';

const MedicalDashboard = withLoading(StockDashboardPage);
const NewsFeed = withLoading(NewsFeedPage);
const Kanban = withLoading(KanbanPage);
const NewStock = withLoading(NewStockPage);
const NewProduct = withLoading(NewProductPage);
const DataTables = withLoading(DataTablesPage);
const StockList = withLoading(StockListPage);
const ProductList = withLoading(ProductListPage);
const ServerError = withLoading(ServerErrorPage);
const Error404 = withLoading(Error404Page);


const LogoutFallback = withLoading(Logout);

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );
  return (
    <BrowserRouter>
      <Routes>
        <Route path={DASHBOARD_PATH} element={protectedLayout}>
          <Route index element={<MedicalDashboard />} />
          <Route path={MEDICAL_DASHBOARD_PATH} element={<MedicalDashboard />} />
          <Route path="apps">
            <Route path="feed" element={<NewsFeed />} />
            <Route path="kanban" element={<Kanban />} />
          </Route>
          <Route path="data-tables" element={<DataTables />} />
          <Route path="stocks">
            <Route path="" element={<StockList />} />
            <Route path="new" element={<NewStock />} />
          </Route>
          <Route path="products">
            <Route path="" element={<ProductList />} />
            <Route path="new" element={<NewProduct />} />
          </Route>
          <Route path="server-error" element={<ServerError />} />
          <Route path="404" element={<Error404 />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
};
