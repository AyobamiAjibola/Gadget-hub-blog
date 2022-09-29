import {NextFunction, Request, Response} from 'express';
import db from '../../sequelize/models';
import { BAD_REQUEST, NO_CONTENT, OK, RESOURCE_CREATED } from '../../constants/response-codes';
import * as computerValidator from "./computer.validator";
import AppError from '../../utils/appError';
import { resolve } from 'path';
import fs from 'fs';
import { Op, Sequelize } from 'sequelize';


const sequelize = db.sequelize;
const Computer = db.Computer;
const Computer_Types = db.ComputerType;
const Computer_Comp = db.ComputerCompany;
const Admin = db.SuperAdmin;
const User = db.User;
const Computer_image = db.ComputerPicture;
const Computer_Desc = db.DescComputer;


//============================= NEW COMPUTER =================//
const new_computer = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const validate = computerValidator.newComputer(req.body);
        if (validate.error) {
            return next(new AppError(validate.error.message, BAD_REQUEST));
        }

        const fetch_device = await Computer_Types.findOne({where: {type: req.body.type}}, {transaction});
        const fetch_brand = await Computer_Comp.findOne({where: {name: req.body.brand}}, {transaction});
        const fetch_adm = await Admin.findOne({where: {id: req.user}}, {transaction});
        const fetch_user = await User.findOne({where: {id: req.user}}, {transaction});

        const ComputerTypeId = fetch_device.dataValues.id;
        const ComputerCompanyId = fetch_brand.dataValues.id;
        console.log(req.user)
        const name = req.role === 'admin' ?
            fetch_adm.dataValues.fullName :
            fetch_user.dataValues.fullName;
        const userId = req.user;

        const new_computer = await Computer.create(
            {
                ...req.body,
                name,
                userId,
                ComputerTypeId,
                ComputerCompanyId
            },
            {transaction}
        )

        // COMPUTER IMAGES
        const ComputerId = new_computer.id;
        const filenames = req.files! as Array<Express.Multer.File>;
            const image = filenames.map(file => file.filename);

            await Computer_image.create(
                {
                    image,
                    ComputerId
                },
                {transaction}
            )

        // PHONE DESC
        await Computer_Desc.create(
            {
                ...req.body,
                ComputerId
            },
            {transaction}
        )

        await transaction.commit();
        return res.status(RESOURCE_CREATED).json({
            status: "success",
            message: "Created successfully",
            data: null
        });
    } catch (error: any) {
        if(transaction) {
            await transaction.rollback();
        }
        return next(new AppError(error.message, BAD_REQUEST));
    }
};

//================== FETCH ALL COMPUTER ===============//
const fetch_computer = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        const { q } = req.query;
        const keys = ["model"]; // coming back to this cant filter
        const search = (data: any) => {
            return data.filter((item: any) =>
                keys.some((key) => item[key].toLowerCase().includes(q))
            );
        };

        const computer = await Computer
            .findAll({
                limit: 10,
                order: [
                    ['createdAt']
                ],
                attributes: {exclude: [
                    "createdAt",
                    "updatedAt"
                ]},
                include: [
                    {
                        association: "ComputerPicture",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "DescComputer",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "ComputerType",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "ComputerCompany",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    }
                ]
            }, {transaction});

        if(computer.length === 0){
            return next(new AppError("No Content", NO_CONTENT));
        }

        const result = q ? search(computer) : computer;

        await transaction.commit();
        return res.status(OK).json({
            status: "success",
            message: "Fetch successful",
            data: { result }
        });

    } catch (error: any) {
        if(transaction) {
            await transaction.rollback();
        }
        return next(new AppError(error.message, BAD_REQUEST));
    }
};

//====================== FETCH USERS OWN COMPUTER=================//
const fetch_own_computer = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { q } = req.query;
        const keys = ["model"];
        const search = (data: any) => {
            return data.filter((item: any) =>
                keys.some((key) => item[key].toLowerCase().includes(q))
            );
        };
        const computer = await Computer
            .findAll({
                where: {userId: req.user},
                limit: 10,
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    {
                        association: "ComputerPicture",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "DescComputer",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "ComputerType",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "ComputerCompany",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    }
                ]
            }, {transaction});

        if(computer.length === 0){
            return next(new AppError("Not Content", NO_CONTENT));
        }

        const result = q ? search(computer) : computer;

        await transaction.commit();
        return res.status(OK).json({
            status: "success",
            message: "Fetch successful",
            data: { result }
        });

    } catch (error: any) {
        if(transaction) {
            await transaction.rollback();
        }
        return next(new AppError(error.message, BAD_REQUEST));
    }
};

//================ FETCH SINGLE COMPUTER ==========================//
const fetch_single_computer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const phone = await Computer
            .findOne({
                where: {id: req.params.id},
                include: [
                    {
                        association: "ComputerPicture",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "DescComputer",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "ComputerType",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "ComputerCompany",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    }
                ]
            });
        return res.status(OK).json({
            status: "success",
            message: "Fetch successful",
            data: { phone }
        });
    } catch (error: any) {
        return next(new AppError(error.message, BAD_REQUEST));
    }
};

