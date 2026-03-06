import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const MainLayout = ({ title }) => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <TopNav title={title} />
                <div className="content-body">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
