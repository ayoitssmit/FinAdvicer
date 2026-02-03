import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // This function handles the smooth scrolling.
    // It checks if the user is on the homepage. If not, it navigates
    // there first and then scrolls to the correct section.
    const handleScroll = (e, targetId) => {
        e.preventDefault();
        if (location.pathname !== '/') {
            // If not on the homepage, navigate there.
            navigate('/');
            // A short delay ensures the page has loaded before scrolling.
            setTimeout(() => {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        } else {
            // If already on the homepage, just scroll.
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container container">
                <Link to="/" className="navbar-logo">
                    FinAdvice
                </Link>
                <div className="navbar-links">
                    <a
                        href="#about"
                        onClick={(e) => handleScroll(e, 'about')}
                        className="navbar-link"
                    >
                        About
                    </a>
                    <a
                        href="#contact"
                        onClick={(e) => handleScroll(e, 'contact')}
                        className="navbar-link"
                    >
                        Contact
                    </a>
                </div>
                <div className="navbar-auth">
                    <Link to="/login" className="btn btn-secondary">
                        Login
                    </Link>
                    <Link to="/signup" className="btn btn-primary">
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

