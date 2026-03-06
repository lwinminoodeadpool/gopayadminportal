import React, { useState } from 'react';
import { Search, Plus, MapPin, Edit, Trash2, Navigation } from 'lucide-react';

const initialParking = [
    { id: 1, name: 'Sule Square Parking', address: 'Sule Pagoda Rd, Yangon', coords: '16.7761° N, 96.1585° E', totalSlots: 200, price: 1000, available: 45, status: 'Active' },
    { id: 2, name: 'Times City Mall Parking', address: 'Kyimyindaing Rd, Yangon', coords: '16.8045° N, 96.1312° E', totalSlots: 500, price: 1500, available: 120, status: 'Active' },
    { id: 3, name: 'Central Boulevard Tower', address: 'Kaba Aye Pagoda Rd, Yangon', coords: '16.8321° N, 96.1578° E', totalSlots: 150, price: 2000, available: 12, status: 'Full' },
    { id: 4, name: 'City Loft Shopping Centre', address: 'Botahtaung Pagoda Rd, Yangon', coords: '16.7723° N, 96.1714° E', totalSlots: 100, price: 800, available: 60, status: 'Active' },
];

const ParkingAreas = () => {
    const [parking, setParking] = useState(initialParking);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header Actions */}
            <div className="card" style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <h3 style={{ margin: 0 }}>Parking Locations</h3>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                        <Plus size={20} />
                        Add New Area
                    </button>
                </div>
            </div>

            {/* Grid of Parking Areas */}
            <div className="grid grid-cols-2">
                {parking.map(area => (
                    <div key={area.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '10px', color: 'var(--warning)' }}>
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0 }}>{area.name}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                        <Navigation size={12} /> {area.address}
                                    </p>
                                </div>
                            </div>
                            <span className={`badge ${area.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                                {area.status}
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1, background: 'var(--bg-main)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Slots</p>
                                <p style={{ fontWeight: '700', fontSize: '1.25rem' }}>{area.totalSlots}</p>
                            </div>
                            <div style={{ flex: 1, background: 'var(--bg-main)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Available</p>
                                <p style={{ fontWeight: '700', fontSize: '1.25rem', color: area.available < 20 ? 'var(--danger)' : 'var(--success)' }}>{area.available}</p>
                            </div>
                            <div style={{ flex: 1, background: 'var(--bg-main)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Price / Hr</p>
                                <p style={{ fontWeight: '700', fontSize: '1.25rem' }}>{area.price} K</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <button className="btn btn-outline" style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                <Edit size={16} /> Edit
                            </button>
                            <button className="btn btn-outline" style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', color: 'var(--danger)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParkingAreas;
