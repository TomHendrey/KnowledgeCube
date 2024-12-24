import React from 'react';
import styles from './Footer.module.css'; // Import the Footer styles
import Logo from './Logo';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Logo />
                    <p>&copy; {new Date().getFullYear()} Knowledge Cube. All rights reserved.</p>
                </div>

                <div className={styles.links}>
                    <div className={styles.footerEmail}>info@knowledgecube.org</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
