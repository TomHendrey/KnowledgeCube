import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define storage location for files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir;

        if (file.mimetype.startsWith('image/')) {
            uploadDir = '/uploads/images'; // Persistent disk path for images
        } else if (file.mimetype === 'application/pdf') {
            uploadDir = '/uploads/pdfs'; // Persistent disk path for PDFs
        } else if (file.mimetype.startsWith('video/')) {
            uploadDir = '/uploads/videos'; // Persistent disk path for videos
        } else {
            return cb(new Error('Unsupported file type.'));
        }

        // Ensure the directory exists (redundant, but a safety net)
        fs.mkdir(uploadDir, { recursive: true }, (err) => {
            if (err) {
                return cb(err); // Handle error if directory creation fails
            }
            cb(null, uploadDir);
        });
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname).toLowerCase();
        const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_').replace(fileExt, '')}${fileExt}`;
        cb(null, fileName);
    },
});

// Define file filter to allow only images, PDFs, and videos
const uploadFile = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype.startsWith('image/') ||
            file.mimetype === 'application/pdf' ||
            file.mimetype.startsWith('video/')
        ) {
            cb(null, true);
        } else {
            cb(new Error('Only image, PDF, and video files are allowed.'));
        }
    },
});

export { uploadFile };
