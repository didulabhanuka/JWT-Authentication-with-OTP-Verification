import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.route('/signup-request').post(authController.signUpRequest);
router.route('/signup-verify').post(authController.signUpVerify);
router.route('/login').post(authController.signIn);

export default router;
