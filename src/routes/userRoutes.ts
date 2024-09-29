import express from 'express';
import { verifyJWT } from '../middleware/verifyJWT';
import { getUsers, updateUser } from '../controllers/users';

const router = express.Router();

router.use(verifyJWT);

router.route('/').get(getUsers);

router.route('/').patch(updateUser);

module.exports = router;
