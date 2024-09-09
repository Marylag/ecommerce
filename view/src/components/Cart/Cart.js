import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import './cart.css';

const stripePromise = loadStripe('pk_test_51PqEeRRquqDGB88tyT5OYV2eEtAbE2KLHDElsZE1AbsOhevU9dL1NkZwDYf17TdEt7nSfIZyGwDsJXzxLhbvoiLj00YRHL9Xnz');

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('User not authenticated');
                    return;
                }

                const response = await axios.get('http://localhost:5000/cart', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCartItems(response.data);
            } catch (err) {
                console.error('Error fetching cart items:', err);
                setError('Failed to fetch cart items.');
            }
        };

        fetchCartItems();
    }, []);

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0) * 100; // Total in cents
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('User not authenticated');
                return;
            }

            // Send DELETE request to remove the item from the cart
            await axios.delete(`http://localhost:5000/cart/items/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Update cartItems state to remove the deleted item from the list
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (err) {
            console.error('Error removing item from cart:', err);
            setError('Failed to remove item from cart.');
        }
    };

    const handleCheckout = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('User not authenticated');
            return;
        }

        try {
            // Send cart items to backend to create payment intent
            const response = await axios.post('http://localhost:5000/cart/checkout', { cartItems }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Set the client secret from the payment intent
            setClientSecret(response.data.clientSecret);
        } catch (error) {
            console.error('Checkout error:', error);
            setError('Failed to create payment intent.');
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        // Confirm the payment with Stripe
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (error) {
            console.error('Payment error:', error);
            setError('Payment failed.');
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            // Send the paymentIntentId and cartItems to the backend to complete the order
            const token = localStorage.getItem('token');
            try {
                await axios.post('http://localhost:5000/cart/order', {
                    paymentIntentId: paymentIntent.id,
                    cartItems
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                alert('Payment successful!');
                navigate('/orders'); // Use React Router's navigate to move to the orders page
            } catch (err) {
                console.error('Error completing payment:', err);
                setError('Error completing payment.');
            }
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {cartItems.length > 0 ? (
                <ul className="cart-items">
                    {cartItems.map(item => (
                        <li key={item.id} className="cart-item">
                            <img src={item.image_url} alt={item.product_name} className="cart-item-image" />
                            <div className="cart-item-info">
                                <h4>{item.product_name}</h4>
                                <p>Price: ${parseFloat(item.price).toFixed(2)}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Total: ${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your cart is empty.</p>
            )}
            {cartItems.length > 0 && (
                <div className="cart-total">
                    <h3>Total Price: ${(calculateTotal() / 100).toFixed(2)}</h3>
                    <button onClick={handleCheckout}>Proceed to Checkout</button>

                    {clientSecret && (
                        <form onSubmit={handlePaymentSubmit}>
                            <CardElement />
                            <button type="submit" disabled={!stripe}>
                                Pay
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default function CartWithStripe() {
    return (
        <Elements stripe={stripePromise}>
            <Cart />
        </Elements>
    );
};
