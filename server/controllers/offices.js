import db from '../config/db';
import Validator from '../helpers/validator';

class Offices {
    static create(req, res) {
        if (!req.user.isadmin) {
            res.status(400)
                .json({
                    status: 401,
                    error: 'Creating an office requires admin access',
                });
            return;
        }
        const validate = Validator.validate(req.body, ['type', 'name', 'description']);
        if (!validate.isValid) {
            let error = '';
            if (validate.missingProps.length > 0) {
                error += (`${validate.missingProps.toString()} missing`);
            }
            if (validate.propsWithoutValue.length > 0) {
                error += (`${validate.propsWithoutValue.toString()} value missing`);
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
        const partyType = [
            'federal',
            'legislative',
            'state',
            'local government',
        ];
        if (partyType.findIndex(item => item === req.body.type) < 0) {
            res.status(400).json({
                status: 400,
                error: 'Office type must be federal, state, legislative or local government',
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
                    return res.status(400)
                        .json({
                            status: 2900,
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
        if (!Validator.isNumberOnly(req.params, 'id')) {
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
        if (req.user && !req.user.isadmin) {
            res.status(401)
                .json({
                    status: 401,
                    error: 'Registering a candidate requires admin access',
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
        const validate = Validator.validate(req.body, ['userId']);
        if (!validate.isValid) {
            let error = '';
            if (validate.missingProps.length > 0) {
                error += (`${validate.missingProps.toString()} missing`);
            }
            if (validate.propsWithoutValue.length > 0) {
                error += (`${validate.propsWithoutValue.toString()} value missing`);
            }
            res.status(400).json({
                status: 400,
                error,
            });
            return;
        }
        if (!Validator.isNumberOnly(req.body, 'userId')) {
            res.status(400).json({
                status: 400,
                error: 'userId must be a number',
            });
            return;
        }
        const officeQuery = `SELECT * FROM offices WHERE id = ${req.params.id}`;
        const userQuery = `SELECT * FROM users WHERE id = ${req.body.userId}`;
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
                                                    office: {
                                                        id: candidate.rows[0].office,
                                                        name: response.rows[0].name,
                                                        type: response.rows[0].type,
                                                    },
                                                    user: {
                                                        id: candidate.rows[0].candidate,
                                                        firstname: user.rows[0].firstname,
                                                        lastname: user.rows[0].lastname,
                                                    },
                                                },
                                            });
                                    })
                                    .catch((err) => {
                                        if (err.code === '23505') {
                                            const keyName = err.detail.substr(err.detail.indexOf('(') + 1, (err.detail.indexOf(')') - (err.detail.indexOf('(') + 1)));
                                            return res.status(400)
                                                .json({
                                                    status: 400,
                                                    error: 'Duplicate values not accepted',
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

    static vote(req, res) {
        if (!req.user) {
            res.status(400)
                .json({
                    status: 400,
                    error: 'token missing',
                });
            return;
        }

        if (req.user.isadmin) {
            res.status(400)
                .json({
                    status: 400,
                    error: 'Admin can\'t vote',
                });
            return;
        }
        const validateBody = Validator.validate(req.body, ['office', 'candidate', 'voter']);
        if (!validateBody.isValid) {
            let error = '';
            if (validateBody.missingProps.length > 0) {
                error += (`${validateBody.missingProps.toString()} missing`);
            }
            if (validateBody.propsWithoutValue.length > 0) {
                error += (` ${validateBody.propsWithoutValue.toString()} value missing`);
            }
            res.status(400).json({
                status: 400,
                error,
            });
            return;
        }
        if (!Validator.isNumberOnly(req.body, 'office')) {
            res.status(400).json({
                status: 400,
                error: 'office id must be a number',
            });
            return;
        }

        if (!Validator.isNumberOnly(req.body, 'voter')) {
            res.status(400).json({
                status: 400,
                error: 'voter id must be a number',
            });
            return;
        }

        if (req.user.id !== Number(req.body.voter)) {
            res.status(404)
                .json({
                    status: 404,
                    error: 'The token sent didn\'t match this user',
                });
            return;
        }

        const officeQuery = `SELECT * FROM offices WHERE id = ${req.body.office}`;
        const userQuery = `SELECT * FROM users WHERE id = ${req.body.voter}`;
        const candidateQuery = ` SELECT * FROM candidates WHERE candidate = ${req.body.candidate} and office = ${req.body.office}`;
        const voteQuery = `INSERT INTO 
            votes(createdOn,createdBy,candidate,office)
            VALUES (
                $1,
                (SELECT id FROM users WHERE id = ${req.body.voter}),
                (SELECT candidate FROM candidates WHERE office = ${req.body.office} and candidate = ${req.body.candidate}),
                (SELECT office FROM candidates WHERE office = ${req.body.office} and candidate = ${req.body.candidate})
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
                                        if (candidate.rowCount > 0) {
                                            return db.pool.query(
                                                voteQuery,
                                                [(new Date()).toUTCString()],
                                            )
                                                .then(async (vote) => {
                                                    const candidateInfo = await db.pool.query(`SELECT * FROM users WHERE id = ${vote.rows[0].candidate}`);
                                                    res.status(201)
                                                        .json({
                                                            status: 201,
                                                            data: {
                                                                office: {
                                                                    id: vote.rows[0].office,
                                                                    name: response.rows[0].name,
                                                                    type: response.rows[0].type,
                                                                },
                                                                candidate: {
                                                                    id: vote.rows[0].candidate,
                                                                    firstname: candidateInfo.rows[0].firstname,
                                                                    lastname: candidateInfo.rows[0].lastname,
                                                                },
                                                                voter: {
                                                                    id: vote.rows[0].createdby,
                                                                    firstname: user.rows[0].firstname,
                                                                    lastname: user.rows[0].lastname,
                                                                },
                                                            },
                                                        });
                                                })
                                                .catch((err) => {
                                                    if (err.code === '23505') {
                                                        return res.status(400)
                                                            .json({
                                                                status: 400,
                                                                error: 'You are allowed to vote only one time on each office',
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
                                                error: 'Candidate not found',
                                            });
                                    })
                                    .catch(err => res.status(400)
                                        .json({
                                            status: 400,
                                            error: err.message,
                                        }));
                            }
                            return res.status(404)
                                .json({
                                    status: 404,
                                    error: `user with id ${req.body.voter} not found`,
                                });
                        })
                        .catch(err => res.status(400)
                            .json({
                                status: 400,
                                error: err.message,
                            }));
                }
                return res.status(404)
                    .json({
                        status: 404,
                        error: `office with id ${req.body.office} not found`,
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
