import db from '../config/db';

const Validator = require('../helpers/validator');

module.exports.create = (req, res) => {
    const validate = Validator.validate(req.body, ['type', 'name', 'description']);
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
    if (!Validator.isStringOnly(req.body, 'name') || !Validator.isStringOnly(req.body, 'type')) {
        res.status(400).json({
            status: 400,
            error: 'office name or type can not contain any number',
        });
        return;
    }

    const data = db.office.create(req.body);
    if (data.error) {
        res.status(400).json({
            status: 400,
            error: data.error,
        });
        return;
    }
    res.status(201).json({
        status: 201,
        message: 'office created',
        data,
    });
};

module.exports.getOne = (req, res) => {
    const office = db.office.findOne(req.params.id);
    if (office) {
        res.status(200);
        res.json({
            status: 200,
            message: `office with id ${req.params.id} found`,
            data: [
                office,
            ],
        });
        return;
    }
    res.status(404);
    res.json({
        status: 404,
        error: `office with id ${req.params.id} not found`,
    });
};

module.exports.getAll = (req, res) => {
    const offices = db.office.findAll();
    res.status(200);
    res.json({
        status: 200,
        message: `${offices.length} offices found`,
        data: offices,
    });
};
