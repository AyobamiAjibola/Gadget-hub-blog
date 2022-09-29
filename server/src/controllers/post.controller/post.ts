import {NextFunction, Request, Response} from 'express';
import db from '../../sequelize/models';
import { BAD_REQUEST, NO_CONTENT, OK, RESOURCE_CREATED } from '../../constants/response-codes';
import * as postValidator from "./post.validators";
import AppError from '../../utils/appError';
import { resolve } from 'path';
import fs from 'fs';
import { Op, Sequelize } from 'sequelize';

const Post = db.Post;
const Post_image = db.Picture;
const Admin = db.SuperAdmin;
const User = db.User;
const Categories = db.Category;
const sequelize = db.sequelize;


//========================= CREATE POST ==============//
const new_post = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const validate = postValidator.newPost(req.body);
        if (validate.error) {
            return next(new AppError(validate.error.message, BAD_REQUEST));
        }

        if(req.role === 'admin'){
            const fetch = await Admin.findOne({where: {id: req.user}}, {transaction});
            if(fetch.dataValues.userTypeId === null){
                return next(new AppError("User role is not assigned", BAD_REQUEST));
            }

            const userId = req.user;
            const name = fetch.dataValues.fullName
            const catT = req.body.category;
            const category_type = await Categories.findOne({where: {category: catT}});
            const categoryId = category_type.dataValues.id;

            const newPost = await Post.create(
                {
                    ...req.body,
                    name,
                    userId,
                    categoryId
                },
                {transaction}
            )

            const postId = newPost.id;
            const filenames = req.files! as Array<Express.Multer.File>;
            const image = filenames.map(file => file.filename);

            await Post_image.create(
                {
                    image,
                    postId
                },
                {transaction}
            )
        } else {
            const fetch = await User.findOne({where: {id: req.user}}, {transaction});
            if(fetch.dataValues.userTypeId === null){
                return next(new AppError("User role is not assigned", BAD_REQUEST));
            }

            const userId = req.user;
            const name = fetch.dataValues.fullName
            const catT = req.body.category;
            const category_type = await Categories.findOne({where: {category: catT}});
            const categoryId = category_type && category_type.dataValues.id;

            const newPost = await Post.create(
                {
                    ...req.body,
                    name,
                    userId,
                    categoryId
                },
                {transaction}
            )

            const postId = newPost.id;
            const filenames = req.files! as Array<Express.Multer.File>;
            const image = filenames.map(file => file.filename);

            await Post_image.create(
                {
                    image,
                    postId
                },
                {transaction}
            )
        }

        await transaction.commit();
        return res.status(RESOURCE_CREATED).json({
            status: "success",
            message: "Post created successfully",
            data: null
        });

    } catch (error: any) {
        res.status(400).send(error.message);
        if(transaction) {
            await transaction.rollback();
        }
    }
};

//================== FETCH ALL POSTS ===============//
const fetch_post = async (req: Request, res: Response) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        const { q } = req.query;
        const keys = ["title", "category"]; // use drop down for category
        const search = (data: any) => {
            return data.filter((item: any) =>
                keys.some((key) => item[key].toLowerCase().includes(q))
            );
        };
        const post = await Post
            .findAll({
                limit: 10,
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    {
                        association: "Pictures",
                        attributes: ["id", "image", "PostId"]
                    }
                ]
            }, {transaction});

        const result = q ? search(post) : post;

        await transaction.commit();
        return res.status(OK).json({
            status: "success",
            message: "Fetch successful",
            data: { result }
        });

    } catch (error: any) {
        res.status(400).send(error.message);
        if(transaction) {
            await transaction.rollback();
        }
    }
};

//====================== FETCH USERS OWN POSTS=================//
const fetch_own_post = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { q } = req.query;
        const keys = ["title"];
        const search = (data: any) => {
            return data.filter((item: any) =>
                keys.some((key) => item[key].toLowerCase().includes(q))
            );
        };
        const post = await Post
            .findAll({
                where: {userId: req.user},
                limit: 10,
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    {
                        association: "Pictures",
                        attributes: ["id", "image", "PostId"]
                    }
                ]
            }, {transaction});

        if(post.length === 0){
            return next(new AppError("No post available at the moment", NO_CONTENT));
        }

        const result = q ? search(post) : post;

        await transaction.commit();
        return res.status(OK).json({
            status: "success",
            message: "Fetch successful",
            data: { result }
        });

    } catch (error: any) {
        res.status(400).send(error.message);
        if(transaction) {
            await transaction.rollback();
        }
    }
};


