import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProjectionPage from './pages/ProjectionView';
import './index.css';

function App() {
    const location = useLocation();
    // This logic checks if the user is on any of the app's internal pages
    const isAppView = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/projection');

    return (
        <>
            {/* Only show Navbar if not in the app view */}
            {!isAppView && <Navbar />}
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/projection" element={<ProjectionPage />} />
                </Routes>
            </main>
            {/* Only show Footer if not in the app view */}
            {!isAppView && <Footer />}
        </>
    );
}

export default App;

