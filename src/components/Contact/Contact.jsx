import React from 'react';
import './Contact.css';

const Contact = () => {
    return (
        <section id="contact" className="section">
            <div className="container">
                <h2 className="section-title">Get In Touch</h2>
                <p className="section-subtitle">
                    Have questions or feedback? We'd love to hear from you. Reach out at
                    <a href="mailto:contact@finadvice.com" className="contact-link">
                        contact@finadvice.com
                    </a>
                </p>
            </div>
        </section>
    );
};

export default Contact;