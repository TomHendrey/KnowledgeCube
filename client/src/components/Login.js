import React, { useState } from 'react';
import axiosInstance from '../axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { ReactComponent as Cube } from '../assets/images/cube-01.svg';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;
    const navigate = useNavigate();

    // Update form data on user input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle login form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/login', formData);
            const { token, user } = response.data;

            // Save user token and info in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect user based on their role
            if (user.role === 'learner') {
                navigate('/learner-dashboard');
            } else if (user.role === 'creator') {
                navigate('/creator-dashboard');
            } else {
                navigate('/'); // Fallback route for unrecognized roles
            }
        } catch (err) {
            alert('Invalid credentials'); // Show error message for login failure
        }
    };

    return (
        <div>
            <h2 className={styles['page-header']}>Welcome Back To KnowledgeCube</h2>
            <Cube className={styles.cubeIcon} />
            <div className={styles['center-wrapper']}>
                <form onSubmit={handleSubmit} className={styles['form-container']}>
                    <div className={styles['form-group']}>
                        <h2 className={styles.Login}>Login</h2>
                        <p>Please enter your details below</p>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.blackButton}>
                        Login
                    </button>
                    <p>
                        Don't have an account?{' '}
                        <a href="/register" className={styles['redirect-link']}>
                            Register here
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
