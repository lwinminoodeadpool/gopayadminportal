import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Download, TrendingUp, Users, Zap, MapPin, ShoppingBag } from 'lucide-react';

const revenueData = [
    { name: 'Jan', charging: 4000, parking: 2400, accessories: 2400 },
    { name: 'Feb', charging: 3000, parking: 1398, accessories: 2210 },
    { name: 'Mar', charging: 2000, parking: 9800, accessories: 2290 },
    { name: 'Apr', charging: 2780, parking: 3908, accessories: 2000 },
    { name: 'May', charging: 1890, parking: 4800, accessories: 2181 },
    { name: 'Jun', charging: 2390, parking: 3800, accessories: 2500 },
];

const serviceDistribution = [
    { name: 'EV Charging', value: 45, color: 'var(--primary)' },
    { name: 'Parking', value: 35, color: 'var(--warning)' },
    { name: 'Accessories', value: 20, color: 'var(--success)' },
];

const Reports = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Revenue & Growth Analytics</h3>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                    <Download size={20} />
                    Download Full Report
                </button>
            </div>

            <div className="grid grid-cols-3">
                {/* KPI Cards */}
                <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ padding: '8px', background: 'var(--bg-main)', borderRadius: '8px', color: 'var(--primary)' }}>
                            <TrendingUp size={20} />
                        </div>
                        <span className="stat-label">Total Revenue</span>
                    </div>
                    <p className="stat-value">1,450,200 K</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        +12.5% from last month
                    </p>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ padding: '8px', background: 'var(--bg-main)', borderRadius: '8px', color: 'var(--warning)' }}>
                            <Users size={20} />
                        </div>
                        <span className="stat-label">User Growth</span>
                    </div>
                    <p className="stat-value">245 New</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        +8.2% from last month
                    </p>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ padding: '8px', background: 'var(--bg-main)', borderRadius: '8px', color: 'var(--success)' }}>
                            <Zap size={20} />
                        </div>
                        <span className="stat-label">Avg. Ticket Size</span>
                    </div>
                    <p className="stat-value">15,800 K</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        -2.4% from last month
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2">
                {/* Revenue Breakdown Chart */}
                <div className="card">
                    <h4 style={{ marginBottom: '24px' }}>Revenue by Service (Monthly)</h4>
                    <div style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'var(--bg-main)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow)' }}
                                />
                                <Legend iconType="circle" />
                                <Bar dataKey="charging" name="EV Charging" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="parking" name="Parking" fill="var(--warning)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="accessories" name="Accessories" fill="var(--success)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Service Distribution Pie Chart */}
                <div className="card">
                    <h4 style={{ marginBottom: '24px' }}>Service Revenue Distribution</h4>
                    <div style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={serviceDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {serviceDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card">
                <h4 style={{ marginBottom: '24px' }}>Monthly Active Users (Trend)</h4>
                <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow)' }}
                            />
                            <Line type="monotone" dataKey="charging" name="Active Users" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Reports;
