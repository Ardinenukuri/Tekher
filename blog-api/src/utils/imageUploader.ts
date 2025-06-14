import multer, { Multer } from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req: any, _file: any, cb: (arg0: null, arg1: string) => void) {
    cb(null, 'uploads/'); 
  },
  filename: function (req: any, file: { originalname: string }, cb: (arg0: null, arg1: string) => void) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});


const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};


const limits = {
  fileSize: 5 * 1024 * 1024,
};


export const upload = multer({
  storage,
  fileFilter,
  limits,
});


export const uploadImage = async (file: Express.Multer.File) => {
  try {
  
    const destinationPath = `uploads/${file.filename}`;
    


    return destinationPath; 
  } catch (err) {
    console.error('Error uploading image:', err);
    throw err;
  }
};