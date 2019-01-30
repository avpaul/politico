/*  This file creates a database network-like by initializing all models to maintain
 *  data persistence as along as the connection stays alive
 *  or not restarted  */

const Party = require('../models/party');

// const party = new Party();

module.exports.party = new Party();
