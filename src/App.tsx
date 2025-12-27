import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from './layouts/MainLayout';
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./dashboard/Dashboard";
import ForgotPassword from './pages/auth/ForgotPassword';
import EmailConfirmation from './pages/auth/EmailConfirmation';
import InvestmentsListPage from './pages/investments/InvestmentsListPage';
import InvestmentDetailPage from './pages/investments/InvestmentDetailPage';
import TransactionListPage from './pages/transactions/TransactinListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/confirm-email" element={<EmailConfirmation />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/investments" element={<InvestmentsListPage />} />
            <Route path="/investment/:id" element={<InvestmentDetailPage />} />
            <Route path="/transactions" element={<TransactionListPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
