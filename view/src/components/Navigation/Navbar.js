import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from '../Logout/LogoutButton';
import { UserContext } from '../../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './navBar.css';

function Navbar() {
    const { user } = useContext(UserContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control mobile menu visibility

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <NavLink to="/" end>
                    <img src="/logo192.png" alt="ChocoCharm Logo" className="logo" />
                </NavLink>
            </div>

            {/* Hamburger menu */}
            <div className="hamburger" onClick={toggleMenu}>
                <div className={isMenuOpen ? 'line open' : 'line'}></div>
                <div className={isMenuOpen ? 'line open' : 'line'}></div>
                <div className={isMenuOpen ? 'line open' : 'line'}></div>
            </div>

            <ul className={isMenuOpen ? 'menu active' : 'menu'}>
                <li><NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink></li>
                <li><NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')}>Shop</NavLink></li>
                <li><NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About</NavLink></li>
                <li><NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>Contact</NavLink></li>
                {user ? (
                    <li><LogoutButton /></li>
                ) : (
                    <li><NavLink to="/login"><FontAwesomeIcon icon={faUser} /></NavLink></li>
                )}
                <li><NavLink to="/cart"><FontAwesomeIcon icon={faShoppingCart} /></NavLink></li>
            </ul>
        </nav>
    );
}

export default Navbar;
