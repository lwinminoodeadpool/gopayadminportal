import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, X, Loader2, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { getAccessToken } from '../services/authService';

const BASE_URL = '/service/Bill_Payments__copay/0.0.1';

/**
 * Detects the MIME type from the start of a raw base64 string and
 * returns a proper data-URL. Falls back to jpeg if unknown.
 * If it already has a data-URL prefix it is returned as-is.
 */
const toImageSrc = (raw) => {
    if (!raw) return '';
    if (raw.startsWith('data:')) return raw;
    // Detect type from base64 magic bytes
    if (raw.startsWith('iVBOR')) return `data:image/png;base64,${raw}`;   // PNG
    if (raw.startsWith('UklGR')) return `data:image/webp;base64,${raw}`;  // WEBP
    if (raw.startsWith('R0lGO')) return `data:image/gif;base64,${raw}`;   // GIF
    return `data:image/jpeg;base64,${raw}`;                                // JPEG (default)
};

/**
 * Strips the data-URL prefix before sending to the API.
 * e.g. "data:image/png;base64,iVBOR..." → "iVBOR..."
 */
const stripBase64Prefix = (dataUrl) => {
    if (!dataUrl) return '';
    const idx = dataUrl.indexOf(',');
    return idx !== -1 ? dataUrl.slice(idx + 1) : dataUrl;
};

