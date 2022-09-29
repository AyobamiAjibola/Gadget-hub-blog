import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from '../constants/response-codes';
import db from '../sequelize/models';
import AppError from '../utils/appError';

const Post_image = db.Picture;
const Phone_image = db.PhonePicture;
const Computer_image = db.ComputerPicture;

export const validation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fetch = await Post_image.findOne({where: {postId: req.params.id}})
        const check_img_len = fetch.dataValues.image.length;

        if(check_img_len === 2){
            return next(new AppError("Maximum number of image exceeded", BAD_REQUEST));
        }
    } catch (error: any) {
        res.send(error.message)
    }

    next()
};

export const validation_phone = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fetch = await Phone_image.findOne({where: {PhoneId: req.params.id}})
        const check_img_len = fetch.dataValues.image.length;

        if(check_img_len === 2){
            return next(new AppError("Maximum number of image exceeded", BAD_REQUEST));
        }
    } catch (error: any) {
        res.send(error.message)
    }

    next()
};

export const validation_computer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fetch = await Computer_image.findOne({where: {ComputerId: req.params.id}})
        const check_img_len = fetch.dataValues.image.length;

        if(check_img_len === 2){
            return next(new AppError("Maximum number of image exceeded", BAD_REQUEST));
        }
    } catch (error: any) {
        res.send(error.message)
    }

    next()
}