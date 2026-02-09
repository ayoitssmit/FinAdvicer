import React from 'react';
import { motion } from 'framer-motion';
import './Contact.css';

const Contact = () => {
    return (
        <section id="contact" className="section contact-section">
            <div className="container">
                <motion.div
                    className="contact-layout"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >

                    {/* Header */}
                    <div className="contact-header">
                        <h2 className="contact-title">Start Your Projection</h2>
                        <p className="contact-subtitle">
                            Join the community of forward-thinking investors using FinAdvicer for comprehensive wealth modeling.
                        </p>
                    </div>

                    {/* Columns */}
                    <div className="contact-columns">

                        <div className="contact-col">
                            <h3>Product</h3>
                            <ul>
                                <li><a href="#features">Features</a></li>
                                <li><a href="#security">Data Security</a></li>
                                <li><a href="#roadmap">Roadmap</a></li>
                            </ul>
                        </div>

                        <div className="contact-col">
                            <h3>Support</h3>
                            <ul>
                                <li><a href="mailto:support@finadvicer.com">Technical Assistance</a></li>
                                <li><a href="#docs">Documentation</a></li>
                                <li><a href="#status">System Status</a></li>
                            </ul>
                        </div>

                        <div className="contact-col">
                            <h3>Legal</h3>
                            <ul>
                                <li><a href="#privacy">Privacy Policy</a></li>
                                <li><a href="#terms">Terms of Service</a></li>
                            </ul>
                        </div>

                    </div>

                </motion.div>


            </div>
        </section>
    );
};

export default Contact;