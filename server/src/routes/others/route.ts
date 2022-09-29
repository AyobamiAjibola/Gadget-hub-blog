import express from 'express';
import usertypeController from '../../controllers/other.controllers/usertype.controller/usertype';
import categoryController from '../../controllers/other.controllers/category.controller/category';
import deviceController from '../../controllers/other.controllers/device.controller/device';
import {isAdmin} from '../../middleware/authorize';

const router = express.Router();

//=============== User Type ================//
router.post(
    '/role',
    isAdmin,
    usertypeController.new_role
);

router.get(
    '/fetch_roles',
    usertypeController.get_roles
);

router.delete(
    '/delete_role/:id',
    isAdmin,
    usertypeController.delete_role
);

//================= Category ==================//
router.post(
    '/new_category',
    isAdmin,
    categoryController.new_cat
);

router.get(
    '/fetch_category',
    categoryController.get_cat
);

router.delete(
    '/delete_category/:id',
    isAdmin,
    categoryController.delete_cat
);

//================= Computer Company ==================//
router.post(
    '/new_computer_company',
    isAdmin,
    deviceController.new_computer_company
);

router.get(
    '/fetch_computer_company',
    deviceController.get_computer_company
);

router.delete(
    '/delete_computer_company/:id',
    isAdmin,
    deviceController.delete_computer_company
);

//================= Computer Type ==================//
router.post(
    '/new_computer_type',
    isAdmin,
    deviceController.new_computer_type
);

router.get(
    '/fetch_computer_type',
    deviceController.get_computer_type
);

router.delete(
    '/delete_computer_type/:id',
    isAdmin,
    deviceController.delete_computer_type
);

//================= Phone Company ==================//
router.post(
    '/new_phone_company',
    isAdmin,
    deviceController.new_phone_company
);

router.get(
    '/fetch_phone_company',
    deviceController.get_phone_company
);

router.delete(
    '/delete_phone_company/:id',
    isAdmin,
    deviceController.delete_phone_company
);

//================= Phone Type ==================//
router.post(
    '/new_phone_type',
    isAdmin,
    deviceController.new_phone_type
);

router.get(
    '/fetch_phone_type',
    deviceController.get_phone_type
);

router.delete(
    '/delete_phone_type/:id',
    isAdmin,
    deviceController.delete_phone_type
);

export default router;