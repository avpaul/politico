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
            .catch(error => res.status(400).json({
                status: 400,
                error: error.message,
            }));
    }

    static getOne(req, res) {
        const query = `SELECT * FROM offices WHERE id = ${req.params.id}`;
        db.pool.query(query)
            .then((response) => {
                if (response.rows.length === 0) {
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
}
export default Offices;
