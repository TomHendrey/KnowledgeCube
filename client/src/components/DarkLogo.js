import React from 'react';
import styles from './Logo.module.css'; // Import the CSS module for the logo styling
import { ReactComponent as Cube } from '../assets/images/cube-03.svg'; // Adjust the path as necessary

const Logo = () => {
    return (
        <div className={styles.logo}>
            <div className={styles.text}>
                <span className={styles.k}>K</span>
                <span className={styles.knowledge}>nowledge</span>
                <span className={styles.c}>C</span>
                <span className={styles.cube}>ube</span>
            </div>
            <Cube className={styles.cubeIcon} /> {/* This will render your cube icon */}
        </div>
    );
};

export default Logo;
