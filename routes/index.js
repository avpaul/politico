// import express from 'express';
const express = require('express');
const parties = require('../controllers/parties');

const router = express.Router();

/* Create political party */
router.post('/parties', parties.createParty);
/* delete political party */
router.delete('/parties/:id', parties.deleteParty);
/* edit a specific party name */
router.patch('parties/:id/name', parties.changeNamne);
/* edit all party properties */
router.put('parties/:id', parties);

module.exports = router;
