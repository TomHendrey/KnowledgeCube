import express from 'express';
import { uploadFile } from '../multerConfig.js'; // Import multer configuration
const router = express.Router();

// Route to handle image upload
router.post('/upload-image', uploadFile.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded.' });
    }
    // Send the file path as part of the response
    res.status(200).json({ message: 'Image uploaded successfully', filePath: req.file.path });
});

export default router;
