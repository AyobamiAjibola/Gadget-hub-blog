import {NextFunction, Request, Response} from 'express';
import { BAD_REQUEST, OK, RESOURCE_CREATED } from '../../../constants/response-codes';
import AppError from '../../../utils/appError';
import * as companyValidator from "./device.validator";
import db from '../../../sequelize/models';

const Company = db.ComputerCompany;
const Company_Types = db.ComputerType;
const Phone = db.PhoneCompany;
const Phone_Types = db.PhoneType;

//=================== COMPUTER COMPANY ======================//
const new_computer_company = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = companyValidator.computer_company(req.body);
        if (validate.error) {
            return next(new AppError(validate.error.message, BAD_REQUEST));
        }

        const data: any = [];
        const fetch = await Company.findAll({raw: true});
        fetch.map((value: any) => {
            data.push(value.name)
        });
        const name = req.body.name.toLowerCase();
        const bool = data.includes(name)

        !bool && await Company.create({ name });
        !bool && res.status(RESOURCE_CREATED).json({
            status: "success",
            message: "Company created successfully",
            data: null
        });

        bool && next(new AppError("Value provided is already in the database", BAD_REQUEST));

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

const delete_computer_company = async(req: Request, res: Response) => {
    try {
        await Company.destroy({where: {id: req.params.id}})
        return res.status(OK).json({
            status: "success",
            message: "Category deleted successfully",
            data: null
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

const get_computer_company = async(req: Request, res: Response) => {
    try {
        const getCat = await Company.findAll();
        return res.status(OK).json({
            status: "success",
            message: "Successful",
            data: { getCat }
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};


//=================== COMPUTER TYPE ======================//
const new_computer_type = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = companyValidator.computer_type(req.body);
        if (validate.error) {
            return next(new AppError(validate.error.message, BAD_REQUEST));
        }

        const data: any = [];
        const fetch = await Company_Types.findAll({raw: true});
        fetch.map((values: any) => {
            data.push(values.type)
        });

        const type = req.body.type.toLowerCase();
        const bool = data.includes(type);

        !bool && await Company_Types.create({type})
        !bool && res.status(RESOURCE_CREATED).json({
            status: "success",
            message: "Created successfully",
            data: null
        });

        bool && next(new AppError("Value provided is already in the database", BAD_REQUEST));

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

const delete_computer_type = async(req: Request, res: Response) => {
    try {
        await Company_Types.destroy({where: {id: req.params.id}})
        return res.status(OK).json({
            status: "success",
            message: "Deleted successfully",
            data: null
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

const get_computer_type = async(req: Request, res: Response) => {
    try {
        const getCat = await Company_Types.findAll();
        return res.status(OK).json({
            status: "success",
            message: "Successful",
            data: { getCat }
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};


//=================== PHONE COMPANY ======================//
const new_phone_company = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = companyValidator.phone_company(req.body);
        if (validate.error) {
            return next(new AppError(validate.error.message, BAD_REQUEST));
        }

        const data: any = [];
        const fetch = await Phone.findAll();
        fetch.map((value: any) => {
            data.push(value.name)
        });

        const name = req.body.name.toLowerCase();
        const bool = data.includes(name);

        !bool && await Phone.create({ name });
        !bool && res.status(RESOURCE_CREATED).json({
            status: "success",
            message: "Created successfully",
            data: null
        });

        bool && next(new AppError("Value provided is already in the database", BAD_REQUEST));

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

const delete_phone_company = async(req: Request, res: Response) => {
    try {
        await Phone.destroy({where: {id: req.params.id}})
        return res.status(OK).json({
            status: "success",
            message: "Deleted successfully",
            data: null
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

const get_phone_company = async(req: Request, res: Response) => {
    try {
        const fetch = await Phone.findAll();
        return res.status(OK).json({
            status: "success",
            message: "Successful",
            data: { fetch }
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};


//=================== PHONE TYPE ======================//
const new_phone_type = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = companyValidator.phone_type(req.body);
        if (validate.error) {
            return next(new AppError(validate.error.message, BAD_REQUEST));
        }

        const data: any = [];
        const fetch = await Phone_Types.findAll();
        fetch.map((value: any) => {
            data.push(value.type)
        });

        const type = req.body.type.toLowerCase();
        const bool = data.includes(type);

        !bool && await Phone_Types.create({type})
        !bool && res.status(RESOURCE_CREATED).json({
            status: "success",
            message: "Created successfully",
            data: null
        });

        bool && next(new AppError("Value provided is already in the database", BAD_REQUEST));

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

const delete_phone_type = async(req: Request, res: Response) => {
    try {
        await Phone_Types.destroy({where: {id: req.params.id}})
        return res.status(OK).json({
            status: "success",
            message: "Deleted successfully",
            data: null
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

const get_phone_type = async(req: Request, res: Response) => {
    try {
        const fetch = await Phone_Types.findAll();
        return res.status(OK).json({
            status: "success",
            message: "Successful",
            data: { fetch }
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export default {
    new_computer_company,
    delete_computer_company,
    get_computer_company,
    new_computer_type,
    delete_computer_type,
    get_computer_type,
    new_phone_company,
    delete_phone_company,
    get_phone_company,
    new_phone_type,
    delete_phone_type,
    get_phone_type
}