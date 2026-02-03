
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthForm.css';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Signup Successful:', data);
                // Directly login user
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user || { name: formData.name, email: formData.email })); // Ensure user data is stored
                navigate('/dashboard');
            } else {
                setError(data.error || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup Error:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">Create Your Account</h2>

                {error && <p className="error-message">{error}</p>}

                <div className="input-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary auth-button">
                    Sign Up
                </button>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default SignupPage;