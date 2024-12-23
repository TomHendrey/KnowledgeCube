import express from 'express';
import User from '../models/User.js';
import verifyToken from '../middleware/verifyToken.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

// Fetch all courses (enrolled and completed) for the user
router.get('/courses', verifyToken, async (req, res) => {
    try {
        // Use req.userId instead of req.user.id
        const user = await User.findById(req.userId).populate('enrolledCourses.courseId');

        console.log(user.enrolledCourses);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const enrolledCourses = user.enrolledCourses.filter((course) => course.progressPercentage < 100);
        const completedCourses = user.enrolledCourses.filter((course) => course.progressPercentage === 100);

        res.json({
            enrolledCourses,
            completedCourses,
        });
    } catch (err) {
        console.error('Error in /user/courses route:', err);
        res.status(500).json({ message: 'Server error', err });
    }
});

// Update progress for a specific course for a user
router.patch('/:id/courses/:courseId/progress', async (req, res) => {
    try {
        const { progressPercentage } = req.body; // Destructureing the new progress percentage

        // Check if the progress percentage is between 0 and 100
        if (progressPercentage < 0 || progressPercentage > 100) {
            return res.status(400).json({ message: 'Progress percentage must be between 0 and 100' });
        }

        // Find the user by ID
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the enrolled course for this user by courseId
        const courseIndex = user.enrolledCourses.findIndex(
            (course) => course.courseId.toString() === req.params.courseId
        );

        if (courseIndex === -1) {
            return res.status(404).json({ message: "Course not found in user's enrolled courses" });
        }

        // Update the progress for the specific course
        user.enrolledCourses[courseIndex].progressPercentage = progressPercentage;
        user.enrolledCourses[courseIndex].lastAccessed = new Date(); // Update the last accessed timestamp

        // Save the updated user document
        await user.save();

        res.json({
            message: 'Course progress updated successfully',
            updatedCourse: user.enrolledCourses[courseIndex],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', err });
    }
});

router.put('/progress/:courseId', verifyToken, checkRole(['learner']), async (req, res) => {
    try {
        const { courseId } = req.params; // Get courseId from URL parameter
        const { lessonId } = req.body; // Get lessonId from request body

        const user = await User.findById(req.user.id);

        // Find the course in the enrolledCourses array
        const course = user.enrolledCourses.find((c) => c.courseId.toString() === courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Avoid duplicating completed lessons
        if (!course.completedLessons.includes(lessonId)) {
            course.completedLessons.push(lessonId);
        }

        // Calculate progress percentage
        const courseDetails = await Course.findById(courseId);
        const totalLessons = courseDetails.content.reduce((total, module) => total + module.lessons.length, 0);
        course.progressPercentage = Math.round((course.completedLessons.length / totalLessons) * 100);

        // If the course is fully completed, move it to completedCourses
        if (course.progressPercentage === 100) {
            user.completedCourses.push(course.courseId);
        }

        await user.save();
        res.json({
            message: 'Lesson marked as complete',
            updatedCourse: course,
        });
    } catch (err) {
        console.error('Error updating progress:', err);
        res.status(500).json({ message: 'Server error', err });
    }
});

export default router;
