import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Zap, X, Loader2, RefreshCw, Phone, Clock, Navigation } from 'lucide-react';
import { getAccessToken } from '../services/authService';

const BASE_URL = '/service/Bill_Payments__copay/0.0.1';

const EMPTY_FORM = {
    name: '',
    address: '',
    chargingType: '',
    direction: '',
    openTime: '',
    phoneNumber: '',
    price: '',
};

const EVCharging = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStation, setEditingStation] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // ── Fetch ────────────────────────────────────────────────────────────────
    const fetchStations = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = await getAccessToken();

            const res = await fetch(`${BASE_URL}/evparking_fetch`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': token,
                },
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch stations`);

            const data = await res.json();

            if (data.resCode === '0' && data.result && data.result.data) {
                setStations(data.result.data.map(item => ({
                    id: item.id,
                    name: item.name || 'Unnamed Station',
                    address: item.Bill_Payments__address__CST || item.address || 'N/A',
                    chargingType: item.chargingType || 'N/A',
                    direction: item.direction || '',
                    openTime: item.openTime || '',
                    phoneNumber: item.phoneNumber || '',
                    price: item.Bill_Payments__price__CST || item.price || '0',
                })));
            } else {
                throw new Error(data.resMsg || 'Failed to parse station data');
            }
        } catch (err) {
            console.error('[EVCharging] Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStations(); }, []);

    // ── Helpers ──────────────────────────────────────────────────────────────
    const openAddModal = () => {
        setEditingStation(null);
        setFormData(EMPTY_FORM);
        setSubmitError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (station) => {
        setEditingStation(station);
        setFormData({
            name: station.name,
            address: station.address,
            chargingType: station.chargingType,
            direction: station.direction,
            openTime: station.openTime,
            phoneNumber: station.phoneNumber,
            price: station.price,
        });
        setSubmitError(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingStation(null);
        setSubmitError(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ── Create / Update ──────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const token = await getAccessToken();
            const isEditing = !!editingStation;

            const url = isEditing
                ? `${BASE_URL}/evparking_update`
                : `${BASE_URL}/evparking_create`;

            const payload = isEditing
                ? {
                    id: String(editingStation.id),
                    name: formData.name,
                    address: formData.address,
                    chargingType: formData.chargingType,
                    direction: formData.direction,
                    openTime: formData.openTime,
                    phoneNumber: formData.phoneNumber,
                    price: String(formData.price),
                }
                : {
                    name: formData.name,
                    address: formData.address,
                    chargingType: formData.chargingType,
                    direction: formData.direction,
                    openTime: formData.openTime,
                    phoneNumber: formData.phoneNumber,
                    price: String(formData.price),
                };

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': token,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.resCode === '0') {
                closeModal();
                fetchStations();
            } else {
                throw new Error(data.resMsg || `Failed to ${isEditing ? 'update' : 'create'} station`);
            }
        } catch (err) {
            console.error('[EVCharging] Submit error:', err);
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Delete ───────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this charging station?')) return;
        setDeletingId(id);

        try {
            const token = await getAccessToken();

            const res = await fetch(`${BASE_URL}/evparking_delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': token,
                },
                body: JSON.stringify({ id: String(id) }),
            });

            const data = await res.json();

            if (data.resCode === '0') {
                fetchStations();
            } else {
                throw new Error(data.resMsg || 'Failed to delete station');
            }
        } catch (err) {
            console.error('[EVCharging] Delete error:', err);
            alert(err.message);
        } finally {
            setDeletingId(null);
        }
    };

    // ── Render States ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--primary)' }}>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', height: '50vh' }}>
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px 24px', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontWeight: '600' }}>Failed to load charging stations</p>
                    <p style={{ margin: '8px 0 0', fontSize: '0.85rem', opacity: 0.8 }}>{error}</p>
                </div>
                <button className="btn btn-primary" onClick={fetchStations} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={16} /> Retry
                </button>
            </div>
        );
    }

    // ── Main Render ──────────────────────────────────────────────────────────
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>

            {/* Header */}
            <div className="card" style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>Charging Locations</h3>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Total: <b>{stations.length}</b> Stations
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-secondary" onClick={fetchStations} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RefreshCw size={16} /> Refresh
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={openAddModal}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                        >
                            <Plus size={20} /> Add New Station
                        </button>
                    </div>
                </div>
            </div>

            {/* Station Cards */}
            {stations.length === 0 ? (
                <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Zap size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <p style={{ margin: 0, fontSize: '1rem' }}>No charging stations found.</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>Click "Add New Station" to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2">
                    {stations.map(station => (
                        <div key={station.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Card Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ background: '#e0e7ff', padding: '10px', borderRadius: '10px', color: 'var(--primary)', flexShrink: 0 }}>
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0 }}>{station.name}</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                            <MapPin size={12} /> {station.address}
                                        </p>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '3px 10px', borderRadius: '12px', background: '#d1fae5', color: '#065f46', whiteSpace: 'nowrap' }}>
                                    Active
                                </span>
                            </div>

                            {/* Stats Row */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {station.price && (
                                    <div style={{ flex: 1, minWidth: '80px', background: 'var(--bg-main)', padding: '10px 12px', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Price / kWh</p>
                                        <p style={{ fontWeight: '700', fontSize: '0.95rem', margin: 0 }}>{Number(station.price).toLocaleString()} MMK</p>
                                    </div>
                                )}
                                {station.chargingType && (
                                    <div style={{ flex: 1, minWidth: '80px', background: 'var(--bg-main)', padding: '10px 12px', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Type</p>
                                        <p style={{ fontWeight: '700', fontSize: '0.9rem', margin: 0 }}>{station.chargingType}</p>
                                    </div>
                                )}
                                {station.openTime && (
                                    <div style={{ flex: 1, minWidth: '80px', background: 'var(--bg-main)', padding: '10px 12px', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Open Time</p>
                                        <p style={{ fontWeight: '700', fontSize: '0.9rem', margin: 0 }}>{station.openTime}</p>
                                    </div>
                                )}
                            </div>

                            {/* Extra Info */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {station.phoneNumber && (
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Phone size={12} /> {station.phoneNumber}
                                    </p>
                                )}
                                {station.direction && (
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Navigation size={12} /> {station.direction}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => openEditModal(station)}
                                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                                >
                                    <Edit size={16} /> Edit
                                </button>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => handleDelete(station.id)}
                                    disabled={deletingId === station.id}
                                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: deletingId === station.id ? 'not-allowed' : 'pointer', color: 'var(--danger)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                                >
                                    {deletingId === station.id
                                        ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                        : <><Trash2 size={16} /> Delete</>
                                    }
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add / Edit Modal */}
            {isModalOpen && (
                <div
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}
                    onClick={closeModal}
                >
                    <div
                        className="card"
                        style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>{editingStation ? 'Edit Station' : 'Add New Station'}</h3>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                <X size={24} color="var(--text-muted)" />
                            </button>
                        </div>

                        {/* Submit Error */}
                        {submitError && (
                            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem' }}>
                                {submitError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Name */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Station Name *</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Junction City EV Hub"
                                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem' }}
                                />
                            </div>

                            {/* Address */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Address *</label>
                                <input
                                    name="address"
                                    type="text"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="e.g. Bogyoke Aung San Rd, Yangon"
                                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem' }}
                                />
                            </div>

                            {/* Charging Type & Price */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Charging Type *</label>
                                    <input
                                        name="chargingType"
                                        type="text"
                                        required
                                        value={formData.chargingType}
                                        onChange={handleChange}
                                        placeholder="e.g. DC Fast, AC Type 2"
                                        style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Price / kWh (MMK) *</label>
                                    <input
                                        name="price"
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="500"
                                        style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem' }}
                                    />
                                </div>
                            </div>

                            {/* Open Time & Phone */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Open Time</label>
                                    <input
                                        name="openTime"
                                        type="text"
                                        value={formData.openTime}
                                        onChange={handleChange}
                                        placeholder="e.g. 08:00 – 22:00"
                                        style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Phone Number</label>
                                    <input
                                        name="phoneNumber"
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="e.g. 09-123456789"
                                        style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem' }}
                                    />
                                </div>
                            </div>

                            {/* Direction */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Direction / Landmark</label>
                                <input
                                    name="direction"
                                    type="text"
                                    value={formData.direction}
                                    onChange={handleChange}
                                    placeholder="e.g. Near Sule Pagoda, B2 basement"
                                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem' }}
                                />
                            </div>

                            {/* Footer Buttons */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', minWidth: '130px', justifyContent: 'center' }}
                                >
                                    {isSubmitting
                                        ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                        : (editingStation ? 'Update Station' : 'Create Station')
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EVCharging;
