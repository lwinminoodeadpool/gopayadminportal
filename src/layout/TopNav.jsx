import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const TopNav = ({ title }) => {
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
            </div>
        </div>
    );
};

export default TopNav;
