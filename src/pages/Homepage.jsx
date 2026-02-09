import React from 'react';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About'; // Methodology
import Workflow from '../components/Workflow/Workflow';
import Features from '../components/Features/Features'; // Engine
import Contact from '../components/Contact/Contact';


const HomePage = () => {
    return (
        <div className="homepage">
            <Hero />
            <Features />
            <Workflow />
            <About />
            <Contact />

        </div>
    );
};

export default HomePage;