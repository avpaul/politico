// import express from 'express';
const express = require('express');
const parties = require('../controllers/parties');
const offices = require('../controllers/offices');

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

module.exports = router;
