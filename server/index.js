import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import userRoutes from './routes/user.js';
import connectDB from './db.js'; // Import the db.js file
import uploadRoutes from './routes/uploadRoutes.js';
import lessonsRoutes from './routes/lessons.js';
import creatorRoutes from './routes/creatorRoutes.js';
import learnerRoutes from './routes/learnerRoutes.js';
import path from 'path'; // Import the path module
import { fileURLToPath } from 'url';

// Initialize dotenv to load environment variables
dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET); // For debugging

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Configure CORS to handle preflight requests explicitly
const corsOptions = {
    origin: [
        'http://localhost:3000', // Local development
        'https://gleaming-yeot-1d8a22.netlify.app', // Deployed frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true, // Include cookies if needed
};

// Middleware CORS setup
app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

// Middleware to log all incoming requests
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.path}`);
    next();
});

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the uploads directory
app.use('/uploads/images', express.static('/uploads/images'));

// Serve static files from the uploads/pdfs directory
app.use('/uploads/pdfs', express.static('/uploads/pdfs'));

// Serve static files from the uploads/videos directory
app.use('/uploads/videos', express.static('/uploads/videos'));

app.use(express.json()); // Parse incoming JSON requests

// Use the authentication routes
app.use('/api/auth', router);

// Use creator routes
app.use('/api', creatorRoutes);

// Use learner routes
app.use('/api', learnerRoutes);

// Use the courses routes
app.use('/api/courses', courseRoutes);

// Use the lessons routes
app.use('/api/lessons', lessonsRoutes);

// Use the user routes
app.use('/api/user', userRoutes);

// Use the upload routes
app.use('/api/uploads', uploadRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB:', err));

// Define a simple route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the KnowledgeCube API!');
});

// Starting the express server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
