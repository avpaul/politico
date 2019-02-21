import express from 'express';
import parties from '../controllers/parties';
import offices from '../controllers/offices';
import office from '../controllers/office';
import token from '../helpers/jwt';

const router = express.Router();
const auth = token.checkToken();

router.post('/parties', auth, parties.createParty);
router.delete('/parties/:id', auth, parties.deleteParty);
router.patch('/parties/:id/name', auth, parties.changeName);
router.put('/parties/:id', auth, parties.changeAll);
router.get('/parties', parties.getAll);
router.get('/parties/:id', parties.getOne);
router.post('/offices', auth, offices.create);
router.get('/offices', offices.getAll);
router.get('/offices/:id', offices.getOne);
router.post('/offices/:id/register', auth, offices.register);
router.post('/vote', auth, offices.vote);
router.get('/office/:id/result', office.getResult);

export default router;
