import db from '../config/db';
import Validator from '../helpers/validator';

class Offices {
    static create(req, res) {
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

        const query = `INSERT INTO
            offices(type,name,description)
            VALUES($1,$2,$3)
            returning *
        `;

        const values = [
            req.body.type,
            req.body.name,
            req.body.description,
        ];

        db.pool.query(query, values)
            .then(response => res.status(201).json({
                status: 201,
                message: 'office created',
                data: response.rows,
            }))
            .catch((err) => {
                if (err.code === '23505') {
                    const keyName = err.detail.substr(err.detail.indexOf('(') + 1, (err.detail.indexOf(')') - (err.detail.indexOf('(') + 1)));
                    return res.status(404)
                        .json({
                            status: 404,
                            error: err.message,
                            key: keyName,
                        });
                }
                return res.status(400)
                    .json({
                        status: 400,
                        error: err.message,
                    });
            });
    }

    static getOne(req, res) {
        if (Validator.isNumberOnly(req.params, 'id')) {
            res.status(400).json({
                status: 400,
                error: 'id must not contain any letter',
            });
            return;
        }
        const query = `SELECT * FROM offices WHERE id = ${req.params.id}`;
        db.pool.query(query)
            .then((response) => {
                if (response.rowCount === 0) {
                    return res.status(404)
                        .json({
                            status: 404,
                            error: `office with id ${req.params.id} not found`,
                        });
                }
                return res.status(200).json({
                    status: 200,
                    message: `office with id ${req.params.id} found`,
                    data: response.rows,
                });
            })
            .catch(error => res.status(400).json({
                status: 400,
                error: error.message,
            }));
    }

    static getAll(req, res) {
        const query = 'SELECT * FROM offices';
        db.pool.query(query)
            .then(response => res.status(200).json({
                status: 200,
                message: `${response.rowCount} offices found`,
                data: response.rows,
            }))
            .catch(error => res.status(400).json({
                status: 400,
                error: error.message,
            }));
    }

    static register(req, res) {
        if (Validator.isNumberOnly(req.params, 'id')) {
            res.status(400).json({
                status: 400,
                error: 'id must not contain any letter',
            });
            return;
        }
        const validate = Validator.validate(req.body, ['userId']);
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
        if (Validator.isNumberOnly(req.body, 'userId')) {
            res.status(400).json({
                status: 400,
                error: 'office name or type can not contain any number',
            });
            return;
        }
        const officeQuery = `SELECT * FROM offices WHERE id = ${req.params.id}`;
        const userQuery = `SELECT * FROM users WHERE id = ${req.body.userId}`;
        console.log(officeQuery, userQuery);
        const candidateQuery = `INSERT INTO 
            candidates(candidate,office)
            VALUES (
                (SELECT id FROM users WHERE id = ${req.body.userId}),
                (SELECT id FROM offices WHERE id = ${req.params.id})
            )
            returning *
        `;

        db.pool.query(officeQuery)
            .then((response) => {
                if (response.rowCount > 0) {
                    return db.pool.query(userQuery)
                        .then((user) => {
                            if (user.rowCount > 0) {
                                return db.pool.query(candidateQuery)
                                    .then((candidate) => {
                                        res.status(201)
                                            .json({
                                                status: 201,
                                                data: {
                                                    office: candidate.rows[0].office,
                                                    user: candidate.rows[0].candidate,
                                                },
                                            });
                                    })
                                    .catch((err) => {
                                        if (err.code === '23505') {
                                            const keyName = err.detail.substr(err.detail.indexOf('(') + 1, (err.detail.indexOf(')') - (err.detail.indexOf('(') + 1)));
                                            return res.status(404)
                                                .json({
                                                    status: 404,
                                                    error: err.message,
                                                    key: keyName,
                                                });
                                        }
                                        return res.status(400)
                                            .json({
                                                status: 400,
                                                error: err.message,
                                            });
                                    });
                            }
                            return res.status(404)
                                .json({
                                    status: 404,
                                    error: `user with id ${req.body.userId} not found`,
                                });
                        })
                        .catch();
                }
                return res.status(404)
                    .json({
                        status: 404,
                        error: `office with id ${req.params.id} not found`,
                    });
            })
            .catch(err => res.status(400)
                .json({
                    status: 400,
                    error: err.message,
                }));
    }
}
export default Offices;
