import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import Logo from './Logo';

const NavbarHome = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Logo />
                </div>
                <ul className={styles.navList}>
                    <li>
                        <Link to="/login" className={styles.navLinks}>
                            Login
                        </Link>
                    </li>
                    <li>
                        <Link to="/register" className={styles.logoutButton}>
                            Register
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavbarHome;
