import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // On initial load, check if the token exists in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode the token to get the user data
                const decodedUser = jwtDecode(token);

                // Check if the token is expired
                const currentTime = Date.now() / 1000; // time in seconds
                if (decodedUser.exp < currentTime) {
                    // Token expired, remove it from localStorage
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    // Set the user from the token
                    setUser({
                        id: decodedUser.id,
                        username: decodedUser.username || 'Google User',
                        email: decodedUser.email || 'No Email',
                    });
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