//======================== UPDATE COMPUTER ==========================//
const update_computer = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();

        const validate = computerValidator.updateComputer(req.body);
        if (validate.error) {
            return next(new AppError(validate.error.message, BAD_REQUEST));
        }

        const type = req.body.type;
        const brand = req.body.brand;
        if(type){
            const fetch_device = await Computer_Types.findOne({where: {type: type}});
            const ComputerTypeId = fetch_device.dataValues.id;

            await Computer.update
            (
                {ComputerTypeId: ComputerTypeId},
                {where: {id: req.params.id}},
                { transaction }
            )
        }

        if(brand){
            const fetch_comp = await Computer_Comp.findOne({where: {name: brand}});
            const ComputerCompanyId = fetch_comp.dataValues.id;

            await Computer.update
            (
                {ComputerCompanyId: ComputerCompanyId},
                {where: {id: req.params.id}},
                { transaction }
            )
        }

        const updateDesc = await Computer_Desc.update
            (
                req.body,
                {where: {ComputerId: req.params.id}},
                { transaction }
            )

        const updateComputer = await Computer.update
            (
                req.body,
                {where: {id: req.params.id}},
                { transaction }
            )

        await transaction.commit();
        if(updateComputer || updateDesc){
            return res.status(OK).json({
                status: "success",
                message: "Updated successfully",
                data: null
            });
        }

    } catch (error: any) {
        if(transaction) {
            await transaction.rollback();
        }
        return next(new AppError(error.message, BAD_REQUEST));
    }
};

//======================== DELETE COMPUTER ==========================//
const delete_computer = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();

        const fetch = await Computer_image.findOne({where: {ComputerId: req.params.id}}, {transaction});
        const img = fetch.dataValues.image;
        img.map((value: any) => {
            if(value){
                fs.unlinkSync(resolve(__dirname, `../../../uploads/${value}`));
            }
        });

        await Computer_Desc.destroy({where: {ComputerId: req.params.id}}, {transaction});
        await Computer_image.destroy({where: {ComputerId: req.params.id}}, {transaction});
        await Computer.destroy({where: {id: req.params.id}}, {transaction});
        await transaction.commit();

        return res.status(OK).json({
            status: "success",
            message: "Successfully deleted",
            data: null
        });
    } catch (error: any) {
        if(transaction) {
            await transaction.rollback();
        }
        return next(new AppError(error.message, BAD_REQUEST));
    }

};

//================ DELETE JUST ONE IMAGE ====================//
const delete_picture = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();
        const rmv = '1664408440208_img5.jpg'; // front end will give me the name of the image

        if(rmv){
            fs.unlinkSync(resolve(__dirname, `../../../uploads/${rmv}`)), {transaction};
        }

        await Computer_image.update({
            'image':Sequelize.fn('array_remove', Sequelize.col('image'), rmv)},
            {where: {ComputerId: req.params.id}
        },  {transaction})

        await transaction.commit();
        return res.status(OK).json({
            status: "success",
            message: "Picture Deleted",
            data: null
        });
    } catch (error: any) {
        if(transaction) {
            await transaction.rollback();
        }
        return next(new AppError(error.message, BAD_REQUEST));
    }
};

//============ UPDATE PICTURE=============//
const update_picture = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();

        const filenames = req.files! as Array<Express.Multer.File>;
        const img = filenames.map(file => file.filename);
        const new_image: any = [];

        img.map((value) => {
            new_image.push(value)
        })
        const main_img = new_image.toString();
        await Computer_image.update(
            {'image':Sequelize.fn('array_append', Sequelize.col('image'), main_img)},
            {where: {ComputerId: req.params.id}}, {transaction});

        await transaction.commit();

        return res.status(OK).json({
            status: "success",
            message: "Picture upload successful",
            data: null
        });
    } catch (error: any) {
        if(transaction) {
            await transaction.rollback();
        }
        return next(new AppError(error.message, BAD_REQUEST));
    }
};

//==================== FETCH SINGLE COMPUTER ==========================//
const fetch_all_computer_by_admin = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        const { q } = req.query;
        const keys = ["model", "name"];
        const search = (data: any) => {
            return data.filter((item: any) =>
                keys.some((key) => item[key].toLowerCase().includes(q))
            );
        };

        const computer = await Computer
            .findAll({
                where: {
                    userId: {
                        [Op.ne]: req.user
                    }
                },
                limit: 10,
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    {
                        association: "ComputerPicture",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "DescComputer",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "ComputerType",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "ComputerCompany",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    }
                ]
            }, {transaction});

        if(computer.length === 0){
            return next(new AppError("No Content", NO_CONTENT));
        }

        const result = q ? search(computer) : computer;

        await transaction.commit();
        return res.status(OK).json({
            status: "success",
            message: "Fetch successful",
            data: { result }
        });

    } catch (error: any) {
        if(transaction) {
            await transaction.rollback();
        }
        return next(new AppError(error.message, BAD_REQUEST));
    }
};

export default {
    new_computer,
    fetch_computer,
    fetch_own_computer,
    fetch_single_computer,
    update_computer,
    delete_computer,
    delete_picture,
    update_picture,
    fetch_all_computer_by_admin
}