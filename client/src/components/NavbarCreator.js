import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import Logo from './Logo';

const NavbarCreator = ({ onLogout }) => {
    const navigate = useNavigate(); // Declare useNavigate here

    const handleLogout = () => {
        onLogout(); // Call onLogout function to clear localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Logo />
                </div>
                <ul className={styles.navList}>
                    <li>
                        <Link to="/creator-dashboard" className={styles.navLinks}>
                            Your Courses
                        </Link>
                    </li>
                    <li>
                        <Link to="/create-course" className={styles.navLinks}>
                            Create A New Course
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className={styles.navLinks}>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavbarCreator;
