import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

const badgeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/badges'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}${ext}`);
  }
});

const badgeFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image format. Only PNG, JPG, and JPEG are allowed'));
  }
};

export const badgeUpload = multer({
  storage: badgeStorage,
  fileFilter: badgeFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});


export const profile_pictureUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, JPEG, or PNG files are allowed"));
    }
    cb(null, true);
  },
});