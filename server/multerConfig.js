import multer from 'multer';
import path from 'path';

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
        cb(null, uploadDir); // Save the file to the determined directory
    },
    filename: (req, file, cb) => {
        // Extract the file extension and normalize it to lowercase
        const fileExt = path.extname(file.originalname).toLowerCase();
        // Generate the file name with a timestamp and sanitized original name
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
