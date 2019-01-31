const chai = require('chai');
const chaihttp = require('chai-http');
const app = require('../app');

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
                .send({})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });
});
