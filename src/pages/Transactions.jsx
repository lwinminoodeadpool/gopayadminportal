import React, { useState } from 'react';
import { Search, Download, Calendar, ArrowUpRight, ArrowDownRight, Zap, MapPin, ShoppingBag } from 'lucide-react';

const initialTransactions = [
    { id: 'TX-1001', user: 'Kyaw Swar', service: 'EV Charging', amount: 12500, date: '2023-10-12 14:30', method: 'KBZPay', status: 'Success' },
    { id: 'TX-1002', user: 'Aye Aye', service: 'Parking', amount: 5000, date: '2023-10-12 13:15', method: 'KBZPay', status: 'Success' },
    { id: 'TX-1003', user: 'Min Min', service: 'Accessory', amount: 45000, date: '2023-10-11 16:45', method: 'KBZPay', status: 'Pending' },
    { id: 'TX-1004', user: 'Su Su', service: 'EV Charging', amount: 18200, date: '2023-10-11 10:20', method: 'KBZPay', status: 'Success' },
    { id: 'TX-1005', user: 'Zaw Zaw', service: 'Parking', amount: 2500, date: '2023-10-10 18:00', method: 'KBZPay', status: 'Failed' },
    { id: 'TX-1006', user: 'Kyaw Swar', service: 'EV Charging', amount: 11000, date: '2023-10-09 11:10', method: 'KBZPay', status: 'Success' },
];

const getServiceIcon = (service) => {
    switch (service) {
        case 'EV Charging': return <Zap size={16} className="text-primary" />;
        case 'Parking': return <MapPin size={16} style={{ color: 'var(--warning)' }} />;
        case 'Accessory': return <ShoppingBag size={16} style={{ color: 'var(--success)' }} />;
        default: return null;
    }
};

const Transactions = () => {
    const [txns, setTxns] = useState(initialTransactions);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Stats Cards */}
            <div className="grid grid-cols-4">
                <div className="card" style={{ padding: '16px' }}>
                    <p className="stat-label">Total Revenue</p>
                    <p className="stat-value" style={{ fontSize: '1.25rem' }}>94,200 K</p>
                </div>
                <div className="card" style={{ padding: '16px' }}>
                    <p className="stat-label">Success Rate</p>
                    <p className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--success)' }}>92%</p>
                </div>
                <div className="card" style={{ padding: '16px' }}>
                    <p className="stat-label">Avg. Transaction</p>
                    <p className="stat-value" style={{ fontSize: '1.25rem' }}>15,700 K</p>
                </div>
                <div className="card" style={{ padding: '16px' }}>
                    <p className="stat-label">Pending</p>
                    <p className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--warning)' }}>45,000 K</p>
                </div>
            </div>

            {/* Header Actions */}
            <div className="card" style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '600px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="input-field"
                                style={{ paddingLeft: '40px', width: '100%', height: '40px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                            />
                        </div>
                        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}>
                            <Calendar size={18} />
                            Last 30 Days
                        </button>
                    </div>
                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}>
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>User</th>
                                <th>Service</th>
                                <th>Amount</th>
                                <th>Payment Method</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {txns.map(txn => (
                                <tr key={txn.id}>
                                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{txn.id}</td>
                                    <td>{txn.user}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {getServiceIcon(txn.service)}
                                            <span>{txn.service}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: '600' }}>{txn.amount.toLocaleString()} K</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0066b2' }}></div>
                                            <span>{txn.method}</span>
                                        </div>
                                    </td>
                                    <td>{txn.date}</td>
                                    <td>
                                        <span className={`badge ${txn.status === 'Success' ? 'badge-success' :
                                                txn.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                                            }`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
