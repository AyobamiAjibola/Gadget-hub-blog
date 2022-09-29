import { Request } from 'express';
import multer from 'multer';
import { BAD_REQUEST } from '../constants/response-codes';
import AppError from '../utils/appError';

const fileStorage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '_' + file.originalname);
    },
  });

  const fileFilter = (req: Request, files: any, cb: any) => {
    if(
      files.mimetype === 'image/jpeg' ||
      files.mimetype === 'image/jpg' ||
      files.mimetype === 'image/png')
      {
        cb(null, true);
    }else{
        cb(new AppError('One or both image types not supported', BAD_REQUEST));
    }

  };

  export const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: {fileSize: 1024 * 1024 * 2}
  });
