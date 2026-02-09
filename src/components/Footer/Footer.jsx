import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <span className="copyright">&copy; {new Date().getFullYear()} FinAdvicer Inc.</span>
                <span className="location">Designed for precision.</span>
            </div>
        </footer>
    );
};

export default Footer;