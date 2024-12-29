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
        { name: 'lessonImages', maxCount: 20 }, // Lesson images
        { name: 'videos', maxCount: 5 }, // Course or lesson videos
    ]),

    async (req, res) => {
        // Log req.body and req.files to debug incoming data
        console.log('Request Body:', req.body);
        console.log('Uploaded Files:', req.files);

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
            let parsedModules = [];
            try {
                // Check if modules is a string; if so, parse it. If it is sent as an array this step will be bypassed
                parsedModules = typeof modules === 'string' ? JSON.parse(modules) : modules;

                console.log('Parsed Modules Before Processing:', JSON.stringify(parsedModules, null, 2));

                // Ensure parsedModules is an array
                if (!Array.isArray(parsedModules)) throw new Error('Modules must be an array.');
            } catch (err) {
                console.error('Module Parsing Error:', err.message);
                return res.status(400).json({ message: 'Invalid modules format.', error: err.message });
            }

            const parsedLinks = links ? JSON.parse(links) : [];

            // Attach lesson images to their corresponding lessons
            let imageIndex = 0;

            // Attach lesson images to their corresponding lessons
            let pdfIndex = 0;

            console.log('Request Body Keys:', Object.keys(req.body));

            parsedModules.forEach((module, moduleIndex) => {
                module.lessons.forEach((lesson, lessonIndex) => {
                    // Ensure lessonContent persists from req.body
                    lesson.lessonContent = lesson.lessonContent || '';

                    // Ensure that the lesson images array is initialized before you attemp to push to it
                    lesson.images = lesson.images || [];

                    // Add uploaded lesson images to the images array
                    if (req.files['lessonImages'] && req.files['lessonImages'][imageIndex]) {
                        lesson.images.push(`/uploads/images/${req.files['lessonImages'][imageIndex].filename}`);
                        imageIndex++;
                    }

                    if (req.files['pdfs'] && req.files['pdfs'][pdfIndex]) {
                        lesson.pdf = `/uploads/pdfs/${req.files['pdfs'][pdfIndex].filename}`;
                        pdfIndex++;
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

// POST /courses/draft - Save a draft course
router.post(
    '/draft',
    verifyToken,
    checkRole('creator'),
    uploadFile.fields([
        { name: 'image', maxCount: 1 }, // Single course image
        { name: 'pdfs', maxCount: 10 }, // Multiple PDFs
        { name: 'lessonImages', maxCount: 20 }, // Lesson images
        { name: 'videos', maxCount: 5 }, // Course or lesson videos
    ]),
    async (req, res) => {
        const { title, description, modules, links } = req.body;

        try {
            // Parse and process modules and links
            const parsedModules = modules ? JSON.parse(modules) : [];
            const parsedLinks = links ? JSON.parse(links) : [];

            // Handle uploaded files
            const courseImage = req.files?.image ? `/uploads/images/${req.files.image[0].filename}` : null;
            const pdfFiles = req.files?.pdfs ? req.files.pdfs.map((file) => `/uploads/pdfs/${file.filename}`) : [];
            const videoFiles = req.files?.videos
                ? req.files.videos.map((file) => `/uploads/videos/${file.filename}`)
                : [];
            const lessonImages = req.files?.lessonImages
                ? req.files.lessonImages.map((file) => `/uploads/images/${file.filename}`)
                : [];

            // Attach lesson images and PDFs to lessons (if provided)
            let imageIndex = 0;
            let pdfIndex = 0;

            parsedModules.forEach((module) => {
                module.lessons.forEach((lesson) => {
                    lesson.images = lesson.images || [];
                    if (req.files['lessonImages'] && req.files['lessonImages'][imageIndex]) {
                        lesson.images.push(`/uploads/images/${req.files['lessonImages'][imageIndex].filename}`);
                        imageIndex++;
                    }

                    if (req.files['pdfs'] && req.files['pdfs'][pdfIndex]) {
                        lesson.pdf = `/uploads/pdfs/${req.files['pdfs'][pdfIndex].filename}`;
                        pdfIndex++;
                    }
                });
            });

            // Create a new course draft
            const draftCourse = new Course({
                title, // Optional for drafts
                description, // Optional for drafts
                creator: req.userId, // From verifyToken middleware
                image: courseImage, // Path to cover image
                modules: parsedModules, // Parsed modules
                links: parsedLinks, // Parsed links
                pdfs: pdfFiles, // Uploaded PDFs
                videos: videoFiles, // Uploaded videos
                isDraft: true, // Mark as draft
            });

            // Save draft course
            const savedDraft = await draftCourse.save();

            res.status(201).json({
                message: 'Draft course saved successfully.',
                draft: savedDraft,
            });
        } catch (err) {
            console.error('Error saving draft course:', err.message);
            res.status(500).json({
                message: 'An error occurred while saving the draft course.',
                error: err.message,
            });
        }
    }
);

// Get /courses/draft/:id - to edit a draft
router.get('/draft/:id', verifyToken, checkRole('creator'), async (req, res) => {
    const { id } = req.params;

    try {
        console.log('Fetching draft:', { id, userId: req.userId }); // Debug log

        // Validate the course ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid course ID.' });
        }

        // Fetch the draft course
        const draft = await Course.findOne({ _id: id, creator: req.userId, isDraft: true });
        if (!draft) {
            return res.status(404).json({ message: 'Draft not found.' });
        }

        res.status(200).json({ draft });
    } catch (err) {
        console.error('Error fetching draft:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

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

// GET /api/courses/:id - Fetch a course and its details by ID
router.get('/:id', async (req, res) => {
    console.log('Received courseId in backend:', req.params.id); // Log this

    const courseId = req.params.id;
    try {
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
