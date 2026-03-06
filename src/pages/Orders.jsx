import React, { useState } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    Truck,
    CheckCircle,
    XCircle,
    Package,
    ArrowUpDown
} from 'lucide-react';

const initialOrders = [
    {
        id: 'ORD-1284',
        customer: 'Aye Aye',
        product: 'Fast Charging Cable',
        amount: 125000,
        paymentStatus: 'Paid',
        deliveryStatus: 'Pending',
        date: '2024-03-06'
    },
    {
        id: 'ORD-1285',
        customer: 'Kyaw Kyaw',
        product: 'Magnetic Phone Holder',
        amount: 15000,
        paymentStatus: 'Paid',
        deliveryStatus: 'Shipped',
        date: '2024-03-05'
    },
    {
        id: 'ORD-1286',
        customer: 'Su Su',
        product: 'Leather Seat Covers',
        amount: 350000,
        paymentStatus: 'Pending',
        deliveryStatus: 'Not Shipped',
        date: '2024-03-05'
    },
    {
        id: 'ORD-1287',
        customer: 'Htet Htet',
        product: 'Portable Air Compressor',
        amount: 45000,
        paymentStatus: 'Paid',
        deliveryStatus: 'Delivered',
        date: '2024-03-04'
    },
    {
        id: 'ORD-1288',
        customer: 'Zayar',
        product: 'Home Wallbox Adapter',
        amount: 85000,
        paymentStatus: 'Refunded',
        deliveryStatus: 'Cancelled',
        date: '2024-03-03'
    }
];

const OrderManagement = () => {
    const [orders, setOrders] = useState(initialOrders);
    const [searchTerm, setSearchTerm] = useState('');

    const handleStatusChange = (orderId, type, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, [type]: newStatus } : order
        ));
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Paid': case 'Delivered': return { bg: '#d1fae5', text: '#065f46' };
            case 'Pending': case 'Shipped': return { bg: '#fef3c7', text: '#92400e' };
            case 'Cancelled': case 'Refunded': return { bg: '#fee2e2', text: '#991b1b' };
            default: return { bg: '#f1f5f9', text: '#475569' };
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Filters */}
            <div className="card" style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                className="form-control"
                                style={{ paddingLeft: '40px' }}
                                placeholder="Search by Order ID or Customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-secondary" style={{ display: 'flex', gap: '8px' }}>
                            <Filter size={18} /> Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Delivery</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders
                                .filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(order => (
                                    <tr key={order.id}>
                                        <td>
                                            <span style={{ fontWeight: '600', color: 'var(--primary)' }}>#{order.id}</span>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.date}</div>
                                        </td>
                                        <td style={{ fontWeight: '500' }}>{order.customer}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Package size={16} color="var(--text-muted)" />
                                                {order.product}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: '600' }}>{order.amount.toLocaleString()} MMK</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                background: getStatusStyle(order.paymentStatus).bg,
                                                color: getStatusStyle(order.paymentStatus).text
                                            }}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                background: getStatusStyle(order.deliveryStatus).bg,
                                                color: getStatusStyle(order.deliveryStatus).text
                                            }}>
                                                {order.deliveryStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    className="icon-btn-sm"
                                                    title="Confirm Order"
                                                    onClick={() => handleStatusChange(order.id, 'paymentStatus', 'Paid')}
                                                    style={{ color: 'var(--success)' }}
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                                <button
                                                    className="icon-btn-sm"
                                                    title="Update Delivery"
                                                    onClick={() => {
                                                        const statuses = ['Pending', 'Shipped', 'Delivered'];
                                                        const currentIndex = statuses.indexOf(order.deliveryStatus);
                                                        const nextIndex = (currentIndex + 1) % statuses.length;
                                                        handleStatusChange(order.id, 'deliveryStatus', statuses[nextIndex]);
                                                    }}
                                                >
                                                    <Truck size={16} />
                                                </button>
                                                <button
                                                    className="icon-btn-sm"
                                                    title="Cancel Order"
                                                    onClick={() => {
                                                        if (window.confirm('Cancel this order?')) {
                                                            handleStatusChange(order.id, 'deliveryStatus', 'Cancelled');
                                                        }
                                                    }}
                                                    style={{ color: 'var(--danger)' }}
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
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

export default OrderManagement;
