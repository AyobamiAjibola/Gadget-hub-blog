import express from 'express';
import phoneController from '../../controllers/phone.controller/phone.controller';
import {
    verifyUser,
    isAdmin
} from '../../middleware/authorize';
import { upload } from '../../middleware/multer';
import { validation_phone } from '../../middleware/validation';

const images = upload.array('image', 2)

const router = express.Router();

router.post(
    '/new_phone',
    verifyUser,
    images,
    phoneController.new_phone
);

router.get(
    '/fetch_phone',
    phoneController.fetch_phone
);

router.get(
    '/fetch_single_phone/:id',
    phoneController.fetch_single_phone
);

router.get(
    '/fetch_own_phone',
    verifyUser,
    phoneController.fetch_own_phone
);

router.put(
    '/update_phone/:id',
    verifyUser,
    phoneController.update_phone
);

router.delete(
    '/delete_phone/:id',
    verifyUser,
    phoneController.delete_phone
);

router.delete(
    '/delete_picture/:id',
    verifyUser,
    phoneController.delete_picture
);

router.put(
    '/update_picture/:id',
    verifyUser,
    validation_phone,
    images,
    phoneController.update_picture
);

router.get(
    '/fetch_all_phone_not_admin',
    isAdmin,
    phoneController.fetch_all_phone_by_admin
);

export default router;