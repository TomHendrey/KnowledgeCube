import 'dotenv/config'; // Load environment variables from .env file (ES6 import)
import mongoose from 'mongoose'; // ES6 import for mongoose

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Exit the process if connection fails
    }
};

export default connectDB;
