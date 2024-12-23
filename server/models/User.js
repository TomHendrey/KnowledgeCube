// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['learner', 'creator'],
        default: 'learner',
    },
    enrolledCourses: [
        {
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course', // Reference to the Course model
                required: true,
            },
            progressPercentage: {
                type: Number,
                default: 0, // Default progress at 0%
            },
            completedLessons: {
                type: [String],
                default: [],
            },
            lastAccessed: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    profilePicture: {
        type: String,
        default: 'default-profile.jpg',
    },
    bio: {
        type: String,
        maxlength: 500,
    },
});

// Hash password before saving user document
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash if password is modified or new
    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next(); // Continue saving the document
    } catch (err) {
        next(err); // If error, pass it to next middleware
    }
});

const User = mongoose.model('User', userSchema);

export default User;
