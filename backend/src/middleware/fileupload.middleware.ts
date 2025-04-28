import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Base uploads directory
const baseUploadsDir = 'uploads';

// Create uploads directory if it doesn't exist
if (!fs.existsSync(baseUploadsDir)) {
    fs.mkdirSync(baseUploadsDir, { recursive: true });
}

// Set up storage options
const storage = multer.diskStorage({
    destination: function (req: any, file: Express.Multer.File, cb: Function) {
        // Get folder name from request or use default
        const folderName = req.query.folder || 'default';
        const uploadPath = path.join(baseUploadsDir, folderName);
        
        // Create folder if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function (req: any, file: Express.Multer.File, cb: Function) {
        const filename = Date.now() + '-' + file.originalname;
        // Save the full path to access later
        const fullPath = path.join(baseUploadsDir, req.query.folder || 'default', filename);
        (file as any).fullPath = fullPath;
        cb(null, filename);
    }
});

// Initialize multer with storage options
export const uploadFiles = (maxCount: number) => multer({ storage: storage }).array('files', maxCount);