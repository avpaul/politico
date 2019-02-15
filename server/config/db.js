/*  This file creates a database network-like by initializing all models to maintain
 *  data persistence as along as the connection stays alive
 *  or not restarted  */

import Party from '../models/party';
import Office from '../models/offices';

module.exports.party = new Party();
module.exports.office = new Office();
