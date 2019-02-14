const  db = require('../config/db');

module.exports.create = (req, res) => {
    const b = req.body;
    const o = {
        type: b.type,
        name: b.name,
        description: b.description,
    };
    if (!o.name || !o.type) {
        res.status(400);
        res.json({
            status: 400,
            error: 'office type and name required',
        });
        return;
    }
    const d = db.office.create(o);
    res.status(201);
    res.json({
        status: 201,
        data: d,
    });
};

module.exports.getOne = (req, res) => {
    const id = req.params.id;
    const d = db.office.findOne(id);
    if (!d) {
        res.status(400);
        res.json({
            status: 400,
            error: 'id doesn\'t exist',
        });
        return;
    }
    res.status(200);
    res.json({
        status: 200,
        data: [
            d,
        ],
    });
};

module.exports.getAll = (req, res) => {
    const n = (req.body.number) ? Number(req.body.number) : null;
    const d = db.office.findAll(n);
    if (!d) {
        res.status(200);
        res.json({
            status: 400,
            error: 'no office found',
        });
        return;
    }
    res.status(200);
    res.json({
        status: 200,
        data: d,
    });
};
