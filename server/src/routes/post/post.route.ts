import express from 'express';
import postController from '../../controllers/post.controller/post';
import {
    verifyUser,
    isAdmin
} from '../../middleware/authorize';
import { upload } from '../../middleware/multer';
import { validation } from '../../middleware/validation';

const images = upload.array('image', 2)

const router = express.Router();

router.post(
    '/new_post',
    verifyUser,
    images,
    postController.new_post
);

router.get(
    '/fetch_post',
    postController.fetch_post
);

router.get(
    '/fetch_single_post/:id',
    postController.fetch_single_post
);

router.get(
    '/fetch_own_post',
    verifyUser,
    postController.fetch_own_post
);

router.put(
    '/update_post/:id',
    verifyUser,
    postController.update_post
);

router.delete(
    '/delete_post/:id',
    verifyUser,
    postController.delete_post
);

router.delete(
    '/delete_picture/:id',
    verifyUser,
    postController.delete_picture
);

router.put(
    '/update_picture/:id',
    verifyUser,
    validation,
    images,
    postController.update_picture
);

router.get(
    '/fetch_all_post_not_admin',
    isAdmin,
    postController.fetch_all_post_by_admin
);

export default router