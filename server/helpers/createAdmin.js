import ENV from 'dotenv';
import crypto from 'crypto';
import db from '../config/db';

ENV.config();

const addAdmin = () => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(process.env.TEST_EMAIL_PASSWORD, salt, 1000, 64, 'sha512').toString('hex');
    const query = `INSERT INTO  
                    users(firstname,lastname,email,isadmin,salt,hash)
                    VALUES($1,$2,$3,$4,$5,$6)
                    returning *
        `;
    db.pool.query(query, [
        'paul',
        'smith',
        process.env.TEST_EMAIL,
        true,
        salt,
        hash,
    ]).then(users => users.rows[0])
        .catch(e => console.log(e));
};

export default addAdmin();
