import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from './layouts/MainLayout';
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./dashboard/Dashboard";
import ForgotPassword from './pages/auth/ForgotPassword';
import EmailConfirmation from './pages/auth/EmailConfirmation';

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
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
