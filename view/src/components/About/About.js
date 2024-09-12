import React from 'react';
import './about.css';

function About() {
    return (
        <div className="about-container">
            <h1>Welcome to ChocoCharm</h1>
            <div className="about-content">
                <div className="about-text">
                    <p>At <strong>ChocoCharm</strong>, we believe that chocolate is more than just a treat—it's a moment of pure joy, indulgence, and charm. Our passion for crafting the finest chocolates comes from our desire to share these little moments of happiness with the world.</p>
                    
                    <p>Our journey began with a simple idea: to create a space where chocolate lovers could find something special, something that goes beyond the ordinary. We source only the finest ingredients to craft our gourmet chocolates, combining the timeless art of chocolate-making with modern, innovative flavors.</p>
                    
                    <p>Each piece at <strong>ChocoCharm</strong> is lovingly handcrafted, with attention to detail and a dedication to creating chocolates that not only taste incredible but also bring a touch of magic to your day.</p>
                    
                    <p>Thank you for choosing <strong>ChocoCharm</strong>—where every bite is a moment of charm, crafted just for you.</p>
                </div>
                <div className="about-images">
                    <img src="https://i.imgur.com/h5LcGrj.jpeg" alt="Chocolate Display" />
                    <img src="https://i.imgur.com/0ytgueB.jpeg" alt="Chocolate Making Process" />
                </div>
                <div className="testimonials">
                    <h3>What Our Customers Are Saying</h3>
                    <blockquote>
                        <p>"The best chocolates I've ever tasted! The unique flavors blew me away."</p>
                        <cite>— Sarah J.</cite>
                    </blockquote>
                    <blockquote>
                        <p>"Every time I order from ChocoCharm, the quality is consistent, and the delivery is fast!"</p>
                        <cite>— Mark L.</cite>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}

export default About;
