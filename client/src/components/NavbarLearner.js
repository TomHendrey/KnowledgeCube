import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import Logo from './Logo';

const NavbarLearner = ({ onLogout }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
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
                        <button onClick={handleLogout} className={styles.logoutButton}>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavbarLearner;
