import chai from 'chai';
import chaihttp from 'chai-http';
import ENV from 'dotenv';
import app from '../../app';

ENV.config();

chai.use(chaihttp);
chai.should();

const party = {
    id: '',
    name: 'rwanda patriotic front',
    hqAddress: 'rusororo gasabo kigali',
    logoUrl: 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwiSueXSnLzgAhX1DWMBHc8bBqwQjRx6BAgBEAU&url=https%3A%2F%2Ftwitter.com%2Frpfinkotanyi&psig=AOvVaw1vUYTOqlkEAHSBGZDrRqDf&ust=1550267849389637',
    description: `The Rwandan Patriotic Front (RPF-Inkotanyi, French: Front patriotique rwandais, FPR)
                is the ruling political party in Rwanda. Led by President Paul Kagame, the party has
                 governed the country since its armed wing ended the Rwandan genocide in 1994.`,
};
const badParty = {
    name: '',
    hqAddress: 'rusororo gasabo kigali',
    logoUrl: 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwiSueXSnLzgAhX1DWMBHc8bBqwQjRx6BAgBEAU&url=https%3A%2F%2Ftwitter.com%2Frpfinkotanyi&psig=AOvVaw1vUYTOqlkEAHSBGZDrRqDf&ust=1550267849389637',
    description: `The Rwandan Patriotic Front (RPF-Inkotanyi, French: Front patriotique rwandais, FPR)
                is the ruling political party in Rwanda. Led by President Paul Kagame, the party has
                 governed the country since its armed wing ended the Rwandan genocide in 1994.`,
};

describe('#Party', () => {
    describe('POST /v1/parties', () => {
        // WHEN ALL DATA ARE COMPLETE
        it('should return a response with 201 status code and the name and id of the created party', (done) => {
            chai.request(app)
                .post('/v1/parties')
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .send(party)
                .end((err, res) => {
                    party.id = res.body.data[0].id;
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('array');
                    res.body.data[0].name.should.eql(party.name);
                    done();
                });
        });
        // TRY TO CREATE A DUPLICATE
        it('should return a response with 403 status code and an error message', (done) => {
            chai.request(app)
                .post('/v1/parties')
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .send(party)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    done();
                });
        });
        // TRY TO CREATE A PARTY WITHOUT A NAME
        it('should return a response with 400 status code and an error message', (done) => {
            chai.request(app)
                .post('/v1/parties')
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .send(badParty)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.error.should.be.an('array');
                    res.body.error[0].should.be.a('string');
                    done();
                });
        });

        // WHEN NO DATA WAS SENT
        it('should return 400 status and error message', (done) => {
            chai.request(app)
                .post('/v1/parties')
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .type('form')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.error[0].should.be.a('string');
                    done();
                });
        });
    });

    // GET ONE PARTY
    describe('GET /v1/parties/:id', () => {
        it('should return one party and a status code of 200', (done) => {
            chai.request(app)
                .get(`/v1/parties/${party.id}`)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.eql(1);
                    res.body.data[0].name.should.eql(party.name);
                    res.body.data[0].hqaddress.should.eql(party.hqAddress);
                    res.body.data[0].logourl.should.eql(party.logoUrl);
                    done();
                });
        });
        // WHEN ID IS NOT FOUND
        it('should return an error message and a status code of 404', (done) => {
            chai.request(app)
                .get('/v1/parties/1000')
                .end((error, res) => {
                    res.should.have.status(404);
                    res.body.error[0].should.be.a('string');
                    done();
                });
        });
    });
    // GET all PARTIES
    describe('GET /v1/parties', () => {
        it('should return an array of all parties with a 200 status code', (done) => {
            chai.request(app)
                .get('/v1/parties')
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data[0].name.should.eql(party.name);
                    res.body.data[0].hqaddress.should.eql(party.hqAddress);
                    res.body.data[0].logourl.should.eql(party.logoUrl);
                    done();
                });
        });
    });

    describe('PATCH /v1/parties/:id', () => {
        // WHEN ID & NAME IS PROVIDED
        it('should return 200 status and id & name of updated party', (done) => {
            chai.request(app)
                .patch(`/v1/parties/${party.id}/name`)
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .send({
                    name: 'fpr inkotanyi',
                })
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data[0].name.should.be.a('string');
                    res.body.data[0].name.should.not.eql(party.name);
                    done();
                });
        });
        // WHEN NO NAME WAS PROVIDED
        it('should return 400 status and an error message response', (done) => {
            chai.request(app)
                .patch(`/v1/parties/${party.id}/name`)
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .end((error, res) => {
                    res.should.have.status(400);
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });
    describe('PUT /v1/parties/:id', () => {
        it('should return 200 status code and name & id of the updated party', (done) => {
            chai.request(app)
                .put(`/v1/parties/${party.id}`)
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .send({
                    name: 'rwanda patriotic front',
                    hqAddress: 'rusororo gasabo kigali rwanda',
                    logoUrl: 'https://www.fpr.rw/resources/images/fpr.jpg',
                    description: 'it is the first party in membership and it is the ruling party since 2003',
                })
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('array');
                    res.body.data[0].name.should.eql(party.name);
                    done();
                });
        });
        it('should return 404 status code and an error message', (done) => {
            chai.request(app)
                .put('/v1/parties/1000')
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .send({
                    name: 'rwanda patriotic front',
                    hqAddress: 'rusororo gasabo kigali rwanda',
                    logoUrl: 'https://www.fpr.rw/resources/images/fpr.jpg',
                    description: 'it is the first party in membership and it is the ruling party since 2003',
                })
                .end((error, res) => {
                    res.should.have.status(404);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });

    describe('DELETE /v1/parties/:id', () => {
        // WHEN THE ID IS PROVIDED
        it('should return a deleted party message and 200 status', (done) => {
            chai.request(app)
                .delete(`/v1/parties/${party.id}`)
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
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
                .set('Authorization', process.env.TEST_ADMIN_TOKEN)
                .end((error, res) => {
                    res.should.have.status(404);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });
});