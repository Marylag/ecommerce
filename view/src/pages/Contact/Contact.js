import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import './contact.css';

function Contact() {
    return (
        <div id="contact" className="contact-section">
            <h2>Contact Us</h2>
            <p>Email: <a href="mailto:info@chococharm.com">info@chococharm.com</a></p>
            <p>Phone: <a href="tel:+18001234567">+1 (800) 123-4567</a></p>
            <p>Address: 123 Chocolate Street, Sweet City, ChocoLand</p>

            <div className="social-media">
                <h3>Follow us</h3>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faFacebook} className="social-icon" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInstagram} className="social-icon" />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faTwitter} className="social-icon" />
                </a>
            </div>
        </div>
    );
}

export default Contact;
