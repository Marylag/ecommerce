import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Submitting login:', { username, password });

        try {
            const response = await axios.post('http://localhost:5000/auth/login', { 
                username,
                password,
            });

            console.log('Login response:', response.data);

            if (response.status === 200 && response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/');
            } else {
                setError('Login failed. Please check your username and password.');
            }
        } catch (error) {
            console.error('Login error:', error);

            if (error.response && error.response.status === 401) {
                setError('Invalid username or password');
            } else {
                setError('Login failed. Please check your username and password.');
            }
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google';
    };

    

    return (
        <div>
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
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Login</button>
            </form>
            <p>Or login using:</p>
            <button onClick={handleGoogleLogin}>Google</button>
            <p>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default Login;