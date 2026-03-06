import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, MapPin, Zap } from 'lucide-react';

const initialStations = [
    { id: 1, name: 'Junction City Charging Station', address: 'Bogyoke Aung San Rd, Yangon', coords: '16.7792° N, 96.1558° E', units: 4, price: 500, status: 'Active' },
    { id: 2, name: 'Hledan Centre Parking', address: 'Pyay Rd, Yangon', coords: '16.8256° N, 96.1325° E', units: 2, price: 450, status: 'Active' },
    { id: 3, name: 'Ocean Supercenter (Tamwe)', address: 'Lay Daung Kan Rd, Yangon', coords: '16.8052° N, 96.1789° E', units: 6, price: 600, status: 'Maintenance' },
    { id: 4, name: 'Myanmar Plaza EV Hub', address: 'Kaba Aye Pagoda Rd, Yangon', coords: '16.8294° N, 96.1541° E', units: 8, price: 550, status: 'Active' },
];

const EVCharging = () => {
    const [stations, setStations] = useState(initialStations);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header Actions */}
            <div className="card" style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <h3 style={{ margin: 0 }}>Charging Locations</h3>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                        <Plus size={20} />
                        Add New Station
                    </button>
                </div>
            </div>

            {/* Grid of Stations */}
            <div className="grid grid-cols-2">
                {stations.map(station => (
                    <div key={station.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ background: '#e0e7ff', padding: '10px', borderRadius: '10px', color: 'var(--primary)' }}>
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0 }}>{station.name}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                        <MapPin size={12} /> {station.address}
                                    </p>
                                </div>
                            </div>
                            <span className={`badge ${station.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                                {station.status}
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-main)', padding: '12px', borderRadius: '8px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Chargers</p>
                                <p style={{ fontWeight: '700' }}>{station.units} Units</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Price / kWh</p>
                                <p style={{ fontWeight: '700' }}>{station.price} MMK</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Coordinates</p>
                                <p style={{ fontWeight: '700', fontSize: '0.75rem' }}>{station.coords.split(',')[0]}</p>
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

export default EVCharging;
