import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import verifyToken from '../middleware/verifyToken.js';
import checkRole from '../middleware/checkRole.js';
import mongoose from 'mongoose';

const router = express.Router();

// Fetch all courses (enrolled and completed) for the learner
router.get('/learner/courses', verifyToken, checkRole('learner'), async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('enrolledCourses.courseId');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Map enrolled courses to include all necessary fields
        const enrolledCourses = user.enrolledCourses.map((course) => ({
            courseId: course.courseId._id,
            title: course.courseId.title,
            description: course.courseId.description,
            image: course.courseId.image,
            progressPercentage: course.progressPercentage,
            completedLessons: course.completedLessons, // Include completedLessons array
        }));

        res.json({ enrolledCourses });
    } catch (err) {
        console.error('Error fetching learner courses:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch details for a specific course by ID
router.get('/learner/courses/:id', verifyToken, checkRole('learner'), async (req, res) => {
    try {
        const { id: courseId } = req.params;

        // Fetch the user and populate enrolled courses
        const user = await User.findById(req.userId).populate('enrolledCourses.courseId');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Find the enrolled course by courseId
        const enrolledCourse = user.enrolledCourses.find((course) => course.courseId._id.toString() === courseId);
        if (!enrolledCourse) {
            return res.status(404).json({ message: 'Course not enrolled by the user.' });
        }

        // Fetch the full course details
        const course = await Course.findById(courseId).populate('modules.lessons');
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Combine course data with progressPercentage
        const response = {
            course: course.toObject(),
            progressPercentage: enrolledCourse.progressPercentage || 0,
        };

        // Send the combined response
        res.json(response);
    } catch (err) {
        console.error('Error fetching course and progress:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Fetch a lesson by ID
router.get('/learner/lessons/:id', verifyToken, checkRole('learner'), async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid lesson ID' });
        }

        // Find the course containing the lesson
        const course = await Course.findOne({ 'modules.lessons._id': id });

        if (!course) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Find the module containing the lesson
        const moduleWithLesson = course.modules.find((module) =>
            module.lessons.some((lesson) => lesson._id.toString() === id)
        );

        if (!moduleWithLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Find the lesson within the module
        const lessonIndex = moduleWithLesson.lessons.findIndex((lesson) => lesson._id.toString() === id);

        if (lessonIndex === -1) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        const lesson = moduleWithLesson.lessons[lessonIndex];

        // Determine the IDs of the previous and next lessons
        const previousLessonId = lessonIndex > 0 ? moduleWithLesson.lessons[lessonIndex - 1]._id : null;
        const nextLessonId =
            lessonIndex < moduleWithLesson.lessons.length - 1 ? moduleWithLesson.lessons[lessonIndex + 1]._id : null;

        // Respond with the lesson data and navigation info
        res.json({
            ...lesson.toObject(),
            courseId: course._id,
            courseTitle: course.title,
            moduleId: moduleWithLesson._id,
            moduleTitle: moduleWithLesson.title,
            lessonIndex: lessonIndex + 1, // 1-based index
            previousLessonId,
            nextLessonId,
        });
    } catch (err) {
        console.error('Error fetching lesson:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update progress for a specific lesson in a course
router.put('/learner/progress/:courseId', verifyToken, checkRole(['learner']), async (req, res) => {
    try {
        const { courseId } = req.params; // Get courseId from URL parameter
        const { lessonId } = req.body; // Get lessonId from request body

        // Fetch the user by ID
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Find the enrolled course in the user's array
        const course = user.enrolledCourses.find((c) => c.courseId.toString() === courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found in enrolled courses.' });
        }

        // Ensure `completedLessons` is defined
        if (!Array.isArray(course.completedLessons)) {
            course.completedLessons = [];
        }

        // Avoid duplicating completed lessons
        if (!course.completedLessons.includes(lessonId)) {
            course.completedLessons.push(lessonId);
        }

        // Fetch course details to calculate progress
        const courseDetails = await Course.findById(courseId);

        if (!courseDetails) {
            return res.status(404).json({ message: 'Course details not found.' });
        }

        // Calculate progress percentage
        const totalLessons = courseDetails.modules.reduce((total, module) => total + module.lessons.length, 0);
        course.progressPercentage = Math.round((course.completedLessons.length / totalLessons) * 100);

        // Log progress and completed lessons before saving
        console.log('Updated progress:', course.progressPercentage);
        console.log('Completed lessons:', course.completedLessons);

        // Save the updated user document
        await user.save();
        console.log('User document successfully saved.');

        res.json({
            message: 'Progress updated successfully.',
            progress: course.progressPercentage,
        });
    } catch (err) {
        console.error('Error updating progress:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});
export default router;
