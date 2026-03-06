import React from 'react';
import {
    Users,
    Zap,
    MapPin,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const data = [
    { name: 'Mon', income: 4000, users: 2400 },
    { name: 'Tue', income: 3000, users: 1398 },
    { name: 'Wed', income: 2000, users: 9800 },
    { name: 'Thu', income: 2780, users: 3908 },
    { name: 'Fri', income: 1890, users: 4800 },
    { name: 'Sat', income: 2390, users: 3800 },
    { name: 'Sun', income: 3490, users: 4300 },
];

const StatCard = ({ title, value, change, isPositive, icon: Icon }) => (
    <div className="card stat-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
                <span className="stat-label">{title}</span>
                <div className="stat-value">{value}</div>
            </div>
            <div style={{ padding: '8px', background: 'var(--bg-main)', borderRadius: '8px', color: 'var(--primary)' }}>
                <Icon size={20} />
            </div>
        </div>
        <div className={`stat-change ${isPositive ? 'change-up' : 'change-down'}`}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span>{change} vs last month</span>
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Stats Grid */}
            <div className="grid grid-cols-4">
                <StatCard
                    title="Total Income"
                    value="$24,500"
                    change="12.5%"
                    isPositive={true}
                    icon={DollarSign}
                />
                <StatCard
                    title="Registered Users"
                    value="1,280"
                    change="8.2%"
                    isPositive={true}
                    icon={Users}
                />
                <StatCard
                    title="EV Sessions"
                    value="450"
                    change="15.3%"
                    isPositive={true}
                    icon={Zap}
                />
                <StatCard
                    title="Parking Res."
                    value="85"
                    change="2.4%"
                    isPositive={false}
                    icon={MapPin}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-2">
                <div className="card">
                    <h3 style={{ marginBottom: '24px' }}>Revenue Overview</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow)' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="var(--primary)" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '24px' }}>New User Growth</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'var(--bg-main)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow)' }}
                                />
                                <Bar dataKey="users" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3>Recent Transactions</h3>
                    <button style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                        View All
                    </button>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Service</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ fontWeight: '500' }}>Kyaw Swar</td>
                                <td>EV Charging</td>
                                <td>$12.50</td>
                                <td>Oct 12, 2023</td>
                                <td><span className="badge badge-success">Completed</span></td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: '500' }}>Aye Aye</td>
                                <td>Parking</td>
                                <td>$5.00</td>
                                <td>Oct 12, 2023</td>
                                <td><span className="badge badge-success">Completed</span></td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: '500' }}>Min Min</td>
                                <td>Accessory</td>
                                <td>$45.00</td>
                                <td>Oct 11, 2023</td>
                                <td><span className="badge badge-warning">Pending</span></td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: '500' }}>Su Su</td>
                                <td>EV Charging</td>
                                <td>$18.20</td>
                                <td>Oct 11, 2023</td>
                                <td><span className="badge badge-success">Completed</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
