import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import './index.css';

function App() {
    const location = useLocation();
    // This will be true if the current URL is '/dashboard'
    const isDashboardPage = location.pathname === '/dashboard';

    return (
        <>
            {/* Only render the Navbar if it's NOT the dashboard page */}
            {!isDashboardPage && <Navbar />}

            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
            </main>

            {/* Only render the Footer if it's NOT the dashboard page */}
            {!isDashboardPage && <Footer />}
        </>
    );
}

export default App;

