import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const pathVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 2.5, ease: "easeInOut" }
        }
    };

    return (
        <section className="hero-section">
            <div className="hero-bg-mesh"></div>

            <div className="container hero-container">
                {/* Left Content */}
                <motion.div
                    className="hero-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 className="hero-title" variants={itemVariants}>
                        Predict Wealth. <br />
                        <span className="text-gold">Engineer Future.</span>
                    </motion.h1>

                    <motion.p className="hero-subtitle" variants={itemVariants}>
                        Stop guessing. Use institutional-grade Monte Carlo simulations to model life events,
                        inflation, and market volatility with statistical confidence.
                    </motion.p>

                    <motion.div className="hero-cta-group" variants={itemVariants}>
                        <Link to="/signup" className="btn btn-primary btn-lg">
                            Initialize Simulation
                        </Link>
                        <Link to="/login" className="btn btn-outline btn-lg">
                            Access Portal
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right Visual - 2D Animated Dashboard */}
                <motion.div
                    className="hero-visual"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="dashboard-card">
                        {/* Header */}
                        <div className="card-header">
                            <div className="window-dots">
                                <span className="dot red"></span>
                                <span className="dot yellow"></span>
                                <span className="dot green"></span>
                            </div>
                        </div>

                        {/* Main Graph Area */}
                        <div className="card-body">
                            <div className="stats-row">
                                <div className="stat">
                                    <span className="label">Proj. Net Worth</span>
                                    <span className="value">$2.4M</span>
                                </div>
                                <div className="stat">
                                    <span className="label">Confidence</span>
                                    <span className="value text-gold">94%</span>
                                </div>
                            </div>

                            <div className="graph-container">
                                {/* SVG Line Chart */}
                                <svg viewBox="0 0 400 200" className="chart-svg">
                                    {/* Grid Lines */}
                                    <line x1="0" y1="50" x2="400" y2="50" stroke="#f1f5f9" />
                                    <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" />
                                    <line x1="0" y1="150" x2="400" y2="150" stroke="#f1f5f9" />

                                    {/* Area Gradient */}
                                    <defs>
                                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#B6955E" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="#B6955E" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <motion.path
                                        d="M0,180 C50,170 100,140 150,130 C200,120 250,80 300,60 C350,40 380,30 400,20 L400,200 L0,200 Z"
                                        fill="url(#goldGradient)"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1, duration: 1.5 }}
                                    />

                                    {/* The Line */}
                                    <motion.path
                                        d="M0,180 C50,170 100,140 150,130 C200,120 250,80 300,60 C350,40 380,30 400,20"
                                        fill="none"
                                        stroke="#B6955E"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        variants={pathVariants}
                                        initial="hidden"
                                        animate="visible"
                                    />

                                    {/* Pulsing Data Points */}
                                    <motion.circle cx="150" cy="130" r="4" fill="#0f172a"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} />
                                    <motion.circle cx="300" cy="60" r="4" fill="#0f172a"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} />
                                </svg>

                                {/* Floating Event Markers */}
                                <motion.div
                                    className="event-marker"
                                    style={{ left: '35%', top: '60%' }}
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <span className="marker-dot"></span>
                                    <span className="marker-label">House</span>
                                </motion.div>

                                <motion.div
                                    className="event-marker"
                                    style={{ left: '72%', top: '25%' }}
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                >
                                    <span className="marker-dot"></span>
                                    <span className="marker-label">Retire</span>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;