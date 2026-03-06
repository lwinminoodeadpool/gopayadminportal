import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Package, Tag, Archive } from 'lucide-react';

const initialAccessories = [
    { id: 1, name: 'Fast Charging Cable (Type 2)', desc: '5m high-quality charging cable for all modern EVs.', price: 125000, stock: 45, category: 'Charging' },
    { id: 2, name: 'Home Wallbox Adapter', desc: 'Convert your wall socket into a safe EV charging point.', price: 85000, stock: 12, category: 'Charging' },
    { id: 3, name: 'Leather Seat Covers (Plaid)', desc: 'Premium leather covers for Tesla and similar models.', price: 350000, stock: 5, category: 'Interior' },
    { id: 4, name: 'Magnetic Phone Holder', desc: 'Secure phone holder for car dashboards.', price: 15000, stock: 120, category: 'Gadgets' },
    { id: 5, name: 'Portable Air Compressor', desc: 'Compact tire inflator with digital pressure gauge.', price: 45000, stock: 28, category: 'Tools' },
];

const Accessories = () => {
    const [items, setItems] = useState(initialAccessories);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header Actions */}
            <div className="card" style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>Product Inventory</h3>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total: <b>5</b> Items</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Low Stock: <b style={{ color: 'var(--danger)' }}>1</b></span>
                        </div>
                    </div>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                        <Plus size={20} />
                        Add Accessory
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
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--bg-main)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                                <Package size={20} />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: '600' }}>{item.name}</span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.desc.substring(0, 40)}...</span>
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '100px', height: '6px', background: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${Math.min(item.stock, 100)}%`, height: '100%', background: item.stock < 10 ? 'var(--danger)' : 'var(--success)' }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.8rem' }}>{item.stock}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${item.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                                            {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
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

export default Accessories;
