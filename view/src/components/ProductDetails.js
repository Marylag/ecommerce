import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './productDetails.css';

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductsDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/products/${id}`);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load product details');
                setLoading(false);
            }
        };

        fetchProductsDetails();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            await axios.post('http://localhost:5000/cart', { productId: id });
            alert('Product added to cart!');
        } catch (err) {
            alert('Failed to add product to cart.');
        }
    };

    if (loading) return <p>Loading product details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='product-details'>
            <img src={product.image_url} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
    );
}

export default ProductDetails;