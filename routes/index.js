// import express from 'express';
const express = require('express');
const parties = require('../controllers/parties');

const router = express.Router();

/* Create political party */
router.post('/parties', parties.createParty);
/* delete political party */
router.delete('/parties/:id', parties.deleteParty);

module.exports = router;
