import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            navigate('/protected')
        }
    }, [navigate]);

    return (
        <div>
            <h1>Home Page</h1>
            <p>Welcome to the Home Page!</p>
        </div>
    );
}

export default Home;
