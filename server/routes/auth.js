import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({ user: { id: user._id, name, email }, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid login credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid login credentials' });
        }

        const token = generateToken(user._id);

        res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   POST /api/auth/google
// @desc    Login/Register with Google
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;

        // Fetch user info using the access token
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` },
        });

        const { name, email, sub: googleId } = userInfoResponse.data;

        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            // User exists, update googleId if not present
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                name,
                email,
                googleId,
                password: 'google-auth-user'
            });
            await user.save();
        }

        const jwtToken = generateToken(user._id);
        res.json({ user: { id: user._id, name: user.name, email: user.email }, token: jwtToken });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(400).json({ error: 'Google authentication failed' });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
