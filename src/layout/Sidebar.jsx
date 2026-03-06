import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Zap,
  MapPin,
  ShoppingBag,
  LineChart,
  History,
  Layout,
  Package,
  ChevronDown
} from 'lucide-react';

const Sidebar = () => {
  const [expandedGroups, setExpandedGroups] = useState({
    'Service Management': true,
    'Commerce': true,
    'Finance': false,
    'System': false
  });

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const menuGroups = [
    {
      group: '',
      items: [
        { name: 'Dashboard', icon: <LayoutDashboard />, path: '/' },
        { name: 'Users', icon: <Users />, path: '/users' },
        { name: 'Car Plates', icon: <CreditCard />, path: '/plates' },
      ]
    },
    {
      group: 'Service Management',
      items: [
        { name: 'EV Charging', icon: <Zap />, path: '/charging' },
        { name: 'Parking Areas', icon: <MapPin />, path: '/parking' },
      ]
    },
    {
      group: 'Commerce',
      items: [
        { name: 'Product Management', icon: <ShoppingBag />, path: '/accessories' },
        { name: 'Order Management', icon: <Package />, path: '/orders' },
      ]
    },
    {
      group: 'Finance',
      items: [
        { name: 'Transactions', icon: <History />, path: '/transactions' },
        { name: 'Reports', icon: <LineChart />, path: '/reports' },
      ]
    },
    {
      group: 'System',
      items: [
        { name: 'Content Management', icon: <Layout />, path: '/content' },
      ]
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-text">GO<span className="logo-accent">PAY</span> ADMIN</div>
      </div>
      <nav className="sidebar-menu">
        {menuGroups.map((group, idx) => {
          const isExpanded = group.group === '' || expandedGroups[group.group];

          return (
            <div key={idx} style={{ marginBottom: group.group ? '12px' : '4px' }}>
              {group.group && (
                <div
                  onClick={() => toggleGroup(group.group)}
                  style={{
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                    borderRadius: '8px',
                    margin: '0 4px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {group.group}
                  </span>
                  <ChevronDown
                    size={14}
                    color="rgba(255,255,255,0.4)"
                    style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s'
                    }}
                  />
                </div>
              )}

              <div style={{
                height: isExpanded ? 'auto' : '0',
                overflow: 'hidden',
                opacity: isExpanded ? 1 : 0,
                transition: 'all 0.3s ease-in-out',
                paddingLeft: group.group ? '4px' : '0'
              }}>
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
