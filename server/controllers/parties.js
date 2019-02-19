// db: database
import db from '../config/db';
import Validator from '../helpers/validator';

class Parties {
    static createParty(req, res) {
        if (req.user && !req.user.isadmin) {
            res.status(400)
                .json({
                    status: 401,
                    error: 'Creating a party requires admin access',
                });
            return;
        }
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
        if (!Validator.isUri(req.body, 'logoUrl')) {
            res.status(400).json({
                status: 400,
                error: 'logoUrl is not valid',
            });
            return;
        }
        const query = `INSERT INTO  
                    parties(name,hqaddress,logourl,description)
                    VALUES($1,$2,$3,$4)
                    returning *
        `;
        db.pool.query(query, [
            req.body.name.trim(),
            req.body.hqAddress.trim(),
            req.body.logoUrl.trim(),
            req.body.description.trim(),
        ])
            .then(response => res.status(201).json({
                status: 201,
                message: 'party created',
                data: response.rows,
            }))
            .catch((err) => {
                if (err.code === '23505') {
                    const keyName = err.detail.substr(err.detail.indexOf('(') + 1, (err.detail.indexOf(')') - (err.detail.indexOf('(') + 1)));
                    return res.status(403)
                        .json({
                            status: 403,
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

    static deleteParty(req, res) {
        if (req.user && !req.user.isadmin) {
            res.status(400)
                .json({
                    status: 401,
                    error: 'Deleting a party requires admin access',
                });
            return;
        }
        if (!Validator.isNumberOnly(req.params, 'id')) {
            res.status(400).json({
                status: 400,
                error: 'id must not contain any letter',
            });
            return;
        }
        const deleteQuery = `DELETE FROM parties WHERE id = ${req.params.id}`;
        const selectQuery = `SELECT * FROM parties WHERE id = ${req.params.id}`;
        db.pool.query(selectQuery)
            .then((response) => {
                if (response.rowCount > 0) {
                    return db.pool.query(deleteQuery)
                        .then(deleteResponse => res.status(200).json({
                            status: 200,
                            message: `party with id ${req.params.id} deleted`,
                            data: deleteResponse.rows,
                        }))
                        .catch(err => res.status(400)
                            .json({
                                status: 400,
                                error: err.message,
                            }));
                }
                return res.status(404).json({
                    status: 404,
                    error: `party with id ${req.params.id} not found`,
                });
            })
            .catch(error => res.status('400')
                .json({
                    status: '400',
                    error: error.message,
                }));
    }

    static changeName(req, res) {
        if (req.user && !req.user.isadmin) {
            res.status(400)
                .json({
                    status: 401,
                    error: 'Changing a party name requires admin access',
                });
            return;
        }
        if (!Validator.isNumberOnly(req.params, 'id')) {
            res.status(400).json({
                status: 400,
                error: 'id must not contain any letter',
            });
            return;
        }
        if (!Validator.isNumberOnly(req.params, 'id')) {
            res.status(400).json({
                status: 400,
                error: 'id must not contain any letter',
            });
            return;
        }
        const updateQuery = `UPDATE parties 
            SET name = $1
            WHERE id = ${req.params.id}
            returning *
        `;
        const selectQuery = `SELECT * FROM parties WHERE id = ${req.params.id}`;
        const validate = Validator.validate(req.body, ['name']);

        if (!validate.isValid) {
            res.status(400);
            res.json({
                status: 400,
                error: 'new name not found',
            });
            return;
        }
        db.pool.query(selectQuery)
            .then((response) => {
                if (response.rowCount > 0) {
                    return db.pool.query(updateQuery, [req.body.name])
                        .then(updateResponse => res.status(200).json({
                            status: 200,
                            error: `party with id ${req.params.id} updated`,
                            data: updateResponse.rows,
                        }))
                        .catch((err) => {
                            if (err.code === '23505') {
                                const keyName = err.detail.substr(err.detail.indexOf('(') + 1, (err.detail.indexOf(')') - (err.detail.indexOf('(') + 1)));
                                return res.status(400)
                                    .json({
                                        status: 400,
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
                return res.status(404).json({
                    status: 404,
                    error: `party with id ${req.params.id} not found`,
                });
            })
            .catch(error => res.status('400')
                .json({
                    status: '400',
                    error: error.message,
                }));
    }

    static changeAll(req, res) {
        if (req.user && !req.user.isadmin) {
            res.status(400)
                .json({
                    status: 401,
                    error: 'Updating a party requires admin access',
                });
            return;
        }
        if (!Validator.isNumberOnly(req.params, 'id')) {
            res.status(400).json({
                status: 400,
                error: 'id must not contain any letter',
            });
            return;
        }
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
        if (!(Validator.isStringOnly(req.body, 'name'))) {
            res.status(400).json({
                status: 400,
                error: 'name must not contain any number',
            });
            return;
        }
        const updateQuery = `UPDATE parties 
            SET name = $1, hqaddress = $2, logoUrl = $3, description = $4
            WHERE id = ${req.params.id}
            returning *
        `;
        const selectQuery = `SELECT * FROM parties WHERE id = ${req.params.id}`;
        const values = [
            req.body.name.trim(),
            req.body.hqAddress.trim(),
            req.body.logoUrl.trim(),
            req.body.description.trim(),
        ];

        db.pool.query(selectQuery)
            .then((response) => {
                if (response.rowCount > 0) {
                    return db.pool.query(updateQuery, values)
                        .then(updateResponse => res.status(200).json({
                            status: 200,
                            error: `party with id ${req.params.id} updated`,
                            data: updateResponse.rows,
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
                return res.status(404).json({
                    status: 404,
                    error: `party with id ${req.params.id} not found`,
                });
            })
            .catch(error => res.status('400')
                .json({
                    status: '400',
                    error: error.message,
                }));
    }

    static getOne(req, res) {
        if (!Validator.isNumberOnly(req.params, 'id')) {
            res.status(400).json({
                status: 400,
                error: 'id must not contain any letter',
            });
            return;
        }
        const selectQuery = `SELECT * FROM parties WHERE id = ${req.params.id}`;
        db.pool.query(selectQuery)
            .then((response) => {
                if (response.rowCount > 0) {
                    return res.status(200).json({
                        status: 200,
                        message: `party with id ${req.params.id} found`,
                        data: response.rows,
                    });
                }
                return res.status(404).json({
                    status: 404,
                    error: `party with id ${req.params.id} not found`,
                });
            })
            .catch(error => res.status('400')
                .json({
                    status: '400',
                    error: error.message,
                }));
    }

    static getAll(req, res) {
        const selectQuery = 'SELECT * FROM parties';
        db.pool.query(selectQuery)
            .then(response => res.status(200).json({
                status: 200,
                message: `${response.rowCount} parties found`,
                data: response.rows,
            }))
            .catch(error => res.status(400)
                .json({
                    status: 'DB ERROR',
                    error: error.message,
                }));
    }
}

export default Parties;
