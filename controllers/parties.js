const db = require('../config/db');

module.exports.createParty = (req, res) => {
  const b = req.body;
  if (!b.name || !b.logoUrl || !b.description) {
    res.status(400);
    res.json({
      status: 400,
      error: 'no data found',
    });
    return;
  }

  const data = db.party.create({
    name: b.name,
    hqAddress: b.hqAddress,
    logoUrl: b.logoUrl,
    description: b.description,
  });

  res.status(200);
  res.json({
    status: 200,
    data,
  });
};

module.exports.deleteParty = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.json(400);
    res.json({
      status: 400,
      error: 'no id found',
    });
    return;
  }
}
