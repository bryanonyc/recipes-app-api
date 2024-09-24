import express from 'express';
import { loginLimiter } from '../middleware/loginLimiter';
import {
    handleLoginRequest,
    handleLogoutRequest,
    handleRefreshTokenRequest,
    handleRegisterRequest
} from '../controllers/auth';
const router = express.Router();

// /auth/login
router.route('/login')
    .post(loginLimiter, handleLoginRequest);

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
