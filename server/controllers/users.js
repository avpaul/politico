import crypto from 'crypto';
import nodemailer from 'nodemailer';
import ENV from 'dotenv';
import db from '../config/db';
import Validator from '../helpers/validator';
import token from '../helpers/jwt';

ENV.config();

class Users {
    static create(req, res) {
        const validate = Validator.validate(req.body, ['email', 'password', 'confirmPassword', 'firstname', 'lastname']);
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
        if (!Validator.isStringOnly(req.body, 'firstname')) {
            res.status(400).json({
                status: 400,
                error: 'fisrtname must not contain any number',
            });
            return;
        }
        if (!Validator.isStringOnly(req.body, 'lastname')) {
            res.status(400).json({
                status: 400,
                error: 'lastname must not contain any number',
            });
            return;
        }
        if (!Validator.isValidEmail(req.body, 'email')) {
            res.status(400).json({
                status: 400,
                error: 'email is not valid',
            });
            return;
        }
        if (!Validator.isValidPassword(req.body, 'password')) {
            res.status(400).json({
                status: 400,
                error: 'password is not valid',
            });
            return;
        } 

        if (!Validator.isValidPassword(req.body, 'confirmPassword')) {
            res.status(400).json({
                status: 400,
                error: 'confirm password is not valid',
            });
            return;
        }

        if (req.body.password.trim() !== req.body.confirmPassword.trim()) {
            res.status(400).json({
                status: 400,
                error: 'password not identical',
            });
            return;
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex');

        const query = `INSERT INTO  
                    users(firstname,lastname,email,salt,hash)
                    VALUES($1,$2,$3,$4,$5)
                    returning *
        `;
        db.pool.query(query, [
            req.body.firstname.trim(),
            req.body.lastname.trim(),
            req.body.email.trim(),
            salt,
            hash,
        ])
            .then(response => res.status(201).json({
                status: 201,
                message: 'user created',
                data: [{
                    token: token.generateToken({
                        id: response.rows[0].id,
                        email: response.rows[0].email,
                        firstname: response.rows[0].firstname,
                        lastname: response.rows[0].lastname,
                        isAdmin: response.rows[0].isadmin,
                    }),
                    user: response.rows[0],
                }],
            }))
            .catch((err) => {
                if (err.code === '23505') {
                    const keyName = err.detail.substr(err.detail.indexOf('(') + 1, (err.detail.indexOf(')') - (err.detail.indexOf('(') + 1)));
                    return res.status(400)
                        .json({
                            status: 400,
                            error: `User with ${keyName} ${req.body.email.trim()} exists`,
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
        const validate = Validator.validate(req.body, ['email', 'password']);
        if (!validate.isValid) {
            let error = '';
            if (validate.missingProps.length > 0) {
                error += (`${validate.missingProps.toString()} missing`);
            }
            if (validate.propsWithoutValue.length > 0) {
                error += (`${validate.propsWithoutValue.toString()} value missing`);
            }
            return res.status(400).json({
                status: 400,
                error,
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

        const query = `SELECT * FROM users WHERE email = '${req.body.email.trim()}'`;
        return db.pool.query(query)
            .then((response) => {
                if (response.rowCount > 0) {
                    const hash = crypto.pbkdf2Sync(
                        req.body.password,
                        response.rows[0].salt,
                        1000,
                        64,
                        'sha512',
                    )
                        .toString('hex');
                    if (hash === response.rows[0].hash) {
                        return res.status(200)
                            .json({
                                status: 200,
                                data: [{
                                    token: token.generateToken({
                                        id: response.rows[0].id,
                                        email: response.rows[0].email,
                                        firstname: response.rows[0].firstname,
                                        lastname: response.rows[0].lastname,
                                        isadmin: response.rows[0].isadmin,
                                    }),
                                    user: response.rows[0],
                                }],
                            });
                    }
                    return res.status(400)
                        .json({
                            status: 400,
                            error: 'password is incorect',
                        });
                }
                return res.status(404)
                    .json({
                        status: 404,
                        error: `User with email ${req.body.email} doens't exist`,
                    });
            })
            .catch((err) => {
                res.status(400)
                    .json({
                        status: 400,
                        error: err.message,
                    });
            });
    }

    static resetLink(req, res) {
        const validate = Validator.validate(req.body, ['email']);
        if (!validate.isValid) {
            let error = '';
            if (validate.missingProps.length > 0) {
                error += (`${validate.missingProps.toString()} missing`);
            }
            if (validate.propsWithoutValue.length > 0) {
                error += (`${validate.propsWithoutValue.toString()} value missing`);
            }
            return res.status(400).json({
                status: 400,
                error,
            });
        }
        if (!Validator.isValidEmail(req.body, 'email')) {
            return res.status(400).json({
                status: 400,
                error: 'email is not valid',
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.TEST_EMAIL,
                pass: process.env.TEST_EMAIL_PASSWORD,
            },
        });
        const resetLink = `https://peoplevote.herokuapp.com/reset?token=${token.resetEmailToken(req.body.email)}`;
        const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email.trim(),
            subject: 'Reset Politico user password',
            html: `<p>Someone has requested to change the password for the account registered on this email!</p>
                    <P>If you recognize the request click <a href="${resetLink}">here</a> to change your password.</P>`,
        };

        const query = `SELECT email FROM users WHERE email = '${req.body.email.trim()}'`;
        return db.pool.query(query)
            .then(async (users) => {
                if (users.rowCount > 0 && users.rows[0].email === req.body.email.trim()) {
                    transporter.sendMail(mailOptions);
                    return res.status(200).json({
                        status: 400,
                        data: [{
                            message: 'Check your email for password reset link',
                            email: req.body.email,
                        }],
                    });
                }
                return res.status(404)
                    .json({
                        status: 404,
                        error: `User with email ${req.body.email} doesn't exist`,
                    });
            })
            .catch(err => res.status(400)
                .json({
                    status: 400,
                    error: err.message,
                }));
    }

    static reset(req, res) {
        const validate = Validator.validate(req.body, ['email', 'password', 'confirmPassword']);
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

        if (!Validator.isValidEmail(req.body, 'email')) {
            res.status(400).json({
                status: 400,
                error: 'email is not valid',
            });
            return;
        }
        if (!Validator.isValidPassword(req.body, 'password')) {
            res.status(400).json({
                status: 400,
                error: 'password is not valid',
            });
            return;
        }

        if (!Validator.isValidPassword(req.body, 'confirmPassword')) {
            res.status(400).json({
                status: 400,
                error: 'confirm password is not valid',
            });
            return;
        }

        if (req.body.password.trim() !== req.body.confirmPassword.trim()) {
            res.status(400).json({
                status: 400,
                error: 'new password not identical',
            });
        }

        const getUser = 'SELECT * FROM users WHERE email = $1';
        const resetUserQuery = 'UPDATE users SET hash = $1 returning *';

        db.pool.query(getUser, [req.body.email.trim()])
            .then((user) => {
                if (user.rowCount > 0) {
                    if (user.rows[0].email === req.body.email.trim() && req.body.email.trim() === req.user.email) {
                        const hash = crypto.pbkdf2Sync(req.body.password, user.rows[0].salt, 1000, 64, 'sha512').toString('hex');
                        db.pool.query(resetUserQuery, [hash])
                            .then((newUser) => {
                                res.status(200)
                                    .json({
                                        status: 200,
                                        user: newUser.rows[0],
                                    });
                            })
                            .catch(err => res.status(400)
                                .json({
                                    status: 400,
                                    error: err.message,
                                }));
                        return;
                    }
                    res.status(400)
                        .json({
                            status: 400,
                            error: 'Token email and sent email doesn\'t match',
                        });
                }
            })
            .catch(err => res.status(400)
                .json({
                    status: 400,
                    error: err.message,
                }));
    }

    static getAll(req, res) {
        const getUsersQuery = 'SELECT * FROM users';
        db.pool.query(getUsersQuery)
            .then(users => res.status(200)
                .json({
                    status: 200,
                    users: users.rows,
                }));
    }
}

export default Users;
