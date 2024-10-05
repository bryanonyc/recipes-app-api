import express from 'express';
import { loginLimiter } from '../middleware/loginLimiter';
import {
    handleDemoLoginRequest,
    handleLoginRequest,
    handleLogoutRequest,
    handleRefreshTokenRequest,
    handleRegisterRequest
} from '../controllers/auth';
const router = express.Router();

// /auth/login
router.route('/login')
    .post(loginLimiter, handleLoginRequest);

router.route('/login/demo')
    .post(loginLimiter, handleDemoLoginRequest);

// /auth/register
router.route('/register')
    .post(handleRegisterRequest);

// /auth/refresh
router.route('/refresh')
    .get(handleRefreshTokenRequest);

// /auth/logout
router.route('/logout')
    .post(handleLogoutRequest);

module.exports = router;
