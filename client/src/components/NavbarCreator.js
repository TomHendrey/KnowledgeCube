import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import Logo from './Logo';

const NavbarCreator = ({ onLogout }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate(); // Declare useNavigate here

    const handleLogout = () => {
        onLogout(); // Call onLogout function to clear localStorage
        navigate('/login'); // Redirect to login page
    };

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Logo />
                </div>
                <div className={styles.hamburgerIcon} onClick={toggleMenu}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <ul className={`${styles.navList} ${menuOpen ? styles.active : ''}`}>
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
                        <button onClick={handleLogout} className={styles.logoutButton}>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavbarCreator;
