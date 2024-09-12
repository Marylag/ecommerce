import React from 'react';
import { NavLink } from 'react-router-dom';

function Product({ product }) {
    return (
        <div className='product'>
            <NavLink to={`/products/${product.id}`}>
            <img src={product.image_url} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            </NavLink>
        </div>
        
    );
}

export default Product;
