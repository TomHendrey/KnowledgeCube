import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import verifyToken from '../middleware/verifyToken.js';

// Defining the router
const router = express.Router();

// User Registration route (with hashing)
router.post('/register', async (req, res) => {
    console.log('Registration route hit');
    const { name, email, password, role } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Password validation
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 cahracters long.' });
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        return res.status(400).json({
            message: 'Password must include uppercase, lowercase, and a number.',
        });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user with hashed password (hashed automatically due to pre-save hook)
        const newUser = new User({
            name,
            email,
            password, // The password will be hashed automatically
            role,
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        console.log('User created successfully:', savedUser);

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: savedUser._id,
                email: savedUser.email,
                role: savedUser.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h', // the length of thime the token will last for
            }
        );

        res.json({
            message: 'User registered successfully',
            token,
            user: {
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
            },
        });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// User Login route
router.post('/login', async (req, res) => {
    console.log('Login route hit');
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Send the response
        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Protected route example
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId); // Get user info by ID
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
