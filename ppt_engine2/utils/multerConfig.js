import multer from "multer";
import path from "path"

export const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 25 * 1024 * 1024, // 25 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = /jpeg|jpg|png|webp|ico/;
        const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedFileTypes.test(file.mimetype);
        if (extension && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG and WebP images are allowed.'))
        }
    }
})

export const iconUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = /svg|jpeg|png|webp|jpg|ico/;
        const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedFileTypes.test(file.mimetype)
        if (extension && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only SVG, PNG, JPG, WebP and ICO images are allowed.'))
        }
    }
})