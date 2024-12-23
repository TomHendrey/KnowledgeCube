import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js'; // Ensure you import the Course model
import verifyToken from '../middleware/verifyToken.js';
import checkRole from '../middleware/checkRole.js';
import mongoose from 'mongoose'; // Import mongoose here

const router = express.Router();

// Get courses created by the course creator
router.get('/creator/courses', verifyToken, checkRole(['creator']), async (req, res) => {
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

router.get('/creator/courses/:id', verifyToken, checkRole(['creator']), async (req, res) => {
    try {
        const { id: courseId } = req.params; // Extract course ID from URL params

        console.log('Received courseId in backend:', courseId); // Log the course ID for debugging

        // Find the course by ID and ensure the authenticated creator owns it
        const course = await Course.findOne({ _id: courseId, creator: req.userId });
        if (!course) {
            return res.status(404).json({ message: 'Course not found or unauthorized.' });
        }

        res.json(course); // Send the course details
    } catch (err) {
        console.error('Error fetching course details:', err);
        res.status(500).json({ message: 'Internal server error', err: err.message });
    }
});

router.get('/creator/lessons/:id', verifyToken, checkRole(['creator']), async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid lesson ID' });
        }

        // Find the course containing the lesson
        const course = await Course.findOne({ 'modules.lessons._id': id });

        if (!course) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Extract the module containing the lesson
        let moduleWithLesson = null;
        let lessonIndex = -1;

        for (const module of course.modules) {
            const index = module.lessons.findIndex((lesson) => lesson._id.toString() === id);

            if (index !== -1) {
                moduleWithLesson = module;
                lessonIndex = index;
                break;
            }
        }

        if (!moduleWithLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Get the lesson data
        const lesson = moduleWithLesson.lessons[lessonIndex];

        // Determine previous and next lessons
        const previousLessonId = lessonIndex > 0 ? moduleWithLesson.lessons[lessonIndex - 1]._id : null;
        const nextLessonId =
            lessonIndex < moduleWithLesson.lessons.length - 1 ? moduleWithLesson.lessons[lessonIndex + 1]._id : null;

        // Respond with the lesson and navigation data
        res.json({
            ...lesson.toObject(),
            courseId: course._id,
            courseTitle: course.title,
            moduleId: moduleWithLesson._id,
            moduleTitle: moduleWithLesson.title,
            lessonIndex: lessonIndex + 1,
            previousLessonId,
            nextLessonId,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
