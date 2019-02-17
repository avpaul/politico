import crypto from 'crypto';
import db from '../config/db';
import Validator from '../helpers/validator';

class Users {
    static create(req, res) {
        const validate = Validator.validate(req.body, ['email', 'password', 'isAdmin', 'firstname', 'lastname']);
        if (!validate.isValid) {
            const error = [];
            if (validate.missingProps.length > 0) {
                error.push(`${validate.missingProps.toString()} missing`);
            }
            if (validate.propsWithoutValue.length > 0) {
                error.push(`${validate.propsWithoutValue.toString()} value missing`);
            }
            return res.status(400).json({
                status: 400,
                error,
            });
        }
        if (!Validator.isStringOnly(req.body, 'firstname')) {
            return res.status(400).json({
                status: 400,
                error: 'fisrtname must not contain any number',
            });
        }
        if (!Validator.isStringOnly(req.body, 'lastname')) {
            return res.status(400).json({
                status: 400,
                error: 'lastname must not contain any number',
            });
        }
        if (!Validator.isValidEmail(req.body, 'email')) {
            return res.status(400).json({
                status: 400,
                error: 'email is not valid',
            });
        }
        if (!Validator.isValidPassword(req.body, 'password')) {
            return res.status(400).json({
                status: 400,
                error: 'password is not valid',
            });
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex');

        const query = `INSERT INTO  
                    users(firstname,lastname,email,isadmin,salt,hash)
                    VALUES($1,$2,$3,$4,$5,$6)
                    returning *
        `;
        return db.pool.query(query, [
            req.body.firstname.trim(),
            req.body.lastname.trim(),
            req.body.email.trim(),
            req.body.isAdmin,
            salt,
            hash,
        ])
            .then(response => res.status(201).json({
                status: 201,
                message: 'users created',
                data: [{
                    token: '',
                    user: response.rows,
                }],
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

    static login(req, res) {

    }
}

export default Users;
