import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, LogOut } from 'lucide-react';

const TopNav = ({ title }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access-token');
        navigate('/login');
    };

    return (
        <div className="top-nav">
            <div className="nav-left">
                <h2 className="page-title">{title}</h2>
            </div>
            <div className="nav-right">
                <div className="search-bar">
                    {/* Add search input if needed */}
                </div>
                <button className="icon-btn">
                    <Bell size={20} />
                </button>
                <div className="user-profile">
                    <div className="avatar">A</div>
                    <div className="user-info">
                        <p className="user-name">Admin User</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="icon-btn logout-btn" title="Logout">
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );
};

export default TopNav;
