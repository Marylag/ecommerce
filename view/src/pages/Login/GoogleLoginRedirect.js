import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { jwtDecode } from 'jwt-decode';

function GoogleLoginRedirect() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Extract token from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);

            // Decode the token to get user details
            const decodedUser = jwtDecode(token);

            setUser({
                id: decodedUser.id,
                username: decodedUser.username || 'Google User',  // Google doesn't return username, use a fallback
                email: decodedUser.email || 'No Email',
            });

            navigate('/'); // Redirect to the home page
        } 
    }, [setUser, navigate]);

    return <div>Logging you in...</div>;
}

export default GoogleLoginRedirect;
