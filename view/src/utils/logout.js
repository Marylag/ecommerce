import axios from 'axios';

export const handleLogout = async (navigate) => {
    try {
        await axios.get('http://localhost:5000/auth/logout');

        localStorage.removeItem('token');

        navigate('/login');
    } catch (error) {
        console.error('Logout failed', error);
    }
};