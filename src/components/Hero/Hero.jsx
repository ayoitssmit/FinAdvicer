import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <div className="hero-section section">
            <div className="container">
                <div className="hero-content">
                    <h1 className="hero-title">Visualize Your Financial Journey</h1>
                    <p className="hero-subtitle">
                        Combine life events with live stock market data to create a dynamic
                        projection of your financial future.
                    </p>
                    <button className="btn btn-primary btn-large">
                        Start Simulating
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;