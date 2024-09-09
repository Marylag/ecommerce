import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductList from './ProductList';
import './productDetails.css';

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/products/${id}`);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load product details');
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleQuantityChange = (e) => {
        setQuantity(Number(e.target.value));
    };

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to add items to your cart.');
            return;
        }

        try {
            console.log('Adding product to cart:', { productId: id, quantity });
            setIsAddingToCart(true);

            const response = await axios.post(
                'http://localhost:5000/cart/items',
                { productId: id, quantity: quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            console.log('Add to cart response:', response.data);
            alert('Product added to cart!');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                alert('Unauthorized: Please log in to add items to your cart.');
            } else if (err.response && err.response.status === 403) {
                alert('Forbidden: You do not have permission to add items to the cart.');
            } else {
                alert('Failed to add product to cart.');
            }
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (loading) return <p>Loading product details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="product-details-container">
            <div className="product-details">
                {/* Left Section: Product Image */}
                <img src={product.image_url} alt={product.name} className="product-image" />
                
                {/* Right Section: Product Information */}
                <div className="product-info">
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p className="price">Price: ${product.price}</p>
                    <div className="quantity-container">
                        <label htmlFor="quantity">Quantity: </label>
                        <input 
                            type="number" 
                            id="quantity" 
                            name="quantity" 
                            value={quantity} 
                            onChange={handleQuantityChange} 
                            min="1" 
                            max={product.quantity || 99}
                        />
                    </div>
                    <button onClick={handleAddToCart} disabled={isAddingToCart}>
                        {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                    </button>
                </div>
            </div>

            {/* Product List at the bottom */}
            <div className="related-products">
                <h3>Related Products</h3>
                <ProductList />
            </div>
        </div>
    );
}

export default ProductDetails;
