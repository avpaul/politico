import express from 'express';
import Users from '../controllers/users';

const router = express.Router();

router.post('/signup', Users.create);
router.post('/login', Users.login);

export default router;
