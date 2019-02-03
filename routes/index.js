// import express from 'express';
const express = require('express');
const parties = require('../controllers/parties');
const offices = require('../controllers/offices');

const router = express.Router();

// CREATE POLITICAL PARTY
router.post('/parties', parties.createParty);

// DELETE POLITICAL PARTY
router.delete('/parties/:id', parties.deleteParty);

// EDIT A SPECIFIC PARTY NAME
router.patch('/parties/:id/name', parties.changeName);

// EDIT ALL PARTY PROPERTIES
router.put('/parties/:id', parties.changeAll);

// GET ALL PARTIES
router.get('/parties', parties.getAll);

// GET ONE PARTY
router.get('/parties/:id', parties.getOne);

router.post('/offices', offices.create);

module.exports = router;
