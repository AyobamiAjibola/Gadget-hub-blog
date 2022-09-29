import {NextFunction, Request, Response} from 'express';
import { BAD_REQUEST, OK, RESOURCE_CREATED } from '../../../constants/response-codes';
import AppError from '../../../utils/appError';
import * as roleValidator from "./usertype.validator";
import db from '../../../sequelize/models';

const Roles = db.UserType;

const new_role = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = roleValidator.userRoles(req.body);
        if (validate.error) {
            return next(new AppError(validate.error.message, BAD_REQUEST));
        }

        const newRole = await Roles.create(req.body)
        return res.status(RESOURCE_CREATED).json({
            status: "success",
            message: "User type created successfully",
            data: { newRole }
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

const delete_role = async(req: Request, res: Response) => {
    try {
        await Roles.destroy({where: {id: req.params.id}})
        return res.status(OK).json({
            status: "success",
            message: "Category deleted successfully",
            data: null
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

const get_roles = async(req: Request, res: Response) => {
    try {
        const getCat = await Roles.findAll()
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
    new_role,
    delete_role,
    get_roles
}