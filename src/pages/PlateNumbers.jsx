import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, CreditCard, User } from 'lucide-react';

const initialPlates = [
    { id: 1, plate: '2B-1234', owner: 'Kyaw Swar', model: 'BYD Atto 3', color: 'White', regDate: '2023-01-15' },
    { id: 2, plate: '1A-5678', owner: 'Kyaw Swar', model: 'Hyundai Ioniq 5', color: 'Silver', regDate: '2023-05-10' },
    { id: 3, plate: '3C-9999', owner: 'Aye Aye', model: 'Tesla Model Y', color: 'Black', regDate: '2023-02-20' },
    { id: 4, plate: '4D-7777', owner: 'Min Min', model: 'Nio ES6', color: 'Blue', regDate: '2023-03-05' },
    { id: 5, plate: '5E-1111', owner: 'Su Su', model: 'BMW iX3', color: 'White', regDate: '2023-03-10' },
    { id: 6, plate: '6F-2222', owner: 'Zaw Zaw', model: 'MG ZS EV', color: 'Red', regDate: '2023-04-01' },
];

const PlateNumbers = () => {
    const [plates, setPlates] = useState(initialPlates);
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
                            placeholder="Search by plate number or owner..."
                            className="input-field"
                            style={{ paddingLeft: '40px', width: '100%', height: '40px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                        <Plus size={20} />
                        Register Plate
                    </button>
                </div>
            </div>

            {/* Plates Table */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Plate Number</th>
                                <th>Owner</th>
                                <th>Vehicle Model</th>
                                <th>Color</th>
                                <th>Registration Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plates.filter(p => p.plate.toLowerCase().includes(searchTerm.toLowerCase()) || p.owner.toLowerCase().includes(searchTerm.toLowerCase())).map(plate => (
                                <tr key={plate.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ padding: '6px', background: 'var(--bg-main)', borderRadius: '6px' }}>
                                                <CreditCard size={16} />
                                            </div>
                                            <span style={{ fontWeight: '700', fontSize: '1rem', letterSpacing: '1px' }}>{plate.plate}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <User size={14} className="text-muted" />
                                            <span>{plate.owner}</span>
                                        </div>
                                    </td>
                                    <td>{plate.model}</td>
                                    <td>{plate.color}</td>
                                    <td>{plate.regDate}</td>
                                    <td style={{ display: 'flex', gap: '8px' }}>
                                        <button className="icon-btn-sm" title="Edit" style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                            <Edit size={16} />
                                        </button>
                                        <button className="icon-btn-sm" title="Delete" style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', color: 'var(--danger)' }}>
                                            <Trash2 size={16} />
                                        </button>
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

export default PlateNumbers;
