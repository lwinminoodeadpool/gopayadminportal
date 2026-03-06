import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Zap, 
  MapPin, 
  ShoppingBag, 
  LineChart, 
  History 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard />, path: '/' },
    { name: 'Users', icon: <Users />, path: '/users' },
    { name: 'Car Plates', icon: <CreditCard />, path: '/plates' },
    { name: 'EV Charging', icon: <Zap />, path: '/charging' },
    { name: 'Parking Areas', icon: <MapPin />, path: '/parking' },
    { name: 'Accessories', icon: <ShoppingBag />, path: '/accessories' },
    { name: 'Transactions', icon: <History />, path: '/transactions' },
    { name: 'Reports', icon: <LineChart />, path: '/reports' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-text">GO<span className="logo-accent">PAY</span> ADMIN</div>
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
