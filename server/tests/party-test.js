const chai = require('chai');
const chaihttp = require('chai-http');
const app = require('../../app');

chai.use(chaihttp);
chai.should();

describe('#createParty', () => {
    context('POST /v1/parties', () => {
        // WHEN ALL DATA ARE COMPLETE
        it('should return a response with 200 status code and the name and id of the created party', (done) => {
            chai.request(app)
                .post('/v1/parties')
                .type('form')
                .send({
                    name: 'fpr',
                    hqAddress: 'Gahanga',
                    logoUrl: 'www.fpr.rw/resources/images/fpr.jpg',
                    description: 'it is the first party in membership and it is the ruling party since 2003',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('array');
                    done();
                });
        });

        // WHEN NO DATA WAS SENT
        it('should return 400 status and error message', (done) => {
            chai.request(app)
                .post('/v1/parties')
                .type('form')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });
});

describe('#getParty', () => {
    // GET ONE PARTY
    context('GET /v1/parties/:id', () => {
        it('should return one party and a status code of 200', (done) => {
            chai.request(app)
                .get('/v1/parties/0')
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.eql(1);
                    done();
                });
        });
        // WHEN ID IS NOT FOUND
        it('should return an error message and a status code of 400', (done) => {
            chai.request(app)
                .get('/v1/parties/:10')
                .end((error, res) => {
                    res.should.have.status(400);
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });
    // GET n OR all PARTIES
    context('GET /v1/parties', () => {
        it('should return an array of n or all parties with a 200 status code', (done) => {
            chai.request(app)
                .get('/v1/parties')
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    done();
                });
        });
    });
});

describe('#editParty', () => {
    context('PATCH /v1/parties/:id', () => {
        // WHEN ID & NAME IS PROVIDED
        it('should return 200 status and id & name of updated party', (done) => {
            chai.request(app)
                .patch('/v1/parties/0/name')
                .send({
                    name: 'fpr inkotanyi',
                })
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data[0].name.should.be.a('string');
                    done();
                });
        });
        // WHEN NO NAME WAS PROVIDED
        it('should return 400 status and an error message response', (done) => {
            chai.request(app)
                .patch('/v1/parties/0/name')
                .end((error, res) => {
                    res.should.have.status(400);
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });
    // WHEN CHANGING ALL PROPERTIES
    describe('PUT /v1/parties', () => {
        it('should return 200 status code and name & id of the updated party', (done) => {
            chai.request(app)
                .put('/v1/parties/0')
                .send({
                    name: 'rwanda patriotic front',
                    hqAddress: 'rusororo',
                    logoUrl: 'www.fpr.rw/resources/images/fpr.jpg',
                    description: 'it is the first party in membership and it is the ruling party since 2003',
                })
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('array');
                    done();
                });
        });
    });
});

describe('#deleteParty', () => {
    context('DELETE /v1/parties/:id', () => {
        // WHEN THE ID IS PROVIDED
        it('should return a deleted party message and 200 status', (done) => {
            chai.request(app)
                .delete('/v1/parties/0')
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('array');
                    done();
                });
        });

        // WHEN ID PROVIDED IS INCORRECT OR DOESN'T EXIST
        it('should return an error message and 404 status', (done) => {
            chai.request(app)
                .delete('/v1/parties/1000')
                .end((error, res) => {
                    res.should.have.status(404);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });
});
