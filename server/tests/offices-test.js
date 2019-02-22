import chai from 'chai';
import chaihttp from 'chai-http';
import ENV from 'dotenv';
import db from '../config/db';
import app from '../../app';

ENV.config();

chai.use(chaihttp);
chai.should();

const admin = {
    id: process.env.TEST_ADMIN_ID,
    token: '',
};

const vote = {
    office: '',
    voter: process.env.TEST_ADMIN_ID,
    candidate: process.env.TEST_USER_ID,
};

const office = {
    type: 'federal',
    name: 'mayor',
    description: `Role of the mayor. As the head of the city, the mayor officially speaks
                  for both the government and the community as a whole. In all statutory
                  cities and in most charter cities, the mayor is the presiding officer
                  and a regular member of the city council.`,
};

describe('#offices', () => {
    // CREATE OFFICE
    context('POST /v1/offices', () => {
        it('should return created office name and 201 status code', (done) => {
            chai.request(app)
                .post('/v1/offices')
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .send(office)
                .end((error, res) => {
                    office.id = res.body.data[0].id;
                    vote.office = office.id;
                    res.should.have.status(201);
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.eql(1);
                    res.body.data[0].name.should.eql(office.name);
                    done();
                });
        });
    });

    // CREATE A DUPLICATE OFFICE
    context('POST /v1/offices', () => {
        it('should return an error message and 400 status code', (done) => {
            chai.request(app)
                .post('/v1/offices')
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .send(office)
                .end((error, res) => {
                    res.should.have.status(400);
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });
    // CREATE OFFICE WITHOUT A TOKEN
    context('POST /v1/offices', () => {
        it('should return 401 status code', (done) => {
            chai.request(app)
                .post('/v1/offices')
                .send(office)
                .end((error, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    // CREATE OFFICE WITHOUT DATA
    context('POST /v1/offices', () => {
        it('should an error message and 400 status code', (done) => {
            chai.request(app)
                .post('/v1/offices')
                .query({ token: process.env.TEST_ADMIN_TOKEN.split(' ')[1] })
                .send({
                    type: '',
                    name: 'accountant',
                    description: '',
                })
                .end((error, res) => {
                    res.should.have.status(400);
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });

    // GET ALL OFFICES
    context('GET /v1/offices', () => {
        it('should return an array of all offices created and a 200 status code', (done) => {
            chai.request(app)
                .get('/v1/offices')
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data[0].name.should.eql(office.name);
                    res.body.data[0].type.should.eql(office.type);
                    res.body.data[0].id.should.eql(office.id);
                    done();
                });
        });
    });

    // GET ONE OFFICE
    // WHEN ID EXISTS
    context('GET /v1/offices/:id', () => {
        it('should return an array of one office and a 200 status code ', (done) => {
            chai.request(app)
                .get(`/v1/offices/${office.id}`)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data[0].name.should.eql(office.name);
                    res.body.data[0].type.should.eql(office.type);
                    res.body.data[0].id.should.eql(office.id);
                    done();
                });
        });
    });


    // REGISTER A CANDIDATE
    describe('POST /v1/offices/:id/register', () => {
        it('should return a 201 status code and the candidate(user)id registered and the office id registered for', (done) => {
            chai.request(app)
                .post(`/v1/offices/${office.id}/register`)
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .send({
                    userId: process.env.TEST_USER_ID,
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.data.should.be.an('object');
                    res.body.data.office.should.be.an('object');
                    res.body.data.office.id.should.eql(Number(office.id));
                    res.body.data.user.should.be.an('object');
                    res.body.data.user.id.should.eql(Number(process.env.TEST_USER_ID));
                    done();
                });
        });
    });

    // DUPLICATE A CANDIDATE
    describe('POST /v1/offices/:id/register', () => {
        it('should return a 400 status code and an error message', (done) => {
            chai.request(app)
                .post(`/v1/offices/${office.id}/register`)
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .send({
                    userId: process.env.TEST_USER_ID,
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });

    // REGISTER A CANDIDATE WITHOUT AN ID
    describe('POST /v1/offices/:id/register', () => {
        it('should return a 400 status code and an error message', (done) => {
            chai.request(app)
                .post(`/v1/offices/${office.id}/register`)
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .send({
                    userId: '',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });

    // VOTE A CANDIDATE
    describe('POST /v1/vote', () => {
        it('should return a 201 status code', (done) => {
            chai.request(app)
                .post('/v1/vote')
                .query({ token: process.env.TEST_USER_TOKEN })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    office: office.id,
                    voter: process.env.TEST_USER_ID,
                    candidate: process.env.TEST_USER_ID,
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.data.should.be.an('object');
                    res.body.data.office.id.should.eql(office.id);
                    res.body.data.candidate.id.should.eql(Number(process.env.TEST_USER_ID));
                    res.body.data.voter.id.should.eql(Number(process.env.TEST_USER_ID));
                    done();
                });
        });
    });

    // VOTE A CANDIDATE two times
    describe('POST /v1/vote', () => {
        it('should return a 400 status code and an error message', (done) => {
            chai.request(app)
                .post('/v1/vote')
                .query({ token: process.env.TEST_USER_TOKEN })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    office: office.id,
                    voter: process.env.TEST_USER_ID,
                    candidate: process.env.TEST_USER_ID,
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });

    // SEND INCOMPLETE DATA TO VOTE A CANDIDATE
    describe('POST /v1/vote', () => {
        it('should return a 400 status code and an error message', (done) => {
            chai.request(app)
                .post('/v1/vote')
                .query({ token: process.env.TEST_USER_TOKEN })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    office: office.id,
                    voter: '',
                    candidate: '',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });

    // ADMIN CAN'T VOTE
    describe('POST /v1/vote', () => {
        it('should return a 400 status code and an error message', (done) => {
            chai.request(app)
                .post('/v1/vote')
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    office: office.id,
                    voter: process.env.TEST_ADMIN_ID,
                    candidate: process.env.TEST_USER_ID,
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });

    // VOTE A CANDIDATE WITHOUT A VOTER ID
    describe('POST /v1/vote', () => {
        it('should return a 400 status code and an error message', (done) => {
            chai.request(app)
                .post('/v1/vote')
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    office: office.id,
                    voter: '',
                    candidate: process.env.TEST_USER_ID,
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });

    // GET ELECTION RESULTS
    describe('POST /v1/office/:id/result', () => {
        it('should return a 200 status code and an array of candidates and results', (done) => {
            chai.request(app)
                .get(`/v1/office/${office.id}/result`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data[0].office.id.should.eql(office.id);
                    res.body.data[0].result.should.eql(1);
                    done();
                });
        });
    });

    // WHEN ID DOES NOT EXIST
    context('GET /v1/offices/:id', () => {
        it('should return an error message and a 400 status code ', (done) => {
            chai.request(app)
                .get('/v1/offices/1000')
                .end((error, res) => {
                    res.should.have.status(404);
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });
});