const Products = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [brokenPhotos, setBrokenPhotos] = useState(new Set()); // track failed images

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        photo: '',
        price: '',
        quantity: '',
    });

    // ── Fetch ────────────────────────────────────────────────────────────────
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = await getAccessToken();

            const res = await fetch(`${BASE_URL}/fetch_product`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': token,
                },
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch products`);

            const data = await res.json();

            if (data.resCode === '0' && data.result && data.result.data) {
                setItems(data.result.data.map(item => ({
                    id: item.id,
                    name: item.name || 'Unnamed',
                    // Convert raw base64 → data-URL so <img> can display it
                    photo: toImageSrc(item.Bill_Payments__access_photo__CST || item.photo || ''),
                    price: item.price || item.Bill_Payments__price__CST || '0',
                    // Try all common KBZPay field name variants for quantity
                    quantity: item.quantity
                        || item.Bill_Payments__quantity__CST
                        || item.qty
                        || '0',
                    overview: item.Bill_Payments__access_overview__CST || item.overview || '',
                })));
            } else {
                throw new Error(data.resMsg || 'Failed to load products');
            }
        } catch (err) {
            console.error('[Products] Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    // ── Helpers ──────────────────────────────────────────────────────────────
    const openAddModal = () => {
        setEditingItem(null);
        setFormData({ name: '', photo: '', price: '', quantity: '', overview: '' });
        setSubmitError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            photo: item.photo,
            price: item.price,
            quantity: item.quantity,
            overview: item.overview || '',
        });
        setSubmitError(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setSubmitError(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setFormData(prev => ({ ...prev, photo: reader.result }));
        reader.readAsDataURL(file);
    };

    // ── Create / Update ──────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const token = await getAccessToken();
            const isEditing = !!editingItem;

            const url = isEditing
                ? `${BASE_URL}/update_product`
                : `${BASE_URL}/create_product`;

            // Strip the data-URL prefix so only raw base64 goes to the API
            const rawPhoto = stripBase64Prefix(formData.photo);

            const payload = isEditing
                ? {
                    id: String(editingItem.id),
                    name: formData.name,
                    photo: rawPhoto,
                    price: String(formData.price),
                    quantity: String(formData.quantity),
                    overview: formData.overview,
                }
                : {
                    name: formData.name,
                    photo: rawPhoto,
                    price: String(formData.price),
                    quantity: String(formData.quantity),
                    overview: formData.overview,
                };

            console.log(`[Products] ${isEditing ? 'UPDATE' : 'CREATE'} request →`, url, payload);

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': token,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log('[Products] API response ←', data);

            // Accept both string "0" and integer 0 as success (KBZPay varies per endpoint)
            const isSuccess = data.resCode === '0' || data.resCode === 0 || data.resCode === '00';

            if (isSuccess) {
                closeModal();
                fetchProducts();
            } else {
                throw new Error(data.resMsg || `Failed to ${isEditing ? 'update' : 'create'} product (resCode: ${data.resCode})`);
            }
        } catch (err) {
            console.error('[Products] Submit error:', err);

            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Delete ───────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        setDeletingId(id);

        try {
            const token = await getAccessToken();

            const res = await fetch(`${BASE_URL}/delete_product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': token,
                },
                body: JSON.stringify({ id: String(id) }),
            });

            const data = await res.json();

            if (data.resCode === '0') {
                fetchProducts();
            } else {
                throw new Error(data.resMsg || 'Failed to delete product');
            }
        } catch (err) {
            console.error('[Products] Delete error:', err);
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
                    <p style={{ margin: 0, fontWeight: '600' }}>Failed to load products</p>
                    <p style={{ margin: '8px 0 0', fontSize: '0.85rem', opacity: 0.8 }}>{error}</p>
                </div>
                <button className="btn btn-primary" onClick={fetchProducts} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                        <h3 style={{ margin: 0 }}>Product Inventory</h3>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Total: <b>{items.length}</b> Items
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-secondary" onClick={fetchProducts} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RefreshCw size={16} /> Refresh
                        </button>
                        <button className="btn btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Plus size={20} /> Add Product
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Cards Grid */}
            {items.length === 0 ? (
                <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Package size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <p style={{ margin: 0, fontSize: '1rem' }}>No products found.</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>Click "Add Product" to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                    {items.map(item => (
                        <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                            {/* Photo Area */}
                            <div style={{
                                width: '100%',
                                height: '200px',
                                background: 'var(--bg-main)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                flexShrink: 0,
                            }}>
                                {item.photo && !brokenPhotos.has(item.id) ? (
                                    <img
                                        src={item.photo}
                                        alt={item.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={() => setBrokenPhotos(prev => new Set(prev).add(item.id))}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                        <Package size={40} style={{ opacity: 0.3 }} />
                                        <span style={{ fontSize: '0.75rem' }}>No photo</span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                                <div>
                                    <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                                    <p style={{ margin: '4px 0 0', fontWeight: '600', color: 'var(--primary)', fontSize: '0.9rem' }}>{Number(item.price).toLocaleString()} MMK</p>
                                </div>

                                <span style={{
                                    alignSelf: 'flex-start',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    padding: '3px 10px',
                                    borderRadius: '12px',
                                    background: Number(item.quantity) === 0 ? '#fee2e2' : Number(item.quantity) < 10 ? '#fef3c7' : '#d1fae5',
                                    color: Number(item.quantity) === 0 ? '#dc2626' : Number(item.quantity) < 10 ? '#92400e' : '#065f46',
                                }}>
                                    {Number(item.quantity) === 0 ? 'Out of Stock' : `${item.quantity} pcs`}
                                </span>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                    <button
                                        onClick={() => openEditModal(item)}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                                    >
                                        <Edit size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        disabled={deletingId === item.id}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: deletingId === item.id ? 'not-allowed' : 'pointer', color: 'var(--danger)', fontWeight: '600', fontSize: '0.8rem' }}
                                    >
                                        {deletingId === item.id
                                            ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                            : <><Trash2 size={14} /> Delete</>
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add / Edit Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>{editingItem ? 'Edit Product' : 'Add New Product'}</h3>
                            <button className="icon-btn-sm" onClick={closeModal} style={{ border: 'none' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Submit Error */}
                        {submitError && (
                            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem' }}>
                                {submitError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Product Name */}
                            <div className="form-group">
                                <label className="form-label">Product Name</label>
                                <input
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Car Phone Holder"
                                    required
                                />
                            </div>

                            {/* Price & Quantity */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Price (MMK)</label>
                                    <input
                                        name="price"
                                        type="number"
                                        className="form-control"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="15000"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        name="quantity"
                                        type="number"
                                        className="form-control"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        placeholder="50"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Photo Upload */}
                            <div className="form-group">
                                <label className="form-label">Product Photo</label>
                                <div
                                    style={{
                                        border: '2px dashed var(--border)',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        textAlign: 'center',
                                        background: 'var(--bg-main)',
                                        cursor: 'pointer',
                                        position: 'relative',
                                    }}
                                    onClick={() => document.getElementById('photoUpload').click()}
                                >
                                    {formData.photo ? (
                                        <div style={{ position: 'relative', width: '100%', height: '140px' }}>
                                            <img
                                                src={formData.photo}
                                                alt="Preview"
                                                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
                                            />
                                            <div
                                                style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,255,255,0.8)', padding: '4px', borderRadius: '50%', display: 'flex', cursor: 'pointer' }}
                                                onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, photo: '' })); }}
                                            >
                                                <X size={16} color="var(--danger)" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ padding: '20px 0', color: 'var(--text-muted)' }}>
                                            <ImageIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                                            <p style={{ fontSize: '0.875rem', margin: 0 }}>Click to upload product photo</p>
                                            <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>PNG, JPG up to 5MB</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="photoUpload"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            </div>

                            {/* Overview */}
                            <div className="form-group">
                                <label className="form-label">Overview</label>
                                <textarea
                                    name="overview"
                                    className="form-control"
                                    value={formData.overview}
                                    onChange={handleChange}
                                    placeholder="Brief product description or overview..."
                                    rows={3}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px', justifyContent: 'center' }}
                                >
                                    {isSubmitting
                                        ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                        : (editingItem ? 'Update Product' : 'Add Product')
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

export default Products;
