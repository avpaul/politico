const db = require('../config/db');
const Validator = require('../helpers/validator');

module.exports.createParty = (req, res) => {
    const validate = Validator.validate(req.body, ['name', 'logoUrl', 'description', 'hqAddress']);
    if (!validate.isValid) {
        const error = [];
        if (validate.missingProps.length > 0) {
            error.push(`${validate.missingProps.toString()} missing`);
        }
        if (validate.propsWithoutValue.length > 0) {
            error.push(`${validate.propsWithoutValue.toString()} value missing`);
        }
        res.status(400).json({
            status: 400,
            error,
        });
        return;
    }
    if (!Validator.isStringOnly(req.body, 'name')) {
        res.status(400).json({
            status: 400,
            error: 'name must not contain any number',
        });
        return;
    }

    const data = db.party.create(req.body);
    if (data.error) {
        res.status(400).json({
            status: 400,
            error: data.error,
        });
        return;
    }
    res.status(201).json({
        status: 201,
        message: 'party created',
        data,
    });
};

module.exports.deleteParty = (req, res) => {
    const deleted = db.party.delete(req.params.id);
    if (deleted) {
        res.status(200).json({
            status: 200,
            data: [{
                message: `party with id ${req.params.id} deleted`,
            }],
        });
    } else {
        res.status(404);
        res.json({
            status: 404,
            error: `party with id ${req.params.id} not found`,
        });
    }
};

module.exports.changeName = (req, res) => {
    const validate = Validator.validate(req.body, ['name']);
    if (!validate.isValid) {
        res.status(400);
        res.json({
            status: 400,
            error: 'new name not found',
        });
        return;
    }
    const data = db.party.changeName(req.params.id, req.body.name);
    if (!data) {
        res.status(404).json({
            status: 404,
            error: `party with id ${req.params.id} not found`,
        });
    }
    if (data.error) {
        res.status(400).json({
            status: 400,
            error: data.error,
        });
        return;
    }
    res.status(200).json({
        status: 200,
        data,
    });
};

module.exports.changeAll = (req, res) => {
    const validate = Validator.validate(req.body, ['name', 'logoUrl', 'description', 'hqAddress']);
    if (!validate.isValid) {
        const error = [];
        if (validate.missingProps.length > 0) {
            error.push(`${validate.missingProps.toString()} missing`);
        }
        if (validate.propsWithoutValue.length > 0) {
            error.push(`${validate.propsWithoutValue.toString()} value missing`);
        }
        res.status(400).json({
            status: 400,
            error,
        });
        return;
    }
    if (!Validator.isStringOnly(req.body, 'name')) {
        res.status(400).json({
            status: 400,
            error: 'name must not contain any number',
        });
        return;
    }

    const data = db.party.updateAll(req.params.id, {
        name: req.body.name,
        hqAddress: req.body.hqAddress,
        logoUrl: req.body.logoUrl,
        description: req.body.description,
    });
    if (data.error) {
        res.status(data.status || 400).json({
            status: data.status || 400,
            error: data.error,
        });
        return;
    }
    res.status(200).json({
        status: 200,
        data,
    });
};

module.exports.getOne = (req, res) => {
    const party = db.party.findOne(req.params.id);
    if (party) {
        res.status(200);
        res.json({
            status: 200,
            message: `party with id ${req.params.id} found`,
            data: [
                party,
            ],
        });
        return;
    }
    res.status(404);
    res.json({
        status: 404,
        error: `party with id ${req.params.id} not found`,
    });
};

module.exports.getAll = (req, res) => {
    const parties = db.party.findAll();
    res.status(200);
    res.json({
        status: 200,
        message: `${parties.length} parties found`,
        data: parties,
    });
};
