import jwt from 'jsonwebtoken';
import ENV from 'dotenv';
import ejwt from 'express-jwt';

ENV.config();

class Token {
    static generateToken({
        id,
        email,
        firstname,
        lastname,
    }) {
        return jwt.sign({
            id,
            email,
            name: `${firstname} ${lastname}`,
            exp: ((Date.now() / 1000) + (30 * 60)),
        },
        process.env.TOKEN_SECRET,
        {
            audience: '/auth',
        });
    }

    static resetEmailToken({
        id,
        email,
        firstname,
        lastname,
    }) {
        return jwt.sign({
            id,
            email,
            name: `${firstname} ${lastname}`,
            exp: ((Date.now() / 1000) + (60 * 60)),
        },
        process.env.TOKEN_SECRET,
        {
            audience: '/auth/reset',
        });
    }

    static checkToken() {
        return ejwt({
            secret: process.env.TOKEN_SECRET,
            userProperty: 'payload',
            getToken: (req) => {
                if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                    return req.headers.authorization.split(' ')[1];
                }
                if (req.query && req.query.token) {
                    return req.query.token;
                }
                if (req.cookies && req.cookies.token) {
                    return req.cookies.token;
                }
                return null;
            },
        });
    }
}

export default Token;
