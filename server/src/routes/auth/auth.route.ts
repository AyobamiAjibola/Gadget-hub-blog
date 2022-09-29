import express from 'express';
import authController from '../../controllers/authController/auth';
import {
    verifyUser
} from '../../middleware/authorize';

const router = express.Router();

//=============================== LOGIN =================================//
router.post(
    '/login_admin',
    authController.login_admin
);

router.post(
    '/login_user',
    authController.login_user
);

//================================= VERIFICATION ================================//
router.get(
    '/verify',
    verifyUser,
    authController.verify
)

export default router;