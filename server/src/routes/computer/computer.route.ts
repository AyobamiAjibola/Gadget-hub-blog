import express from 'express';
import computerController from '../../controllers/computer.controller/computer.controller';
import {
    verifyUser,
    isAdmin
} from '../../middleware/authorize';
import { upload } from '../../middleware/multer';
import { validation_computer } from '../../middleware/validation';

const images = upload.array('image', 2)

const router = express.Router();

router.post(
    '/new_computer',
    verifyUser,
    images,
    computerController.new_computer
);

router.get(
    '/fetch_computer',
    computerController.fetch_computer
);

router.get(
    '/fetch_single_computer/:id',
    computerController.fetch_single_computer
);

router.get(
    '/fetch_own_computer',
    verifyUser,
    computerController.fetch_own_computer
);

router.put(
    '/update_computer/:id',
    verifyUser,
    computerController.update_computer
);

router.delete(
    '/delete_computer/:id',
    verifyUser,
    computerController.delete_computer
);

router.delete(
    '/delete_picture/:id',
    verifyUser,
    computerController.delete_picture
);

router.put(
    '/update_picture/:id',
    verifyUser,
    validation_computer,
    images,
    computerController.update_picture
);

router.get(
    '/fetch_all_computer_not_admin',
    isAdmin,
    computerController.fetch_all_computer_by_admin
);

export default router;