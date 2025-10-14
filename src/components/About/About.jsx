import React from 'react';
import './About.css';
import teamImage from '../../assets/about-team.png';
import cityImage from '../../assets/about-city.png';

const About = () => {
    // Function to handle smooth scrolling
    const handleScroll = (e, targetId) => {
        e.preventDefault(); // Prevent any default button behavior
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section id="about" className="section">
            <div className="container">
                {/* First Row: Text on Left, Image on Right */}
                <div className="about-row">
                    <div className="about-text">
                        <h2 className="about-title">
                            Our team, clients, and community are at the{' '}
                            <span className="highlight-text">center of everything</span> we do.
                        </h2>
                        <p className="about-description">
                            Through our tailored financial simulation tools spanning investment
                            and life event planning, we're relentlessly focused on serving our
                            clients globally and driving sustainable impact for their futures.
                        </p>
                        <button
                            className="btn btn-secondary"
                            onClick={(e) => handleScroll(e, 'contact')}
                        >
                            Learn More About Us
                        </button>
                    </div>
                    <div className="about-image">
                        <img src={teamImage} alt="Our Team and Clients" />
                    </div>
                </div>

                {/* Second Row: Image on Left, Text on Right */}
                <div className="about-row reverse">
                    <div className="about-image">
                        <img src={cityImage} alt="Global Corporate Vision" />
                    </div>
                    <div className="about-text">
                        <p className="about-pre-title">GLOBAL FINANCIAL PLANNING</p>
                        <h2 className="about-title">
                            Perspectives from a{' '}
                            <span className="highlight-text">New Generation</span>
                        </h2>
                        <p className="about-description">
                            Heightened volatility and uncertainty are shaping the financial future.
                            Learn how FinAdvice helps people of all backgrounds, from students
                            to retirees, navigate current market conditions with confidence.
                        </p>
                        <button
                            className="btn btn-secondary"
                            onClick={(e) => handleScroll(e, 'contact')}
                        >
                            Find Out More
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;

