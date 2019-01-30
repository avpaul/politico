// import express from 'express';
const express = require('express');

const parties = require('../controllers/parties');

const router = express.Router();

/* Create political party */
router.post('/parties', parties.createParty);

module.exports = router;
