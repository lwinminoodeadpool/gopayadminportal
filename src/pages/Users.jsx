import React, { useState } from 'react';
import { Search, Filter, Eye, UserX, UserCheck } from 'lucide-react';

const usersData = [
    { id: 1, name: 'Kyaw Swar', email: 'kyaw@example.com', phone: '09123456789', regDate: '2023-01-15', status: 'Active', plates: ['2B-1234', '1A-5678'] },
    { id: 2, name: 'Aye Aye', email: 'aye@example.com', phone: '09876543210', regDate: '2023-02-20', status: 'Active', plates: ['3C-9999'] },
    { id: 3, name: 'Min Min', email: 'min@example.com', phone: '09555444333', regDate: '2023-03-05', status: 'Disabled', plates: ['4D-7777'] },
    { id: 4, name: 'Su Su', email: 'susu@example.com', phone: '09222333444', regDate: '2023-03-10', status: 'Active', plates: ['5E-1111'] },
    { id: 5, name: 'Zaw Zaw', email: 'zaw@example.com', phone: '09111888777', regDate: '2023-04-01', status: 'Active', plates: ['6F-2222'] },
];

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header Actions */}
            <div className="card" style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input
                            type="text"
                            placeholder="Search users by name, email or phone..."
                            className="input-field"
                            style={{ paddingLeft: '40px', width: '100%', height: '40px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}>
                            <Filter size={18} />
                            Filter
                        </button>
                        <button className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                            Add New User
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>User Details</th>
                                <th>Phone Number</th>
                                <th>Reg. Date</th>
                                <th>Plate Numbers</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '600' }}>{user.name}</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{user.email}</span>
                                        </div>
                                    </td>
                                    <td>{user.phone}</td>
                                    <td>{user.regDate}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            {user.plates.map(plate => (
                                                <span key={plate} style={{ background: 'var(--bg-main)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '500' }}>{plate}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td style={{ display: 'flex', gap: '8px' }}>
                                        <button className="icon-btn-sm" title="View Details" style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                            <Eye size={16} />
                                        </button>
                                        {user.status === 'Active' ? (
                                            <button className="icon-btn-sm" title="Disable User" style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', color: 'var(--danger)' }}>
                                                <UserX size={16} />
                                            </button>
                                        ) : (
                                            <button className="icon-btn-sm" title="Enable User" style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', color: 'var(--success)' }}>
                                                <UserCheck size={16} />
                                            </button>
                                        )}
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

export default UserManagement;
