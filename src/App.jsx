import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import ProtectedRoute from './layout/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import EVChargingPage from './pages/EVCharging';
import ParkingPage from './pages/ParkingAreas';
import AccessoriesPage from './pages/Accessories';
import PlateNumbersPage from './pages/PlateNumbers';
import TransactionsPage from './pages/Transactions';
import ReportsPage from './pages/Reports';
import ContentPage from './pages/ContentManagement';
import OrdersPage from './pages/Orders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout title="Dashboard" />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/users" element={<MainLayout title="User Management" />}>
            <Route index element={<UsersPage />} />
          </Route>
          <Route path="/plates" element={<MainLayout title="Car Plate Numbers" />}>
            <Route index element={<PlateNumbersPage />} />
          </Route>
          <Route path="/charging" element={<MainLayout title="EV Charging" />}>
            <Route index element={<EVChargingPage />} />
          </Route>
          <Route path="/parking" element={<MainLayout title="Parking Areas" />}>
            <Route index element={<ParkingPage />} />
          </Route>
          <Route path="/accessories" element={<MainLayout title="Product Management" />}>
            <Route index element={<AccessoriesPage />} />
          </Route>
          <Route path="/transactions" element={<MainLayout title="Transactions" />}>
            <Route index element={<TransactionsPage />} />
          </Route>
          <Route path="/reports" element={<MainLayout title="Reports & Analytics" />}>
            <Route index element={<ReportsPage />} />
          </Route>
          <Route path="/content" element={<MainLayout title="Content Management" />}>
            <Route index element={<ContentPage />} />
          </Route>
          <Route path="/orders" element={<MainLayout title="Order Management" />}>
            <Route index element={<OrdersPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
