import React from 'react';
import { Link } from 'react-router-dom';

function Product({ product }) {
    return (
        <div className='product'>
            <Link to={`/products/${product.id}`}>
            <img src={product.image_url} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            </Link>
        </div>
    );
}

export default Product;
