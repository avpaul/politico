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
    res.status(200);
    res.json({
        status: 200,
        data: d,
    });
};
