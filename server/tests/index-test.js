import chai from 'chai';
import chaihttp from 'chai-http';
import ENV from 'dotenv';
import app from '../../app';
import db from '../config/db';

ENV.config();

chai.use(chaihttp);
chai.should();

const regularUser = {
    firstname: 'pauline',
    lastname: 'keza',
    email: 'paulinekeza@hello.rw',
    password: process.env.TEST_USER_PASSWORD,
    isAdmin: false,
};

describe('#index', () => {
    context('/v1/auth/signup', () => {
        before((done) => {
            db.pool.query(`DELETE FROM users WHERE email = '${regularUser.email}'`)
                .then(res => done()).catch((err) => {
                    console.log(err.message);
                    done();
                });
        });

        it('should return a 201 status code, token and created user', (done) => {
            chai.request(app)
                .post('/v1/auth/signup')
                .type('application/x-www-form-urlencoded')
                .send(regularUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.data.should.be.an('array');
                    res.body.data[0].token.should.be.a('string');
                    res.body.data[0].user.should.be.an('object');
                    process.env.TEST_ADMIN_ID = res.body.data[0].user.id;
                    done();
                });
        });
    });
    context('/v1/auth/login', () => {
        it('should return a 200 status code, token and created user', (done) => {
            chai.request(app)
                .post('/v1/auth/login')
                .type('application/x-www-form-urlencoded')
                .send({
                    email: regularUser.email,
                    password: regularUser.password,
                    isAdmin: regularUser.isAdmin,
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data[0].token.should.be.an('string');
                    res.body.data[0].user.should.be.an('object');
                    done();
                });
        });
    });

    context('#Invalid url', () => {
        it('should return a 404 status code and an error message', (done) => {
            chai.request(app)
                .get('/v2/dert/rrr')
                .end((error, res) => {
                    res.should.have.status(404);
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });
});
