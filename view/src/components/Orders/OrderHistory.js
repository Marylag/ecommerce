import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './orderHistory.css';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('User not authenticated');
                    return;
                }

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to fetch orders.');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <p>Loading order history...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="order-history-container">
            <h2>Your Order History</h2>
            {orders.length > 0 ? (
                <ul className='order-list'>
                    {orders.map(order => (
                        <li key={order.id} className="order-card">
                            <div className='order-info'>
                            <h4>Order ID: {order.id}</h4>
                            <p>Total: ${order.total_amount}</p>
                            <p>Status: {order.status}</p>
                            <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-orders">No past orders found.</p>
            )}
        </div>
    );
}

export default OrderHistory;
