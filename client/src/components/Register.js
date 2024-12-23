import React, { useState } from 'react';
import axiosInstance from '../axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import { ReactComponent as Cube } from '../assets/images/cube-01.svg';

const Register = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null); // Global error for form submission
    const [fieldErrors, setFieldErrors] = useState({}); // Errors for individual fields

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'learner',
    });

    const { name, email, password, role } = formData;

    // Password validation rules
    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long.';
        }
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
            return 'Password must include uppercase, lowercase, and a number.';
        }
        return null; // Valid password
    };

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        let errors = {}; // Temporary object for tracking validation errors

        // Validate each field
        if (!formData.name) errors.name = 'Name is required';
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.password) errors.password = 'Password is required';

        const passwordError = validatePassword(formData.password);
        if (passwordError) errors.password = passwordError;

        // If there are validation errors, update state and halt submission
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({}); // Clear field errors if validation passes

        try {
            // Send registration data to the backend
            await axiosInstance.post('/auth/register', formData);
            alert('Registration successful!');
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            // Handle backend errors
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occurred during registration.');
            }
        }
    };

    return (
        <div>
            <h2 className={styles['page-header']}>Welcome To KnowledgeCube!</h2>
            <p className={styles.subHeader}>
                Whether you're here to learn or teach, KnowledgeCube is your platform for growth and collaboration. Get
                started now!
            </p>
            <Cube className={styles.cubeIcon} /> {/* Render the cube icon */}
            <div className={styles['center-wrapper']}>
                <form onSubmit={handleSubmit} className={styles['form-container']}>
                    {/* Name Field */}
                    <div className={styles['form-group']}>
                        <h2 className={styles.register}>Register</h2>
                        <p className={styles.registerP}>Please enter your details below</p>
                        <input type="text" name="name" placeholder="Full Name" value={name} onChange={handleChange} />
                        {fieldErrors.name && <div className={styles['error-message']}>{fieldErrors.name}</div>}
                    </div>

                    {/* Email Field */}
                    <div className={styles['form-group']}>
                        <input type="email" name="email" placeholder="Email" value={email} onChange={handleChange} />
                        {fieldErrors.email && <div className={styles['error-message']}>{fieldErrors.email}</div>}
                    </div>

                    {/* Password Field */}
                    <div className={styles['form-group']}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleChange}
                        />
                        {fieldErrors.password && <div className={styles['error-message']}>{fieldErrors.password}</div>}
                    </div>

                    {/* Role Dropdown */}
                    <div className={styles['form-group']}>
                        <select name="role" value={role} onChange={handleChange}>
                            <option value="learner">Learner</option>
                            <option value="creator">Course Creator</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className={styles['blackButton']}>
                        Register
                    </button>
                    <p>
                        Already have an account?{' '}
                        <a className={styles['login-link']} href="/login">
                            Log in here
                        </a>
                        .
                    </p>

                    {/* Global Error Message */}
                    {error && <div className={styles['error-message']}>{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default Register;
