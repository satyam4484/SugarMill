import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Check if uploads directory exists, if not create it
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up storage options
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + '-' + file.originalname;
        // Attach the full path to the file object
        file.path = path.join(uploadsDir, filename);
        cb(null, filename);
    }
});

// Initialize multer with storage options
export const uploadFiles = (maxCount: number) => multer({ storage: storage }).array('files', maxCount);