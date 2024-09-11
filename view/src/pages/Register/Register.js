import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axious from 'axios';
import './register.css';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axious.post(`${process.env.REACT_APP_API_URL}/auth/register`, { 
                username,
                email,
                first_name: firstName,
                last_name: lastName,
                password,
            });
            if (response.status === 201) {
                navigate('/');
            }
        } catch (error) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>First Name:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p>{error}</p>}
                    <button type="submit">Register</button>
                </form>
                <p className="login">
                    Already have an account? <NavLink to="/login">Login here</NavLink>
                </p>
            </div>
        </div>
    );
}

export default Register;
