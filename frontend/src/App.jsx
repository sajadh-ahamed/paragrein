import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';
import AdminOverviewPage from './pages/admin/AdminOverviewPage.jsx';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage.jsx';
import AssignmentHistoryPage from './pages/admin/AssignmentHistoryPage.jsx';
import AuditLogsPage from './pages/admin/AuditLogsPage.jsx';
import EmployeesPage from './pages/admin/EmployeesPage.jsx';
import IssueReportsPage from './pages/admin/IssueReportsPage.jsx';
import OrdersManagementPage from './pages/admin/OrdersManagementPage.jsx';
import PricingSettingsPage from './pages/admin/PricingSettingsPage.jsx';
import ReportsPage from './pages/admin/ReportsPage.jsx';
import CreateOrderPage from './pages/customer/CreateOrderPage.jsx';
import CustomerOrderDetailsPage from './pages/customer/CustomerOrderDetailsPage.jsx';
import CustomerOverviewPage from './pages/customer/CustomerOverviewPage.jsx';
import CustomerTrackOrderPage from './pages/customer/CustomerTrackOrderPage.jsx';
import MyOrdersPage from './pages/customer/MyOrdersPage.jsx';
import AssignedDeliveriesPage from './pages/driver/AssignedDeliveriesPage.jsx';
import DeliveryHistoryPage from './pages/driver/DeliveryHistoryPage.jsx';
import DeliveryTaskDetailPage from './pages/driver/DeliveryTaskDetailPage.jsx';
import DriverOverviewPage from './pages/driver/DriverOverviewPage.jsx';
import FinanceOverviewPage from './pages/finance/FinanceOverviewPage.jsx';
import FinanceReportsPage from './pages/finance/FinanceReportsPage.jsx';
import OutstandingBalancesPage from './pages/finance/OutstandingBalancesPage.jsx';
import PaymentDetailPage from './pages/finance/PaymentDetailPage.jsx';
import PaymentHistoryPage from './pages/finance/PaymentHistoryPage.jsx';
import PaymentVerificationPage from './pages/finance/PaymentVerificationPage.jsx';
import MyIssuesPage from './pages/issues/MyIssuesPage.jsx';
import NotificationsPage from './pages/notifications/NotificationsPage.jsx';
import AssignedPickupsPage from './pages/pickup/AssignedPickupsPage.jsx';
import PickupHistoryPage from './pages/pickup/PickupHistoryPage.jsx';
import PickupOverviewPage from './pages/pickup/PickupOverviewPage.jsx';
import PickupTaskDetailPage from './pages/pickup/PickupTaskDetailPage.jsx';
import TrackOrderPage from './pages/public/TrackOrderPage.jsx';
import ArrivalQueuePage from './pages/warehouse/ArrivalQueuePage.jsx';
import ReadyForDispatchPage from './pages/warehouse/ReadyForDispatchPage.jsx';
import WarehouseHistoryPage from './pages/warehouse/WarehouseHistoryPage.jsx';
import WarehouseOrderDetailPage from './pages/warehouse/WarehouseOrderDetailPage.jsx';
import WarehouseOverviewPage from './pages/warehouse/WarehouseOverviewPage.jsx';
import WarehouseRecordsPage from './pages/warehouse/WarehouseRecordsPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleBasedRedirect from './routes/RoleBasedRedirect.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/track" element={<TrackOrderPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route
          path="/app"
          element={(
            <ProtectedRoute>
              <RoleBasedRedirect />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminOverviewPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/orders"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <OrdersManagementPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/orders/ready-for-pickup"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <OrdersManagementPage defaultTab="READY" />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/orders/ready-for-driver"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <OrdersManagementPage defaultTab="READY_FOR_DRIVER" />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/orders/:orderId"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminOrderDetailPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/employees"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <EmployeesPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/pricing-settings"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <PricingSettingsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/issues"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <IssueReportsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/audit-logs"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AuditLogsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/assignments"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AssignmentHistoryPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/reports"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ReportsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/notifications"
          element={(
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/issues/my"
          element={(
            <ProtectedRoute>
              <MyIssuesPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/finance"
          element={(
            <ProtectedRoute allowedRoles={['FINANCE_OFFICER']}>
              <FinanceOverviewPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/finance/payment-verification"
          element={(
            <ProtectedRoute allowedRoles={['FINANCE_OFFICER']}>
              <PaymentVerificationPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/finance/payment-history"
          element={(
            <ProtectedRoute allowedRoles={['FINANCE_OFFICER']}>
              <PaymentHistoryPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/finance/payments/:paymentId"
          element={(
            <ProtectedRoute allowedRoles={['FINANCE_OFFICER']}>
              <PaymentDetailPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/finance/outstanding-balances"
          element={(
            <ProtectedRoute allowedRoles={['FINANCE_OFFICER']}>
              <OutstandingBalancesPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/finance/reports"
          element={(
            <ProtectedRoute allowedRoles={['FINANCE_OFFICER']}>
              <FinanceReportsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/customer"
          element={(
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerOverviewPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/customer/create-order"
          element={(
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CreateOrderPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/customer/orders"
          element={(
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <MyOrdersPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/customer/orders/:id"
          element={(
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerOrderDetailsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/customer/track"
          element={(
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerTrackOrderPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/pickup"
          element={(
            <ProtectedRoute allowedRoles={['PICKUP_AGENT']}>
              <PickupOverviewPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/pickup/tasks"
          element={(
            <ProtectedRoute allowedRoles={['PICKUP_AGENT']}>
              <AssignedPickupsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/pickup/tasks/history"
          element={(
            <ProtectedRoute allowedRoles={['PICKUP_AGENT']}>
              <PickupHistoryPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/pickup/tasks/:assignmentId"
          element={(
            <ProtectedRoute allowedRoles={['PICKUP_AGENT']}>
              <PickupTaskDetailPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/warehouse"
          element={(
            <ProtectedRoute allowedRoles={['WAREHOUSE_STAFF']}>
              <WarehouseOverviewPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/warehouse/arrival-queue"
          element={(
            <ProtectedRoute allowedRoles={['WAREHOUSE_STAFF']}>
              <ArrivalQueuePage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/warehouse/records"
          element={(
            <ProtectedRoute allowedRoles={['WAREHOUSE_STAFF']}>
              <WarehouseRecordsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/warehouse/ready-for-dispatch"
          element={(
            <ProtectedRoute allowedRoles={['WAREHOUSE_STAFF']}>
              <ReadyForDispatchPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/warehouse/history"
          element={(
            <ProtectedRoute allowedRoles={['WAREHOUSE_STAFF']}>
              <WarehouseHistoryPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/warehouse/orders/:orderId"
          element={(
            <ProtectedRoute allowedRoles={['WAREHOUSE_STAFF']}>
              <WarehouseOrderDetailPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/driver"
          element={(
            <ProtectedRoute allowedRoles={['DRIVER']}>
              <DriverOverviewPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/driver/deliveries"
          element={(
            <ProtectedRoute allowedRoles={['DRIVER']}>
              <AssignedDeliveriesPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/driver/deliveries/history"
          element={(
            <ProtectedRoute allowedRoles={['DRIVER']}>
              <DeliveryHistoryPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/driver/deliveries/:assignmentId"
          element={(
            <ProtectedRoute allowedRoles={['DRIVER']}>
              <DeliveryTaskDetailPage />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
