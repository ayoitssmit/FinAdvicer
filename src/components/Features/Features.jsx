import React from 'react';
import { motion } from 'framer-motion';
import './Features.css';

const Features = () => {
    return (
        <section id="engine" className="section features-section">
            <div className="container">
                <motion.div
                    className="section-header text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">The <span className="text-secondary-brand">Simulation Engine</span></h2>
                    <p className="section-subtitle">
                        Built on institutional financial models, not simple compounding calculators.
                    </p>
                </motion.div>

                <div className="bento-grid">
                    {/* Card 1: Monte Carlo (Large) */}
                    <motion.div
                        className="bento-card large"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="card-content">
                            <h3>Monte Carlo Core</h3>
                            <p>
                                We don't just predict one future; we simulate thousands. By stressing your portfolio against historical volatility and sequence-of-return risks, we determine the statistical probability of achieving your financial milestones.
                            </p>
                            <div className="feature-visual-large">
                                {/* Abstract Monte Carlo Paths SVG */}
                                <svg viewBox="0 0 400 120" className="monte-carlo-svg">
                                    <path d="M0,100 C50,90 100,80 150,90 C200,100 250,60 300,50 C350,40 400,20" fill="none" stroke="#B6955E" strokeWidth="2" opacity="1" />
                                    <path d="M0,100 C60,110 120,100 180,110 C240,120 300,100 360,90 L400,85" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />
                                    <path d="M0,100 C40,70 80,60 120,65 C160,70 200,40 240,30 C280,20 320,10 360,5 L400,0" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />
                                    <path d="M0,100 C55,95 110,105 165,100 C220,95 275,70 330,60 C385,50 400,45" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />

                                    {/* Confidence Area */}
                                    <path d="M0,100 C50,90 100,80 150,90 C200,100 250,60 300,50 C350,40 400,20 V85 C360,90 300,100 240,110 V110 C200,120 150,110 0,100 Z" fill="#B6955E" opacity="0.05" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Tax Drag */}
                    <motion.div
                        className="bento-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                        <h3>Tax-Adjusted Returns</h3>
                        <p>Models LTCG, STCG, and tax harvesting implications on your final corpus.</p>
                    </motion.div>

                    {/* Card 3: Inflation */}
                    <motion.div
                        className="bento-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 3v18h18" />
                                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                            </svg>
                        </div>
                        <h3>Granular Inflation</h3>
                        <p>
                            Different costs rise at different rates. The engine applies specific inflation factors to healthcare, education, and lifestyle expenses to project your true purchasing power.
                        </p>
                    </motion.div>

                    {/* Card 4: Liability Mapping */}
                    <motion.div
                        className="bento-card wide"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <h3>Dynamic Liability Mapping</h3>
                        <p>
                            Life isn't linear. Our model integrates discrete cash-flow events—such as real estate purchases, education funding, or planned liabilities—directly into your projection timeline. This ensures that your liquidity needs are matched with your asset maturity, protecting your long-term compounding from forced withdrawals.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Features;
