import express from 'express';
import mongoose from 'mongoose';
import Course from '../models/Course.js';

const router = express.Router();

// Get lesson by ID
router.get('/:id', async (req, res) => {
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
