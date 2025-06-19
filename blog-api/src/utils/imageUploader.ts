import multer from 'multer';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

const MIME_TYPE_MAP: { [key: string]: string } = {
  'image/png': '.png',
  'image/jpeg': '.jpeg',
  'image/jpg': '.jpg',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const extension = MIME_TYPE_MAP[file.mimetype];
    if (!extension) {
      return cb(new Error('Invalid image type'), '');
    }
    cb(null, `${uuidv4()}${extension}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const isValid = !!MIME_TYPE_MAP[file.mimetype];
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const multerUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const processImage = (req: Request): Promise<Express.Multer.File | undefined> => {
  return new Promise((resolve, reject) => {
    multerUpload.single('image')(req, {} as any, (err: any) => {
      if (err) {
        return reject(err);
      }
      resolve(req.file);
    });
  });
};