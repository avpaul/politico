import chai from 'chai';
import chaihttp from 'chai-http';
import ENV from 'dotenv';
import app from '../../app';
import db from '../config/db';

ENV.config();

chai.use(chaihttp);
chai.should();

const testAdmin = {
    firstname: 'paul',
    lastname: 'smith',
    email: process.env.TEST_EMAIL,
    password: process.env.TEST_EMAIL_PASSWORD,
};
const regularUser = {
    firstname: 'pauline',
    lastname: 'keza',
    email: process.env.TEST_ADMIN_EMAIL,
    password: process.env.TEST_USER_PASSWORD,
    confirmPassword: process.env.TEST_USER_PASSWORD,
};

before((done) => {
    chai.request(app)
        .post('/v1/auth/login')
        .type('application/x-www-form-urlencoded')
        .send({
            password: process.env.TEST_EMAIL_PASSWORD,
            email: process.env.TEST_EMAIL,
        })
        .end((err, res) => {
            process.env.TEST_ADMIN_TOKEN = `Bearer ${res.body.data[0].token}`;
            process.env.TEST_ADMIN_ID = res.body.data[0].user.id;
            done();
        });
});

after((done) => {
    db.pool.query('DROP TABLE users CASCADE; DROP TABLE  offices CASCADE; DROP TABLE parties CASCADE; DROP TABLE candidates; DROP TABLE votes')
        .then(() => done()).catch((err) => {
            console.log(err.message);
            done();
        });
});

describe('#index', () => {
    context('/', () => {
        it('should return home page and 200 status code', (done) => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    context('/v1/auth/signup', () => {
        it('should return a 201 status code, token and created user', (done) => {
            chai.request(app)
                .post('/v1/auth/signup')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(regularUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.data.should.be.an('array');
                    res.body.data[0].token.should.be.a('string');
                    res.body.data[0].user.should.be.an('object');
                    process.env.TEST_USER_ID = res.body.data[0].user.id;
                    done();
                });
        });
    });

    // CREATING USER WITH A REGISTERED EMAIL
    context('/v1/auth/signup', () => {
        it('should return a 400 status code and an error message', (done) => {
            chai.request(app)
                .post('/v1/auth/signup')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    firstname: 'pauline',
                    lastname: 'keza',
                    email: '',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });

    // CREATING USER WITH A REGISTERED EMAIL
    context('/v1/auth/signup', () => {
        it('should return a 400 status code and an error message', (done) => {
            chai.request(app)
                .post('/v1/auth/signup')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(regularUser)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });

    context('/v1/auth/login', () => {
        it('should return a 200 status code, token and created user', (done) => {
            chai.request(app)
                .post('/v1/auth/login')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    email: regularUser.email,
                    password: regularUser.password,
                })
                .end((err, res) => {
                    process.env.TEST_USER_TOKEN = res.body.data[0].token;
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data[0].token.should.be.a('string');
                    res.body.data[0].user.should.be.an('object');
                    done();
                });
        });
    });

    context('/v1/auth/login', () => {
        it('should return a 400 status code and an error message', (done) => {
            chai.request(app)
                .post('/v1/auth/login')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    email: regularUser.email,
                    password: '',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });

    // WHEN YOU SEND WRONG CREDENTIALS-email
    context('/v1/auth/login', () => {
        it('should return a 404 status code, error message', (done) => {
            chai.request(app)
                .post('/v1/auth/login')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    email: `w${regularUser.email}`,
                    password: regularUser.password,
                    isAdmin: regularUser.isAdmin,
                })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });

    // WHEN YOU SEND WRONG CREDENTIALS-password
    context('/v1/auth/login', () => {
        it('should return a 400 status code, error message', (done) => {
            chai.request(app)
                .post('/v1/auth/login')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    email: regularUser.email,
                    password: `${regularUser.password}.`,
                    isAdmin: regularUser.isAdmin,
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });

    context('/v1/auth/resetlink', () => {
        it('should return a 200 status code,a message to check the user email inbox', (done) => {
            chai.request(app)
                .post('/v1/auth/resetlink')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    email: process.env.TEST_ADMIN_EMAIL,
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data[0].message.should.be.a('string');
                    res.body.data[0].email.should.be.eql(process.env.TEST_ADMIN_EMAIL);
                    done();
                });
        });
    });

    context('/v1/auth/resetlink', () => {
        it('should return a 400 status code and an error message', (done) => {
            chai.request(app)
                .post('/v1/auth/resetlink')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    email: '',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });

    // WHEN YOU SEND AN EMAIL OF A NON REGISTERED USER
    context('/v1/auth/resetlink', () => {
        it('should return a 404 status code and an error message', (done) => {
            chai.request(app)
                .post('/v1/auth/resetlink')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    email: 'princesultan@reg.com',
                })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
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
