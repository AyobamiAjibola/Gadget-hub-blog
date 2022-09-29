import express from 'express';
import userController from '../../controllers/user.controller/user';
import {isAdmin, verifyUser} from '../../middleware/authorize';

const router = express.Router();

//=============================== REGISTRATION =================================//
router.post(
    '/register_admin',
    userController.register_admin
);

router.post(
    '/register_user',
    isAdmin,
    userController.register_user
);

router.get(
    '/current_user',
    verifyUser,
    userController.single_user
);

router.put(
    '/update_user',
    verifyUser,
    userController.updateUser
);

router.delete(
    '/delete_user/:id',
    isAdmin,
    userController.delete_user
);

router.get(
    '/fetch_users',
    isAdmin,
    userController.fetch_users
);

export default router;