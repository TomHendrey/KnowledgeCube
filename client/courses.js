import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import checkRole from '../middleware/checkRole.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { uploadFile } from '../multerConfig.js';

const router = express.Router();

// Route to enroll in a course
router.post('/enroll', verifyToken, checkRole('learner'), async (req, res) => {
    const { courseId } = req.body;

    // Check for course ID
    if (!courseId) {
        return res.status(400).json({ message: 'Course ID is required.' });
    }

    // Validate the courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: 'Invalid course ID format.' });
    }

    try {
        // Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Update learner's enrolled courses
        const learner = await User.findById(req.userId);
        if (!learner) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if already enrolled
        if (learner.enrolledCourses.some((c) => c.courseId.equals(courseId))) {
            return res.status(400).json({ message: 'Already enrolled in this course.' });
        }

        learner.enrolledCourses.push({ courseId, progress: 0 }); // Add course with ID and default progress
        await learner.save();

        res.status(200).json({
            message: 'Successfully enrolled in the course.',
            enrolledCourses: learner.enrolledCourses,
        });
    } catch (err) {
        console.error('Error enrolling in course:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post(
    '/create',
    verifyToken,
    checkRole('creator'),
    uploadFile.fields([
        { name: 'image', maxCount: 1 }, // Single course image
        { name: 'pdfs', maxCount: 10 }, // Multiple PDFs
        { name: 'lessonImages', maxCount: 10 }, // Lesson images
        { name: 'videos', maxCount: 5 }, // Course or lesson videos
    ]),

    async (req, res) => {
        const { title, description, modules, links } = req.body;

        // Handle uploaded files (use relative paths)
        const courseImage = req.files['image'] ? `/uploads/images/${req.files['image'][0].filename}` : null;
        const pdfFiles = req.files['pdfs'] ? req.files['pdfs'].map((file) => `/uploads/pdfs/${file.filename}`) : [];
        const videoFiles = req.files['videos']
            ? req.files['videos'].map((file) => `/uploads/videos/${file.filename}`)
            : [];
        const lessonImages = req.files['lessonImages']
            ? req.files['lessonImages'].map((file) => `/uploads/images/${file.filename}`)
            : [];

        // Validate required fields
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required.' });
        }

        try {
            // Parse and validate modules and links
            const parsedModules = modules ? JSON.parse(modules) : [];
            const parsedLinks = links ? JSON.parse(links) : [];

            // Attach lesson images to their corresponding lessons
            let imageIndex = 0; // To track lesson image assignment
            parsedModules.forEach((module) => {
                module.lessons.forEach((lesson) => {
                    if (lesson.images && lesson.images.length > 0) {
                        lesson.images = lesson.images
                            .map(() => {
                                return lessonImages[imageIndex++] || null;
                            })
                            .filter((img) => img); // Filter out nulls if fewer images are uploaded
                    }
                });
            });

            // Create new course document
            const newCourse = new Course({
                title,
                description,
                creator: req.userId, // Assigned via verifyToken middleware
                image: courseImage, // Path to course cover image
                modules: parsedModules, // Parsed modules data
                links: parsedLinks, // Parsed global links
                pdfs: pdfFiles, // Array of PDF file paths
                videos: videoFiles, // Array of video file paths
            });

            const savedCourse = await newCourse.save();

            res.status(201).json({
                message: 'Course created successfully',
                course: savedCourse,
            });
        } catch (err) {
            console.error('Error creating course:', err);
            res.status(500).json({
                message: 'Server error',
                error: err.message,
            });
        }
    }
);

// Get courses the learner is enrolled in
router.get('/enrolled', verifyToken, checkRole('learner'), async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'Unauthorized access.' });
        }

        // Fetch the learner and populate enrolled courses
        const learner = await User.findById(req.userId).populate({
            path: 'enrolledCourses.courseId', // Populate courseId in enrolledCourses
            model: 'Course', // Explicitly specify the model (optional but can help)
        });

        if (!learner) {
            return res.status(404).json({ message: 'User not found.' });
        }

        console.log('Populated Learner:', learner);

        // Format the response to include course details and progress
        const courses = learner.enrolledCourses.map((enrollment) => {
            if (!enrollment.courseId) {
                return {
                    message: 'Course not found for this enrollment.',
                    progress: enrollment.progress,
                };
            }
            return {
                id: enrollment.courseId._id, // Course ID
                title: enrollment.courseId.title, // Course Title
                description: enrollment.courseId.description, // Course Description
                image: enrollment.courseId.image, // Course Image
                progress: enrollment.progress, // Learner's progress
            };
        });

        res.status(200).json({ courses });
    } catch (err) {
        console.error('Error fetching enrolled courses:', err.message);
        res.status(500).json({
            message: 'An error occurred while fetching enrolled courses.',
        });
    }
});

// Get courses created by the course creator
router.get('/created', verifyToken, checkRole('creator'), async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'Unauthorized access.' });
        }

        const courses = await Course.find({ creator: req.userId });
        res.status(200).json({ courses });
    } catch (err) {
        console.error('Error fetching created courses:', err.message);
        res.status(500).json({
            message: 'An error occurred while fetching created courses.',
        });
    }
});

// GET /api/course/:id - Fetch a course and its details by ID
router.get('/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        console.log('Course ID:', courseId);

        // Find the course by ID
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        res.json(course); // Send the entire course object, including modules
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to get all available courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find(); // Fetch all courses
        res.status(200).json({ courses });
    } catch (err) {
        console.error('Error fetching courses:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
