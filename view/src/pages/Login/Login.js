import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { UserContext } from '../../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import './login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/auth/login', { username, password });

            if (response.status === 200 && response.data.token) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                const decodedUser = jwtDecode(token);

                setUser({
                    id: decodedUser.id,
                    username: decodedUser.username,
                    email: decodedUser.email,
                });

                navigate('/');
            } else {
                setError('Login failed. Please check your username and password.');
            }
        } catch (error) {
            setError('Login failed. Please check your username and password.');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google'; // This will trigger Google OAuth flow
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    {error && <p>{error}</p>}
                    <button type="submit">Login</button>
                </form>
                <button className="google-login-btn" onClick={handleGoogleLogin}>
                Login with <FontAwesomeIcon icon={faGoogle} className="google-icon" />oogle
                </button>
                <p className="register">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
