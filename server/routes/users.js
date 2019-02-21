import express from 'express';
import Users from '../controllers/users';
import token from '../helpers/jwt';

const auth = token.checkToken();

const router = express.Router();

router.post('/signup', Users.create);
router.post('/login', Users.login);
router.post('/resetlink', Users.resetLink);
router.post('/reset', auth, Users.reset);
router.get('/users', Users.getAll);

export default router;
