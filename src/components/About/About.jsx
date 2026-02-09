import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
    const navigate = useNavigate();

    const openSignup = () => navigate('/signup');
    const openContact = () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section id="about" className="section about-section">
            <div className="container">

                {/* Section Header */}
                <div className="about-header text-center">
                    <motion.h2
                        className="section-title"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        Institutional Grade <span className="text-secondary-brand">Methodology</span>
                    </motion.h2>
                    <motion.div
                        className="section-divider"
                        initial={{ width: 0 }}
                        whileInView={{ width: 60 }}
                        transition={{ duration: 0.8 }}
                    ></motion.div>
                </div>

                {/* Feature 1: Event-Driven Modeling (Zig) */}
                <div className="about-row">
                    <motion.div
                        className="about-text"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h3 className="feature-title">Event-Driven Modeling</h3>
                        <p className="feature-description">
                            Traditional linear projections fail to account for life's volatility. Our engine integrates discrete life events—such as real estate acquisition, education funding, and liabilities—into a cohesive timeline.
                        </p>
                        <ul className="feature-list">
                            <li>
                                <span className="list-icon"></span>
                                Granular Inflation Targeting (Education vs. CPI)
                            </li>
                            <li>
                                <span className="list-icon"></span>
                                Temporal Liability Mapping
                            </li>
                            <li>
                                <span className="list-icon"></span>
                                Liquidity Analysis
                            </li>
                        </ul>
                        {/* Button removed for cleaner look, handled in Hero/Nav */}
                    </motion.div>

                    <motion.div
                        className="about-visual"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* SVG Illustration: Abstract Node Graph */}
                        <div className="visual-card">
                            <svg viewBox="0 0 200 200" className="feature-svg">
                                {/* Nodes */}
                                <circle cx="40" cy="160" r="6" fill="#0f172a" />
                                <circle cx="80" cy="120" r="6" fill="#0f172a" />
                                <circle cx="120" cy="140" r="6" fill="#0f172a" />
                                <circle cx="160" cy="60" r="8" fill="#b48811" />

                                {/* Links */}
                                <path d="M40,160 L80,120 L120,140 L160,60" fill="none" stroke="#94a3b8" strokeWidth="2" />
                                <path d="M40,160 L120,140" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" />

                                {/* Area Graph below */}
                                <path d="M40,160 L80,120 L120,140 L160,60 V180 H40 Z" fill="#f1f5f9" opacity="0.5" />
                            </svg>
                        </div>
                    </motion.div>
                </div>

                {/* Feature 2: Probabilistic Forecasting (Zag) */}
                <div className="about-row reverse">
                    <motion.div
                        className="about-visual"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* SVG Illustration: Distribution Curve / Shield */}
                        <div className="visual-card">
                            <svg viewBox="0 0 200 200" className="feature-svg">
                                {/* Grid */}
                                <line x1="20" y1="180" x2="180" y2="180" stroke="#e2e8f0" strokeWidth="2" />
                                <line x1="20" y1="20" x2="20" y2="180" stroke="#e2e8f0" strokeWidth="2" />

                                {/* Bell Curve / Distribution */}
                                <path
                                    d="M20,170 C60,170 80,40 100,40 C120,40 140,170 180,170"
                                    fill="none"
                                    stroke="#0f172a"
                                    strokeWidth="2"
                                />
                                {/* Confidence Interval Line */}
                                <line x1="80" y1="40" x2="80" y2="180" stroke="#b48811" strokeWidth="1" strokeDasharray="4" />
                                <line x1="120" y1="40" x2="120" y2="180" stroke="#b48811" strokeWidth="1" strokeDasharray="4" />

                                {/* Shield Outline overlaying subtly */}
                                <path d="M100,20 L160,50 V100 C160,140 135,175 100,185 C65,175 40,140 40,100 V50 L100,20 Z"
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="1"
                                    opacity="0.5"
                                />
                            </svg>
                        </div>
                    </motion.div>

                    <motion.div
                        className="about-text"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h3 className="feature-title">Probabilistic Forecasting</h3>
                        <p className="feature-description">
                            Deterministic models are fragile. We employ <strong>Geometric Brownian Motion</strong> to generate 10,000+ portfolio scenarios, providing a statistically rigorous 90% confidence interval for your net worth.
                        </p>
                        <ul className="feature-list">
                            <li>
                                <span className="list-icon"></span>
                                Stochastic Market Simulation
                            </li>
                            <li>
                                <span className="list-icon"></span>
                                Sequence of Returns Risk Analysis
                            </li>
                            <li>
                                <span className="list-icon"></span>
                                Tail Risk Assessment
                            </li>
                        </ul>
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export default About;
