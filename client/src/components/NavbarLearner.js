import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import Logo from './Logo';

const NavbarLearner = ({ onLogout }) => {
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
                        <Link to="/learner-dashboard" className={styles.navLinks}>
                            Your Courses
                        </Link>
                    </li>
                    <li>
                        <Link to="/course-discovery" className={styles.navLinks}>
                            Course Discovery
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

export default NavbarLearner;
