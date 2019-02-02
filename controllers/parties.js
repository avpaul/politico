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
    const deleted = db.party.delete(id);
    if (deleted) {
        res.status(200);
        res.json({
            status: 200,
            data: [{
                message: 'party deleted',
            }],
        });
    } else {
        res.status(404);
        res.json({
            status: 404,
            error: 'id not found',
        });
    }
};

module.exports.changeName = (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    if (!name) {
        res.status(400);
        res.json({
            status: 400,
            error: 'new name not found',
        });
        return;
    }
    const d = db.party.changeName(id, name);
    res.status(200);
    res.json({
        status: 200,
        data: d,
    });
};

module.exports.changeAll = (req, res) => {
    const id = req.params.id;
    const b = req.body;
    if (!b.name || !b.logoUrl || !b.description) {
        res.status(400);
        res.json({
            status: 400,
            error: 'no data found',
        });
        return;
    }
    const data = db.party.updateAll(id, {
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
