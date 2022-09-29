import {NextFunction, Request, Response} from 'express';
import db from '../../sequelize/models';
import { BAD_REQUEST, NO_CONTENT, OK, RESOURCE_CREATED } from '../../constants/response-codes';
import * as phoneValidator from "./phone.validator";
import AppError from '../../utils/appError';
import { resolve } from 'path';
import fs from 'fs';
import { Op, Sequelize } from 'sequelize';


const sequelize = db.sequelize;
const Phone = db.Phone;
const Phone_Types = db.PhoneType;
const Phone_Comp = db.PhoneCompany;
const Admin = db.SuperAdmin;
const User = db.User;
const Phone_image = db.PhonePicture;
const Phone_Desc = db.DescPhone;


//============================= NEW PHONE =================//
const new_phone = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const validate = phoneValidator.newPhone(req.body);
        if (validate.error) {
            return next(new AppError(validate.error.message, BAD_REQUEST));
        }

        const fetch_device = await Phone_Types.findOne({where: {type: req.body.deviceType}}, {transaction});
        const fetch_brand = await Phone_Comp.findOne({where: {name: req.body.brand}}, {transaction});
        const fetch_adm = await Admin.findOne({where: {id: req.user}}, {transaction});
        const fetch_user = await User.findOne({where: {id: req.user}}, {transaction});

        const PhoneTypeId = fetch_device.dataValues.id;
        const PhoneCompanyId = fetch_brand.dataValues.id;
        const name = req.role === 'admin' ?
            fetch_adm.dataValues.fullName :
            fetch_user.dataValues.fullName;
        const userId = req.user;

        const new_phone = await Phone.create(
            {
                ...req.body,
                name,
                userId,
                PhoneTypeId,
                PhoneCompanyId
            },
            {transaction}
        )

        // PHONE IMAGES
        const PhoneId = new_phone.id;
        const filenames = req.files! as Array<Express.Multer.File>;
            const image = filenames.map(file => file.filename);

            await Phone_image.create(
                {
                    image,
                    PhoneId
                },
                {transaction}
            )

        // PHONE DESC
        await Phone_Desc.create(
            {
                ...req.body,
                PhoneId
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

//================== FETCH ALL PHONES ===============//
const fetch_phone = async (req: Request, res: Response, next: NextFunction) => {
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

        const phone = await Phone
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
                        association: "PhonePicture",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "DescPhone",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "PhoneType",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "PhoneCompany",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    }
                ]
            }, {transaction});

        if(phone.length === 0){
            return next(new AppError("No Content", NO_CONTENT));
        }

        const result = q ? search(phone) : phone;

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

//====================== FETCH USERS OWN PHONE=================//
const fetch_own_phone = async (req: Request, res: Response, next: NextFunction) => {
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
        const phone = await Phone
            .findAll({
                where: {userId: req.user},
                limit: 10,
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    {
                        association: "PhonePicture",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "DescPhone",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "PhoneType",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "PhoneCompany",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    }
                ]
            }, {transaction});

        if(phone.length === 0){
            return next(new AppError("Not Content", NO_CONTENT));
        }

        const result = q ? search(phone) : phone;

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

//================ FETCH SINGLE PHONE ==========================//
const fetch_single_phone = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const phone = await Phone
            .findOne({
                where: {id: req.params.id},
                include: [
                    {
                        association: "PhonePicture",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "DescPhone",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "PhoneType",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "PhoneCompany",
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

//======================== UPDATE PHONE ==========================//
const update_phone = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();

        const validate = phoneValidator.updatePhone(req.body);
        if (validate.error) {
            return next(new AppError(validate.error.message, BAD_REQUEST));
        }

        const device_type = req.body.deviceType;
        const brand = req.body.brand;
        if(device_type){
            const fetch_device = await Phone_Types.findOne({where: {type: device_type}});
            const PhoneTypeId = fetch_device.dataValues.id;

            await Phone.update
            (
                {PhoneTypeId: PhoneTypeId},
                {where: {id: req.params.id}},
                { transaction }
            )
        }

        if(brand){
            const fetch_comp = await Phone_Comp.findOne({where: {name: brand}});
            const PhoneCompanyId = fetch_comp.dataValues.id;

            await Phone.update
            (
                {PhoneCompanyId: PhoneCompanyId},
                {where: {id: req.params.id}},
                { transaction }
            )
        }

        const updateDesc = await Phone_Desc.update
            (
                req.body,
                {where: {PhoneId: req.params.id}},
                { transaction }
            )

        const updatePhone = await Phone.update
            (
                req.body,
                {where: {id: req.params.id}},
                { transaction }
            )

        await transaction.commit();
        if(updatePhone || updateDesc){
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

//======================== DELETE PHONE ==========================//
const delete_phone = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();

        const fetch = await Phone_image.findOne({where: {PhoneId: req.params.id}}, {transaction});
        const img = fetch.dataValues.image;
        img.map((value: any) => {
            if(value){
                fs.unlinkSync(resolve(__dirname, `../../../uploads/${value}`));
            }
        });

        await Phone_image.destroy({where: {PhoneId: req.params.id}}, {transaction});
        await Phone.destroy({where: {id: req.params.id}}, {transaction});
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
        const rmv = '1664317102928_img4.jpg'; // front end will give me the name of the image

        if(rmv){
            fs.unlinkSync(resolve(__dirname, `../../../uploads/${rmv}`)), {transaction};
        }

        await Phone_image.update({
            'image':Sequelize.fn('array_remove', Sequelize.col('image'), rmv)},
            {where: {PhoneId: req.params.id}
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
        await Phone_image.update(
            {'image':Sequelize.fn('array_append', Sequelize.col('image'), main_img)},
            {where: {PhoneId: req.params.id}}, {transaction});

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

//==================== FETCH SINGLE PHONE ==========================//
const fetch_all_phone_by_admin = async (req: Request, res: Response, next: NextFunction) => {
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

        const phone = await Phone
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
                        association: "PhonePicture",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "DescPhone",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "PhoneType",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    },
                    {
                        association: "PhoneCompany",
                        attributes: {exclude: [
                            "createdAt",
                            "updatedAt",
                            "id"
                        ]}
                    }
                ]
            }, {transaction});

        if(phone.length === 0){
            return next(new AppError("No Content", NO_CONTENT));
        }

        const result = q ? search(phone) : phone;

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
    new_phone,
    fetch_phone,
    fetch_own_phone,
    fetch_single_phone,
    update_phone,
    delete_phone,
    delete_picture,
    update_picture,
    fetch_all_phone_by_admin
}