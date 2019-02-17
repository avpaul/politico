import express from 'express';
import Users from '../controllers/users';

const router = express.Router();

router.post('/signup', Users.create);

export default router;
