import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import EVChargingPage from './pages/EVCharging';
import ParkingPage from './pages/ParkingAreas';
import AccessoriesPage from './pages/Accessories';
import PlateNumbersPage from './pages/PlateNumbers';
import TransactionsPage from './pages/Transactions';
import ReportsPage from './pages/Reports';

function App() {
  return (
    <Router>
      <Routes>
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
        <Route path="/accessories" element={<MainLayout title="Accessories" />}>
          <Route index element={<AccessoriesPage />} />
        </Route>
        <Route path="/transactions" element={<MainLayout title="Transactions" />}>
          <Route index element={<TransactionsPage />} />
        </Route>
        <Route path="/reports" element={<MainLayout title="Reports & Analytics" />}>
          <Route index element={<ReportsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
