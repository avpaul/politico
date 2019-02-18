import express from 'express';
import parties from '../controllers/parties';
import offices from '../controllers/offices';
import office from '../controllers/office';

const router = express.Router();

router.post('/parties', parties.createParty);
router.delete('/parties/:id', parties.deleteParty);
router.patch('/parties/:id/name', parties.changeName);
router.put('/parties/:id', parties.changeAll);
router.get('/parties', parties.getAll);
router.get('/parties/:id', parties.getOne);
router.post('/offices', offices.create);
router.get('/offices', offices.getAll);
router.get('/offices/:id', offices.getOne);
router.post('/offices/:id/register', offices.register);
router.post('/vote', offices.vote);
router.get('/office/:id/result', office.getResult);

export default router;
