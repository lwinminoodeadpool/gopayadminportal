import React, { useState } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Image as ImageIcon,
    Link as LinkIcon,
    X,
    ExternalLink,
    Layout,
    Megaphone
} from 'lucide-react';

const initialBanners = [
    { id: 1, title: 'EV Charging Discount', link: '/charging', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80', status: 'Active' },
    { id: 2, title: 'Summer Car Accessories Sale', link: '/accessories', image: 'https://images.unsplash.com/photo-1586105251261-72a75661d871?w=800&q=80', status: 'Active' },
];

const initialPromotions = [
    { id: 1, title: '10% Off EV Charging', desc: 'Valid until end of March for all registered users.', code: 'EVCHARGER10', status: 'Active' },
    { id: 2, title: 'Free Car Polish', desc: 'Get free polish with any seating cover purchase.', code: 'POLISHFREE', status: 'Expired' },
];

const ContentManagement = () => {
    const [banners, setBanners] = useState(initialBanners);
    const [promotions, setPromotions] = useState(initialPromotions);

    // Modal states
    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [bannerFormData, setBannerFormData] = useState({ title: '', link: '', image: '', status: 'Active' });

    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);
    const [promoFormData, setPromoFormData] = useState({ title: '', desc: '', code: '', status: 'Active' });

    // Banner Handlers
    const handleOpenBannerModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setBannerFormData({ ...banner });
        } else {
            setEditingBanner(null);
            setBannerFormData({ title: '', link: '', image: '', status: 'Active' });
        }
        setIsBannerModalOpen(true);
    };

    const handleBannerImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setBannerFormData(prev => ({ ...prev, image: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleBannerSubmit = (e) => {
        e.preventDefault();
        if (editingBanner) {
            setBanners(banners.map(b => b.id === editingBanner.id ? { ...bannerFormData, id: b.id } : b));
        } else {
            setBanners([...banners, { ...bannerFormData, id: Date.now() }]);
        }
        setIsBannerModalOpen(false);
    };

    const handleDeleteBanner = (id) => {
        if (window.confirm('Delete this banner?')) setBanners(banners.filter(b => b.id !== id));
    };

    // Promotion Handlers
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

                <div className="grid grid-cols-2">
                    {banners.map(banner => (
                        <div key={banner.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ height: '160px', width: '100%', position: 'relative' }}>
                                <img src={banner.image} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                                    <button className="icon-btn-sm" onClick={() => handleOpenBannerModal(banner)} style={{ background: 'white' }}><Edit size={16} /></button>
                                    <button className="icon-btn-sm" onClick={() => handleDeleteBanner(banner.id)} style={{ background: 'white', color: 'var(--danger)' }}><Trash2 size={16} /></button>
                                </div>
                                <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                                    <span className={`badge ${banner.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                                        {banner.status}
                                    </span>
                                </div>
                            </div>
                            <div style={{ padding: '16px' }}>
                                <h4 style={{ margin: '0 0 4px 0' }}>{banner.title}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <LinkIcon size={14} /> Link: {banner.link}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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
                            <h3>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h3>
                            <button className="icon-btn-sm" onClick={() => setIsBannerModalOpen(false)} style={{ border: 'none' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleBannerSubmit}>
                            <div className="form-group">
                                <label className="form-label">Banner Title</label>
                                <input className="form-control" value={bannerFormData.title} onChange={e => setBannerFormData({ ...bannerFormData, title: e.target.value })} placeholder="e.g. Flash Sale" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Internal Link (Page)</label>
                                <input className="form-control" value={bannerFormData.link} onChange={e => setBannerFormData({ ...bannerFormData, link: e.target.value })} placeholder="e.g. /charging" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Banner Image</label>
                                <div style={{ border: '2px dashed var(--border)', borderRadius: '12px', padding: '20px', textAlign: 'center', background: 'var(--bg-main)', cursor: 'pointer' }} onClick={() => document.getElementById('bannerUpload').click()}>
                                    {bannerFormData.image ? (
                                        <img src={bannerFormData.image} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} alt="Preview" />
                                    ) : (
                                        <div>
                                            <ImageIcon size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                                            <p style={{ fontSize: '0.8rem', margin: 0 }}>Click to upload banner</p>
                                        </div>
                                    )}
                                    <input type="file" id="bannerUpload" hidden onChange={handleBannerImageUpload} />
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
                                <button type="button" className="btn btn-secondary" onClick={() => setIsBannerModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingBanner ? 'Update Banner' : 'Add Banner'}</button>
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
                            <h3>{editingPromo ? 'Edit Promotion' : 'Add Promotion'}</h3>
                            <button className="icon-btn-sm" onClick={() => setIsPromoModalOpen(false)} style={{ border: 'none' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handlePromoSubmit}>
                            <div className="form-group">
                                <label className="form-label">Promotion Title</label>
                                <input className="form-control" value={promoFormData.title} onChange={e => setPromoFormData({ ...promoFormData, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" value={promoFormData.desc} onChange={e => setPromoFormData({ ...promoFormData, desc: e.target.value })} rows="2" required />
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
