import mongoose from 'mongoose';
import User from './models/User.js'; // Adjust the path to your User model

mongoose.connect('mongodb://localhost:27017/your_database_name', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const updateEnrolledCourses = async () => {
    try {
        const users = await User.find({});

        for (const user of users) {
            // Transform enrolledCourses into the correct structure
            const updatedCourses = user.enrolledCourses.map((id) => ({
                courseId: id, // Move the ObjectId to courseId
                progress: 0, // Default progress
            }));

            user.enrolledCourses = updatedCourses; // Update the field
            await user.save(); // Save changes
            console.log(`Updated enrolledCourses for user: ${user.email}`);
        }

        console.log('Database update complete.');
    } catch (err) {
        console.error('Error updating database:', err);
    } finally {
        mongoose.disconnect();
    }
};

updateEnrolledCourses();
