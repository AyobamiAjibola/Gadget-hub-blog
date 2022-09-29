import {NextFunction, Request, Response} from 'express';
import { jwtGenerator } from '../../utils/jwtGenerator';
import db from '../../sequelize/models';
import { BAD_REQUEST, OK, RESOURCE_CREATED } from '../../constants/response-codes';
import * as userValidator from "./user.validator";
import AppError from '../../utils/appError';
import { hash } from '../../utils/auth';

const Admin = db.SuperAdmin;
const User = db.User;
const Type = db.UserType;
const sequelize = db.sequelize;

//==================== CREATE ADMIN ==================//
const register_admin = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const userT = req.body.role;
        const user_type = await Type.findOne({where: {userType: userT}}, { transaction });

        if(userT === 'admin') {
            const validate = userValidator.postAdmin(req.body);
            if (validate.error) {
                return next(new AppError(validate.error.message, BAD_REQUEST));
            }

            const role = userT;
            const {email} = req.body;
            const userTypeId = user_type.dataValues.id;
            const user = await Admin.findOne({where: {email}}, { transaction });
            if(user){
                return next(new AppError("Email already in use", BAD_REQUEST));
            }

            const hashPass = hash(req.body.password);
            const hashConfirmPass = hash(req.body.confirmPassword);
            const newUser = await Admin.create(
                {
                    ...req.body,
                    role,
                    email,
                    password: hashPass,
                    confirmPassword: hashConfirmPass,
                    userTypeId
                },
                { transaction });

            await transaction.commit();
            const token = jwtGenerator(
                newUser.id,
                newUser.isAdmin,
                req.body.role
                );
            return res.status(RESOURCE_CREATED).json({
                status: "success",
                message: "User created successfully",
                data: { token }
            });
        }
    } catch (error: any) {
        res.status(400).send(error.message);
        if(transaction) {
            await transaction.rollback();
        }
    }
};

//====================== CREATE USERS =======//
const register_user = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const userT = req.body.role;
        const user_type = await Type.findOne({where: {userType: userT}}, { transaction });

        if(userT !== 'admin') {
            const validate = userValidator.postUser(req.body);
            if (validate.error) {
                return next(new AppError(validate.error.message, BAD_REQUEST));
            }

            const {email} = req.body;
            const userTypeId = user_type && user_type.dataValues.id;
            const user = await User.findOne({where: {email}}, { transaction });
            if(user){
                return next(new AppError("Email already in use", BAD_REQUEST));
            }

            const hashPass = hash(req.body.password)
            const hashConfirmPass = hash(req.body.confirmPassword)
            const newUser = await User.create(
                {
                    ...req.body,
                    email,
                    password: hashPass,
                    confirmPassword: hashConfirmPass,
                    userTypeId
                },
                { transaction });

            await transaction.commit();
            const token = jwtGenerator(
                newUser.id,
                newUser.isAdmin,
                req.body.role
                );
            return res.status(RESOURCE_CREATED).json({
                status: "success",
                message: "User created successfully",
                data: { token }
            });
        }
    } catch (error: any) {
        res.status(BAD_REQUEST).send(error.message);
        if(transaction) {
            await transaction.rollback();
        }
    }
};

//========= UPDATE USER =======//
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();

        if(req.role === 'admin'){
            const validate = userValidator.updateUser(req.body);
            if (validate.error) {
                return next(new AppError(validate.error.message, BAD_REQUEST));
            }

            if(req.body.password || req.body.confirmPassword){
                req.body.password = hash(req.body.password)
                req.body.confirmPassword = hash(req.body.confirmPassword)
            }

            const {
                email,
                password,
                confirmPassword
            } = req.body;

            //check if email exist in db
            const fetch = await Admin.findByPk(req.user, { transaction })
            const user = await Admin.findOne({where: {email}}, { transaction });
            if(user && user.dataValues.email !== fetch.dataValues.email){
                return next(new AppError("Email already exist", BAD_REQUEST));
            }

            const updateUser = await Admin.update(
                {
                    ...req.body,
                    password,
                    confirmPassword,
                },
                {where: { id: req.user }},
                { transaction }
            )
            await transaction.commit();
            if(updateUser){
                return res.status(OK).json({
                    status: "success",
                    message: "Updated successfully",
                    data: null
                });
            }
        } else {
            const validate = userValidator.updateUser(req.body);
            if (validate.error) {
                return next(new AppError(validate.error.message, BAD_REQUEST));
            }

            if(req.body.password || req.body.confirmPassword){
                req.body.password = hash(req.body.password)
                req.body.confirmPassword = hash(req.body.confirmPassword)
            }

            const {
                email,
                password,
                confirmPassword
            } = req.body;

            //check if email exist in db
            const fetch = await User.findByPk(req.user, { transaction })
            const user = await User.findOne({where: {email}}, { transaction });
            if(user && user.dataValues.email !== fetch.dataValues.email){
                return next(new AppError("Email already exist", BAD_REQUEST));
            }
            const updateUser = await User.update(
                {
                    ...req.body,
                    password,
                    confirmPassword
                },
                {where: { id: req.user }},
                { transaction }
                )
            await transaction.commit();
            if(updateUser){
                return res.status(OK).json({
                    status: "success",
                    message: "Updated successfully",
                    data: null
                });
            }
        }
    } catch (error: any) {
        res.status(BAD_REQUEST).send(error.message);
        if(transaction) {
            await transaction.rollback();
        }
    }
};

//========= GET CURRENT USER =======//
const single_user = async (req: Request, res: Response) => {
    try {

        if(req.role === 'admin'){
            const user = await Admin.findOne({where: {id: req.user}});

            return res.status(OK).json({
                status: "success",
                message: "Fetch successful",
                data: { user }
            });
        } else {
            const user = await User.findOne({where: {id: req.user}});

            return res.status(OK).json({
                status: "success",
                message: "Fetch successful",
                data: { user }
            });
        }
    } catch (error: any) {
        res.status(BAD_REQUEST).send(error.message);
    }
};

//=============== DELETE USER =======================//
const delete_user = async (req: Request, res: Response) => {
    try {

        await User.destroy({where: {id: req.params.id}});

        return res.status(OK).json({
            status: "success",
            message: "Account successfully deleted",
            data: null
        });
    } catch (error: any) {
        res.status(BAD_REQUEST).send(error.message);
    }
};

//========= GET ALL THE USERS =======//
const fetch_users = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        const keys = ["fullName", "role"];
        const search = (data: any) => {
            return data.filter((item: any) =>
                keys.some((key) => item[key].toLowerCase().includes(q))
            );
        };
        const user = await User
            .findAll({
                limit: 10,
                order: [
                    ['createdAt', 'DESC']
                ]
            })
        const result = q ? search(user) : user
        return res.status(OK).json({
            status: "success",
            message: "Fetch successful",
            data: { result }
        });
    } catch (error: any) {
        res.status(BAD_REQUEST).send(error.message);
    }
};

export default {
    register_admin,
    register_user,
    single_user,
    updateUser,
    delete_user,
    fetch_users
}
