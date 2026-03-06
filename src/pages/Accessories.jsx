import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Package, Tag, Image as ImageIcon, X } from 'lucide-react';

const initialAccessories = [
    { id: 1, name: 'Fast Charging Cable (Type 2)', desc: '5m high-quality charging cable for all modern EVs.', price: 125000, stock: 45, category: 'Car Accessories', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80' },
    { id: 2, name: 'Home Wallbox Adapter', desc: 'Convert your wall socket into a safe EV charging point.', price: 85000, stock: 12, category: 'Car Accessories', image: 'https://images.unsplash.com/photo-1563906267088-b0aa2f753583?w=400&q=80' },
    { id: 3, name: 'Leather Seat Covers (Plaid)', desc: 'Premium leather covers for Tesla and similar models.', price: 350000, stock: 5, category: 'Interior', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c15d?w=400&q=80' },
    { id: 4, name: 'Magnetic Phone Holder', desc: 'Secure phone holder for car dashboards.', price: 15000, stock: 120, category: 'Car Accessories', image: 'https://images.unsplash.com/photo-1586105251261-72a75661d871?w=400&q=80' },
    { id: 5, name: 'Portable Air Compressor', desc: 'Compact tire inflator with digital pressure gauge.', price: 45000, stock: 28, category: 'Tools', image: 'https://images.unsplash.com/photo-159742324403d-d19504ba2f47?w=400&q=80' },
];

const categories = ['Car Accessories', 'Interior', 'Exterior', 'Gadgets', 'Tools', 'Cleaning'];

const Accessories = () => {
    const [items, setItems] = useState(initialAccessories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Car Accessories',
        price: '',
        stock: '',
        image: '', // This will store the data URL
        desc: ''
    });

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                category: item.category,
                price: item.price.toString(),
                stock: item.stock.toString(),
                image: item.image || '',
                desc: item.desc
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                category: 'Car Accessories',
                price: '',
                stock: '',
                image: '',
                desc: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            id: editingItem ? editingItem.id : Date.now(),
            price: Number(formData.price),
            stock: Number(formData.stock)
        };

        if (editingItem) {
            setItems(items.map(item => item.id === editingItem.id ? productData : item));
        } else {
            setItems([...items, productData]);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header Actions */}
            <div className="card" style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>Product Inventory</h3>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total: <b>{items.length}</b> Items</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Low Stock: <b style={{ color: 'var(--danger)' }}>{items.filter(i => i.stock < 10).length}</b></span>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        <Plus size={20} />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Product List */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '48px', height: '48px', background: 'var(--bg-main)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <Package size={24} />
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: '600' }}>{item.name}</span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.desc}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                                            <Tag size={14} /> {item.category}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: '600' }}>{item.price.toLocaleString()} MMK</td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{
                                                    fontSize: '0.9rem',
                                                    fontWeight: '700',
                                                    color: item.stock === 0 ? 'var(--danger)' :
                                                        item.stock < 10 ? 'var(--warning)' :
                                                            'var(--text-main)'
                                                }}>
                                                    {item.stock}
                                                </span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>pcs</span>
                                            </div>
                                            {item.stock === 0 ? (
                                                <span style={{ fontSize: '0.7rem', color: 'var(--danger)', background: '#fee2e2', padding: '2px 8px', borderRadius: '12px', width: 'fit-content', fontWeight: '600' }}>
                                                    Out of Stock
                                                </span>
                                            ) : item.stock < 10 ? (
                                                <span style={{ fontSize: '0.7rem', color: '#92400e', background: '#fef3c7', padding: '2px 8px', borderRadius: '12px', width: 'fit-content', fontWeight: '600' }}>
                                                    Low Stock
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: '0.7rem', color: '#065f46', background: '#d1fae5', padding: '2px 8px', borderRadius: '12px', width: 'fit-content', fontWeight: '600' }}>
                                                    In Stock
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="icon-btn-sm" title="Edit" onClick={() => handleOpenModal(item)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="icon-btn-sm" title="Delete" onClick={() => handleDelete(item.id)} style={{ color: 'var(--danger)' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>{editingItem ? 'Edit Product' : 'Add New Product'}</h3>
                            <button className="icon-btn-sm" onClick={handleCloseModal} style={{ border: 'none' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Product Name</label>
                                <input name="name" className="form-control" value={formData.name} onChange={handleChange} placeholder="e.g. Car Phone Holder" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Price (MMK)</label>
                                    <input name="price" type="number" className="form-control" value={formData.price} onChange={handleChange} placeholder="15000" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Stock</label>
                                    <input name="stock" type="number" className="form-control" value={formData.stock} onChange={handleChange} placeholder="50" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Product Image</label>
                                <div style={{
                                    border: '2px dashed var(--border)',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    background: 'var(--bg-main)',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }} onClick={() => document.getElementById('imageUpload').click()}>
                                    {formData.image ? (
                                        <div style={{ position: 'relative', width: '100%', height: '140px' }}>
                                            <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                                            <div style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,255,255,0.8)', padding: '4px', borderRadius: '50%', display: 'flex' }} onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, image: '' })); }}>
                                                <X size={16} color="var(--danger)" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ padding: '20px 0', color: 'var(--text-muted)' }}>
                                            <ImageIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                                            <p style={{ fontSize: '0.875rem', margin: 0 }}>Click to upload product image</p>
                                            <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>PNG, JPG up to 5MB</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea name="desc" className="form-control" value={formData.desc} onChange={handleChange} placeholder="Magnetic holder..." rows="3"></textarea>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingItem ? 'Update Product' : 'Add Product'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accessories;
