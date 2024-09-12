import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../../pages/Products/ProductList';
import './home.css';

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            navigate('/protected');
        }
    }, [navigate]);

    return (
        <div className="home">
            {/* Hero Section */}
            <div className="hero">
                {/* Replace the video with a high-quality image if you prefer */}
                <video autoPlay loop muted className="hero-video">
                <source src={require('../../videos/chocolate-promo.mp4')} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="hero-content">
                    <h1>Welcome to ChocoCharm</h1>
                    <p>Indulge in the finest handcrafted chocolates, made with love and passion.</p>
                    <button onClick={() => navigate('/products')} className="cta-button">Shop Now</button>
                </div>
            </div>

            {/* Featured Products */}
            <section className="featured-section">
                <h2>Featured Products</h2>
                <ProductList /> {/* You can modify the ProductList to show only featured products */}
            </section>

            {/* Testimonials */}
            <section className="testimonials">
                <h2>What Our Customers Are Saying</h2>
                <div className="testimonial">
                    <p>"The best chocolates I've ever tasted! The flavors are unique and absolutely delicious."</p>
                    <cite>— Sarah J.</cite>
                </div>
                <div className="testimonial">
                    <p>"Every order I've placed has been perfect. The quality and packaging are always top-notch!"</p>
                    <cite>— Mark L.</cite>
                </div>
            </section>
        </div>
    );
}

export default Home;