//================ FETCH SINGLE POST ==========================//
const fetch_single_post = async (req: Request, res: Response) => {
    try {
        const post = await Post
            .findOne({
                where: {id: req.params.id},
                include: [{
                    association: "Pictures",
                    attributes: ["id", "image", "PostId"]
                }]
            });
        return res.status(OK).json({
            status: "success",
            message: "Fetch successful",
            data: { post }
        });
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

//======================== UPDATE POST ==========================//
const update_post = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;

        try {
            transaction = await sequelize.transaction();

            const validate = postValidator.updatePost(req.body);
            if (validate.error) {
                return next(new AppError(validate.error.message, BAD_REQUEST));
            }

            const updatePost = await Post.update
                (
                    req.body,
                    {where: {id: req.params.id}},
                    { transaction }
                )

            await transaction.commit();
            if(updatePost){
                return res.status(OK).json({
                    status: "success",
                    message: "Updated successfully",
                    data: null
                });
            }

        } catch (error: any) {
            res.status(BAD_REQUEST).send(error.message);
            if(transaction) {
                await transaction.rollback();
            }
        }
    };

//======================== DELETE POST ==========================//
const delete_post = async (req: Request, res: Response) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();

        const fetch = await Post_image.findOne({where: {postId: req.params.id}}, {transaction});
        const img = fetch.dataValues.image;
        img.map((value: any) => {
            if(value){
                fs.unlinkSync(resolve(__dirname, `../../../uploads/${value}`));
            }
        });

        await Post.destroy({where: {id: req.params.id}}, {transaction});
        await transaction.commit();

        return res.status(OK).json({
            status: "success",
            message: "Post successfully deleted",
            data: null
        });
    } catch (error: any) {
        res.status(BAD_REQUEST).send(error.message);
        if(transaction) {
            await transaction.rollback();
        }
    }

};

//================ DELETE JUST ONE IMAGE ====================//
const delete_picture = async (req: Request, res: Response) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();
        const rmv = '1664061223122_images.jpg'; // front end will give me the name of the image

        if(rmv){
            fs.unlinkSync(resolve(__dirname, `../../../uploads/${rmv}`)), {transaction};
        }

        await Post_image.update({
            'image':Sequelize.fn('array_remove', Sequelize.col('image'), rmv)},
            {where: {postId: req.params.id}
        },  {transaction})

        // await Post_image.destroy({
        //     where: {
        //         image: {
        //             [Op.contains]: rmv
        //         }
        //     }
        // })

        await transaction.commit();
        return res.status(OK).json({
            status: "success",
            message: "Picture Deleted",
            data: null
        });
    } catch (error: any) {
        res.status(BAD_REQUEST).send(error.message);
        if(transaction) {
            await transaction.rollback();
        }
    }
};

//============ UPDATE PICTURE=============//
const update_picture = async (req: Request, res: Response) => {
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
        await Post_image.update(
            {'image':Sequelize.fn('array_append', Sequelize.col('image'), main_img)},
            {where: {postId: req.params.id}}, {transaction});

        await transaction.commit();

        return res.status(OK).json({
            status: "success",
            message: "Picture upload successful",
            data: null
        });
    } catch (error: any) {
        res.status(BAD_REQUEST).send(error.message);
        if(transaction) {
            await transaction.rollback();
        }
    }
};

//==================== FETCH SINGLE POST ==========================//
const fetch_all_post_by_admin = async (req: Request, res: Response, next: NextFunction) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        const { q } = req.query;
        const keys = ["title", "name"];
        const search = (data: any) => {
            return data.filter((item: any) =>
                keys.some((key) => item[key].toLowerCase().includes(q))
            );
        };

        const post = await Post
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
                        association: "Pictures",
                        attributes: ["id", "image", "PostId"]
                    }
                ]
            }, {transaction});

        if(post.length === 0){
            return next(new AppError("No post available at the moment", NO_CONTENT));
        }

        const result = q ? search(post) : post;

        await transaction.commit();
        return res.status(OK).json({
            status: "success",
            message: "Fetch successful",
            data: { result }
        });

    } catch (error: any) {
        res.status(400).send(error.message);
        if(transaction) {
            await transaction.rollback();
        }
    }
};

export default {
    new_post,
    fetch_post,
    fetch_single_post,
    update_post,
    fetch_own_post,
    delete_post,
    delete_picture,
    update_picture,
    fetch_all_post_by_admin
}