import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import './navBar.css';

function Navbar() {
    return (
        <nav className='navbar'>
            <div className="navbar-left">
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
            </div>
            <ul>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Sign Up</Link></li>
                <li><LogoutButton /></li>
            </ul>
        </nav>
    );
};

export default Navbar;
