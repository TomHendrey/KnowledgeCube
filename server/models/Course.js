import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        image: { type: String, required: false }, // Course cover image path

        // Modules and Lessons
        modules: [
            {
                moduleTitle: { type: String, required: true },
                moduleDescription: { type: String, required: false },
                lessons: [
                    {
                        lessonTitle: { type: String, required: true },
                        lessonDescription: { type: String, required: false },
                        lessonContent: { type: String, required: false },
                        images: [
                            {
                                type: String, // Each image will be stored as a file path
                                required: false,
                            },
                        ],
                        pdf: { type: String, required: false }, // Path to lesson PDF
                        video: { type: String, required: false }, // Path to uploaded video file
                        quiz: [
                            {
                                question: { type: String, required: true },
                                options: [{ type: String, required: true }],
                                correctAnswer: { type: String, required: true },
                            },
                        ],
                        // // Add Lesson links here
                        links: [
                            {
                                title: { type: String, required: false },
                                url: { type: String, required: false },
                            },
                        ],
                    },
                ],
            },
        ],

        // Global Links Section
        links: [
            {
                title: { type: String, required: false },
                url: { type: String, required: false },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model('Course', CourseSchema);
