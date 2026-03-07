import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, Edit, Trash2, Navigation, Loader2, X } from 'lucide-react';
import { getAccessToken } from '../services/authService';

const initialParking = [
    { id: 1, name: 'Sule Square Parking', address: 'Sule Pagoda Rd, Yangon', coords: '16.7761° N, 96.1585° E', totalSlots: 200, price: 1000, available: 45, status: 'Active' },
    { id: 2, name: 'Times City Mall Parking', address: 'Kyimyindaing Rd, Yangon', coords: '16.8045° N, 96.1312° E', totalSlots: 500, price: 1500, available: 120, status: 'Active' },
    { id: 3, name: 'Central Boulevard Tower', address: 'Kaba Aye Pagoda Rd, Yangon', coords: '16.8321° N, 96.1578° E', totalSlots: 150, price: 2000, available: 12, status: 'Full' },
    { id: 4, name: 'City Loft Shopping Centre', address: 'Botahtaung Pagoda Rd, Yangon', coords: '16.7723° N, 96.1714° E', totalSlots: 100, price: 800, available: 60, status: 'Active' },
];

const ParkingAreas = () => {
    const [parking, setParking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', address: '', price: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const fetchParkingData = async () => {
        try {
            setLoading(true);
            // 1. Get cached or fresh access token
            const accessToken = await getAccessToken();

            // 2. Fetch parking data
            const parkingResponse = await fetch('/service/Bill_Payments__copay/0.0.1/parking_fetch', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': accessToken
                }
            });

            if (!parkingResponse.ok) {
                throw new Error(`Failed to fetch parking data`);
            }

            const parkingData = await parkingResponse.json();

            if (parkingData.resCode === "0" && parkingData.result && parkingData.result.data) {
                const mappedData = parkingData.result.data.map(item => ({
                    id: item.id,
                    name: item.name || 'Unnamed',
                    address: item.Bill_Payments__address__CST || 'N/A',
                    price: item.Bill_Payments__price__CST || 0,
                    coords: 'N/A', // Default mock
                    totalSlots: 0, // Default mock
                    available: 0, // Default mock
                    status: 'Active' // Default mock
                }));
                setParking(mappedData);
            } else {
                throw new Error(parkingData.resMsg || 'Failed to parse parking data');
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParkingData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // 1. Get cached or fresh access token
            const accessToken = await getAccessToken();

            // 2. Create or Update parking api
            const apiUrl = editingId
                ? '/service/Bill_Payments__copay/0.0.1/parking_update'
                : '/service/Bill_Payments__copay/0.0.1/parking_create';

            const payload = editingId ? {
                id: editingId,
                address: formData.address,
                name: formData.name,
                price: String(formData.price)
            } : {
                address: formData.address,
                name: formData.name,
                price: String(formData.price)
            };

            const apiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': accessToken
                },
                body: JSON.stringify(payload)
            });

            const data = await apiResponse.json();

            if (data.resCode === "0") {
                // Success: Close modal, reset form, and re-fetch list
                setIsAddModalOpen(false);
                setEditingId(null);
                setFormData({ name: '', address: '', price: '' });
                fetchParkingData();
            } else {
                throw new Error(data.resMsg || `Failed to ${editingId ? 'update' : 'create'} parking area`);
            }

        } catch (err) {
            console.error(`Error ${editingId ? 'updating' : 'creating'} parking:`, err);
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this parking area?')) return;
        setDeletingId(id);
        try {
            // Get cached or fresh access token
            const accessToken = await getAccessToken();

            const response = await fetch('/service/Bill_Payments__copay/0.0.1/parking_delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': accessToken
                },
                body: JSON.stringify({ id: String(id) })
            });

            const data = await response.json();

            if (data.resCode === "0") {
                fetchParkingData();
            } else {
                throw new Error(data.resMsg || 'Failed to delete parking area');
            }
        } catch (err) {
            console.error('Error deleting parking:', err);
            alert(err.message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleEditClick = (area) => {
        setEditingId(area.id);
        setFormData({
            name: area.name,
            address: area.address,
            price: area.price
        });
        setIsAddModalOpen(true);
    };

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
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '8px', margin: '24px' }}>
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header Actions */}
            <div className="card" style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <h3 style={{ margin: 0 }}>Parking Locations</h3>
                    <button
                        className="btn btn-primary"
                        onClick={() => { setEditingId(null); setFormData({ name: '', address: '', price: '' }); setIsAddModalOpen(true); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                    >
                        <Plus size={20} />
                        Add New Area
                    </button>
                </div>
            </div>

            {/* Add New Area Modal */}
            {isAddModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>Add New Parking Area</h3>
                            <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="var(--text-muted)" />
                            </button>
                        </div>

                        {submitError && (
                            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                                {submitError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                                    placeholder="Enter parking name"
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Address</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                                    placeholder="Enter address"
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Price / Hr (Ks)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                                    placeholder="Enter price per hour"
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => { setIsAddModalOpen(false); setEditingId(null); }}
                                    className="btn btn-outline"
                                    style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-primary"
                                    style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    {isSubmitting ? <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> : (editingId ? 'Update Area' : 'Create Area')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Price / Hr</p>
                                <p style={{ fontWeight: '700', fontSize: '1.25rem' }}>{area.price} Ks</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <button
                                className="btn btn-outline"
                                onClick={() => handleEditClick(area)}
                                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                <Edit size={16} /> Edit
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => handleDelete(area.id)}
                                disabled={deletingId === area.id}
                                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: deletingId === area.id ? 'not-allowed' : 'pointer', color: 'var(--danger)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                {deletingId === area.id ? <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> : <><Trash2 size={16} /> Delete</>}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParkingAreas;
