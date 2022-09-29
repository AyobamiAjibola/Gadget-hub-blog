import {NextFunction, Request, Response} from 'express';
import { jwtGenerator } from '../../utils/jwtGenerator';
import db from '../../sequelize/models';
import { BAD_REQUEST, OK } from '../../constants/response-codes';
import AppError from '../../utils/appError';
import { verifyBcryptPassword } from '../../utils/auth';

const Admin = db.SuperAdmin;
const User = db.User;
const Type = db.UserType;
const sequelize = db.sequelize;

//============================================= ADMIN ========================================//
const login_admin = async (req: Request, res: Response, next: NextFunction) => {

    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { email, password } = req.body;
        const user = await Admin.findOne({where: {email}}, { transaction });
        const role = await Type.findOne({where: {id: user.dataValues.userTypeId}}, { transaction });
        if(!user) {
            return next(new AppError("Invalid Credential Email", BAD_REQUEST));
        }

        const isMatch = verifyBcryptPassword(password, user.password);
        if(!isMatch){
            return next(new AppError("Invalid Credential Password", BAD_REQUEST));
        }

        await transaction.commit();
        const token =
            jwtGenerator(
                user.id,
                user.isAdmin,
                role.dataValues.userType
            );
        res.status(OK).json({
            status: "success",
            message: "Login successful",
            data: {
                token,
                user: {
                    email: user.email
                }
            }
        });
    } catch (error: any) {
        res.status(400).send(error.message);
        if(transaction) {
            await transaction.rollback();
        }
    }
};

const login_user = async (req: Request, res: Response, next: NextFunction) => {

    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { email, password } = req.body
        const user = await User.findOne({where: {email}}, { transaction });
        const role = await Type.findOne({where: {id: user.dataValues.userTypeId}}, { transaction });
        if(!user) {
            return next(new AppError("Invalid Credential Email", BAD_REQUEST));
        }

        const isMatch = verifyBcryptPassword(password, user.password);
        if(!isMatch){
            return next(new AppError("Invalid Credential Password", BAD_REQUEST));
        }

        await transaction.commit();
        const token =
            jwtGenerator(
                user.id,
                user.isAdmin,
                role.dataValues.userType
            );
        res.status(OK).json({
            status: "success",
            message: "Login successful",
            data: {
                token,
                user: {
                    email: user.email
                }
            }
        });
    } catch (error: any) {
        res.status(400).send(error.message);
        if(transaction) {
            await transaction.rollback();
        }
    }
}

//==================================== VERIFY =================================//
const verify = async (req: Request, res: Response) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        if(req.role === 'admin'){
            const user = await Admin.findOne
            ({where: { id: req.user, isAdmin: req.admin, role: req.role }}, { transaction });

            await transaction.commit();
            return res.status(OK).json({
            status: "success",
            message: `Verified user '${user.role.toUpperCase()}'`,
            data: {
                user: {
                    id: user.id,
                    isAdmin: user.isAdmin,
                    role: user.role
                }
            }
        });
        } else {
            const user = await User.findOne
            ({where: { id: req.user, isAdmin: req.admin, role: req.role }}, { transaction });

            await transaction.commit();
            return res.status(OK).json({
            status: "success",
            message: `Verified user '${user.role.toUpperCase()}'`,
            data: {
                user: {
                    id: user.id,
                    isAdmin: user.isAdmin,
                    role: user.role
                }
            }
        });
        }
    } catch (error: any) {
        res.status(BAD_REQUEST).send(error.message)
        if(transaction) {
            await transaction.rollback();
        }
    }
};

export default {
    verify,
    login_admin,
    login_user,
}