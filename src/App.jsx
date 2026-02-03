import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProjectionPage from './pages/ProjectionView';
import './index.css';

// Protected Route Component
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

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

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <DashboardPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/projection"
                        element={
                            <PrivateRoute>
                                <ProjectionPage />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </main>
            {/* Only show Footer if not in the app view */}
            {!isAppView && <Footer />}
        </>
    );
}

export default App;

