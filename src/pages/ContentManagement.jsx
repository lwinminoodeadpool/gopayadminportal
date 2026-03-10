import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Image as ImageIcon,
    Link as LinkIcon,
    X,
    Layout,
    Megaphone,
    Loader2
} from 'lucide-react';
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
    if (raw.startsWith('iVBOR')) return `data:image/png;base64,${raw}`;
    if (raw.startsWith('UklGR')) return `data:image/webp;base64,${raw}`;
    if (raw.startsWith('R0lGO')) return `data:image/gif;base64,${raw}`;
    return `data:image/jpeg;base64,${raw}`;
};

/**
 * Strips the data-URL prefix before sending to the API.
 */
const stripBase64Prefix = (dataUrl) => {
    if (!dataUrl) return '';
    const idx = dataUrl.indexOf(',');
    return idx !== -1 ? dataUrl.slice(idx + 1) : dataUrl;
};

const initialPromotions = [
    { id: 1, title: '10% Off EV Charging', desc: 'Valid until end of March for all registered users.', code: 'EVCHARGER10', status: 'Active' },
    { id: 2, title: 'Free Car Polish', desc: 'Get free polish with any seating cover purchase.', code: 'POLISHFREE', status: 'Expired' },
];

const ContentManagement = () => {
    // ── Banners State ────────────────────────────────────────────────────────
    const [banners, setBanners] = useState([]);
    const [loadingBanners, setLoadingBanners] = useState(true);
    const [bannersError, setBannersError] = useState(null);
    const [brokenPhotos, setBrokenPhotos] = useState(new Set());

    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [isSubmittingBanner, setIsSubmittingBanner] = useState(false);
    const [bannerSubmitError, setBannerSubmitError] = useState(null);
    const [deletingBannerId, setDeletingBannerId] = useState(null);

    const [bannerFormData, setBannerFormData] = useState({ name: '', redirectLink: '', imageBase64: '', status: 'Active' });

    // ── Promotions State ─────────────────────────────────────────────────────
    const [promotions, setPromotions] = useState(initialPromotions);
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);
    const [promoFormData, setPromoFormData] = useState({ title: '', desc: '', code: '', status: 'Active' });

    // ── Banner API Integration ───────────────────────────────────────────────
    const fetchBanners = async () => {
        try {
            setLoadingBanners(true);
            setBannersError(null);
            const token = await getAccessToken();

            const res = await fetch(`${BASE_URL}/banner_fetch`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': token,
                },
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch banners`);

            const data = await res.json();

            if (data.resCode === '0' && data.result && data.result.data) {
                if (data.result.data.length > 0) {
                    console.log('[Banners] Raw API item sample:', data.result.data[0]);
                }
                setBanners(data.result.data.map(item => ({
                    id: item.id,
                    name: item.name || item.Bill_Payments__name__CST || item.title || 'Unnamed',
                    redirectLink: item.Bill_Payments__redirect_link__CST || item.redirectLink || item.link || '',
                    imageBase64: toImageSrc(item.Bill_Payments__banner_image__CST || item.imageBase64 || item.image || item.photo || ''),
                    status: item.Bill_Payments__status__CST || item.status || 'Active',
                })));
            } else {
                throw new Error(data.resMsg || 'Failed to load banners');
            }
        } catch (err) {
            console.error('[Banners] Fetch error:', err);
            setBannersError(err.message);
        } finally {
            setLoadingBanners(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleOpenBannerModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setBannerFormData({
                name: banner.name,
                redirectLink: banner.redirectLink,
                imageBase64: banner.imageBase64, // could be full data URL, we strip it on submit
                status: banner.status,
            });
        } else {
            setEditingBanner(null);
            setBannerFormData({ name: '', redirectLink: '', imageBase64: '', status: 'Active' });
        }
        setBannerSubmitError(null);
        setIsBannerModalOpen(true);
    };

    const handleBannerImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setBannerFormData(prev => ({ ...prev, imageBase64: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleBannerSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingBanner(true);
        setBannerSubmitError(null);

        try {
            const token = await getAccessToken();
            const isEditing = !!editingBanner;

            const url = isEditing
                ? `${BASE_URL}/banner_update`
                : `${BASE_URL}/banner_create`;

            const rawPhoto = stripBase64Prefix(bannerFormData.imageBase64);

            const payload = isEditing
                ? {
                    id: String(editingBanner.id),
                    name: bannerFormData.name,
                    Bill_Payments__redirect_link__CST: bannerFormData.redirectLink,
                    Bill_Payments__banner_image__CST: rawPhoto,
                    Bill_Payments__status__CST: bannerFormData.status,
                }
                : {
                    name: bannerFormData.name,
                    Bill_Payments__redirect_link__CST: bannerFormData.redirectLink,
                    Bill_Payments__banner_image__CST: rawPhoto,
                    Bill_Payments__status__CST: bannerFormData.status,
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
            const isSuccess = data.resCode === '0' || data.resCode === 0 || data.resCode === '00';

            if (isSuccess) {
                setIsBannerModalOpen(false);
                fetchBanners();
            } else {
                throw new Error(data.resMsg || `Failed to ${isEditing ? 'update' : 'create'} banner (resCode: ${data.resCode})`);
            }
        } catch (err) {
            console.error('[Banners] Submit error:', err);
            setBannerSubmitError(err.message);
        } finally {
            setIsSubmittingBanner(false);
        }
    };

    const handleDeleteBanner = async (id) => {
        if (!window.confirm('Are you sure you want to delete this banner?')) return;
        setDeletingBannerId(id);

        try {
            const token = await getAccessToken();
            const res = await fetch(`${BASE_URL}/banner_delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': token,
                },
                body: JSON.stringify({ id: String(id) }),
            });

            const data = await res.json();
            const isSuccess = data.resCode === '0' || data.resCode === 0 || data.resCode === '00';

            if (isSuccess) {
                fetchBanners();
            } else {
                throw new Error(data.resMsg || 'Failed to delete banner');
            }
        } catch (err) {
            console.error('[Banners] Delete error:', err);
            alert(`Error deleting banner: ${err.message}`);
        } finally {
            setDeletingBannerId(null);
        }
    };

    // ── Promotion Handlers (Unchanged Mock Logic) ────────────────────────────
    const handleOpenPromoModal = (promo = null) => {
        if (promo) {
            setEditingPromo(promo);
            setPromoFormData({ ...promo });
        } else {
            setEditingPromo(null);
            setPromoFormData({ title: '', desc: '', code: '', status: 'Active' });
        }
        setIsPromoModalOpen(true);
    };

    const handlePromoSubmit = (e) => {
        e.preventDefault();
        if (editingPromo) {
            setPromotions(promotions.map(p => p.id === editingPromo.id ? { ...promoFormData, id: p.id } : p));
        } else {
            setPromotions([...promotions, { ...promoFormData, id: Date.now() }]);
        }
        setIsPromoModalOpen(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Banners Section */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Layout size={24} color="var(--primary)" />
                        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Home Page Banners</h2>
                    </div>
                    <button className="btn btn-primary" onClick={() => handleOpenBannerModal()}>
                        <Plus size={20} /> Add Banner
                    </button>
                </div>

                {bannersError && (
                    <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                        {bannersError}
                    </div>
                )}

                {loadingBanners ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                        <p>Loading banners...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2">
                        {banners.length === 0 && !bannersError ? (
                            <div className="card" style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <Layout size={40} style={{ opacity: 0.3, marginBottom: '12px', display: 'inline-block' }} />
                                <p style={{ margin: 0 }}>No banners found. Add one to get started.</p>
                            </div>
                        ) : (
                            banners.map(banner => (
                                <div key={banner.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                    <div style={{ height: '160px', width: '100%', position: 'relative', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {banner.imageBase64 && !brokenPhotos.has(banner.id) ? (
                                            <img
                                                src={banner.imageBase64}
                                                alt={banner.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={() => setBrokenPhotos(prev => new Set(prev).add(banner.id))}
                                            />
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                                                <ImageIcon size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                                                <span style={{ fontSize: '0.8rem' }}>No image</span>
                                            </div>
                                        )}
                                        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                                            <button className="icon-btn-sm" onClick={() => handleOpenBannerModal(banner)} style={{ background: 'white' }} title="Edit"><Edit size={16} /></button>
                                            <button className="icon-btn-sm" onClick={() => handleDeleteBanner(banner.id)} disabled={deletingBannerId === banner.id} style={{ background: 'white', color: 'var(--danger)' }} title="Delete">
                                                {deletingBannerId === banner.id ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={16} />}
                                            </button>
                                        </div>
                                        <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                                            <span className={`badge ${banner.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                                                {banner.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ padding: '16px' }}>
                                        <h4 style={{ margin: '0 0 4px 0' }}>{banner.name}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <LinkIcon size={14} /> Link: {banner.redirectLink}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </section>

            {/* Promotions Section */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Megaphone size={24} color="var(--primary)" />
                        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Active Promotions</h2>
                    </div>
                    <button className="btn btn-primary" onClick={() => handleOpenPromoModal()}>
                        <Plus size={20} /> Add Promotion
                    </button>
                </div>

                <div className="card">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Promotion Details</th>
                                    <th>Promo Code</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {promotions.map(promo => (
                                    <tr key={promo.id}>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 600 }}>{promo.title}</span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{promo.desc}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <code style={{ background: 'var(--bg-main)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', color: 'var(--primary)' }}>
                                                {promo.code}
                                            </code>
                                        </td>
                                        <td>
                                            <span className={`badge ${promo.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                                                {promo.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="icon-btn-sm" onClick={() => handleOpenPromoModal(promo)}><Edit size={16} /></button>
                                                <button className="icon-btn-sm" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Banner Modal */}
            {isBannerModalOpen && (
                <div className="modal-overlay" onClick={() => setIsBannerModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h3>
                            <button className="icon-btn-sm" onClick={() => setIsBannerModalOpen(false)} style={{ border: 'none' }}><X size={20} /></button>
                        </div>

                        {bannerSubmitError && (
                            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem' }}>
                                {bannerSubmitError}
                            </div>
                        )}

                        <form onSubmit={handleBannerSubmit}>
                            <div className="form-group">
                                <label className="form-label">Banner Name</label>
                                <input
                                    className="form-control"
                                    value={bannerFormData.name}
                                    onChange={e => setBannerFormData({ ...bannerFormData, name: e.target.value })}
                                    placeholder="e.g. Flash Sale"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Redirect Link</label>
                                <input
                                    className="form-control"
                                    value={bannerFormData.redirectLink}
                                    onChange={e => setBannerFormData({ ...bannerFormData, redirectLink: e.target.value })}
                                    placeholder="e.g. /charging"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Banner Image</label>
                                <div
                                    style={{ border: '2px dashed var(--border)', borderRadius: '12px', padding: '20px', textAlign: 'center', background: 'var(--bg-main)', cursor: 'pointer' }}
                                    onClick={() => document.getElementById('bannerUpload').click()}
                                >
                                    {bannerFormData.imageBase64 ? (
                                        <img src={bannerFormData.imageBase64} style={{ width: '100%', height: '120px', objectFit: 'contain', borderRadius: '8px' }} alt="Preview" />
                                    ) : (
                                        <div>
                                            <ImageIcon size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                                            <p style={{ fontSize: '0.875rem', margin: 0 }}>Click to upload banner</p>
                                        </div>
                                    )}
                                    <input type="file" id="bannerUpload" hidden accept="image/*" onChange={handleBannerImageUpload} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-control" value={bannerFormData.status} onChange={e => setBannerFormData({ ...bannerFormData, status: e.target.value })}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                                <button type="button" className="btn btn-secondary" disabled={isSubmittingBanner} onClick={() => setIsBannerModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmittingBanner} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {isSubmittingBanner ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                                    {editingBanner ? 'Update Banner' : 'Add Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Promo Modal */}
            {isPromoModalOpen && (
                <div className="modal-overlay" onClick={() => setIsPromoModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>{editingPromo ? 'Edit Promotion' : 'Add Promotion'}</h3>
                            <button className="icon-btn-sm" onClick={() => setIsPromoModalOpen(false)} style={{ border: 'none' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handlePromoSubmit}>
                            <div className="form-group">
                                <label className="form-label">Promotion Title</label>
                                <input className="form-control" value={promoFormData.title} onChange={e => setPromoFormData({ ...promoFormData, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" value={promoFormData.desc} onChange={e => setPromoFormData({ ...promoFormData, desc: e.target.value })} rows={2} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Promo Code</label>
                                <input className="form-control" value={promoFormData.code} onChange={e => setPromoFormData({ ...promoFormData, code: e.target.value.toUpperCase() })} placeholder="SAVE10" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-control" value={promoFormData.status} onChange={e => setPromoFormData({ ...promoFormData, status: e.target.value })}>
                                    <option value="Active">Active</option>
                                    <option value="Expired">Expired</option>
                                    <option value="Upcoming">Upcoming</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsPromoModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Promotion</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentManagement;
