import {NextFunction, Request, Response} from 'express';
import { BAD_REQUEST, OK, RESOURCE_CREATED } from '../../../constants/response-codes';
import AppError from '../../../utils/appError';
import * as categoryValidator from "./category.validator";
import db from '../../../sequelize/models';

const Category = db.Category;

const new_cat = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = categoryValidator.category(req.body);
        if (validate.error) {
            return next(new AppError(validate.error.message, BAD_REQUEST));
        }

        const newCat = await Category.create(req.body)
        return res.status(RESOURCE_CREATED).json({
            status: "success",
            message: "Category created successfully",
            data: { newCat }
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

const delete_cat = async(req: Request, res: Response) => {
    try {
        await Category.destroy({where: {id: req.params.id}})
        return res.status(OK).json({
            status: "success",
            message: "Category deleted successfully",
            data: null
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

const get_cat = async(req: Request, res: Response) => {
    try {
        const getCat = await Category.findAll();
        return res.status(OK).json({
            status: "success",
            message: "Successful",
            data: { getCat }
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};


export default {
    new_cat,
    delete_cat,
    get_cat
}