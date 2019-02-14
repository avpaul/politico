import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../../app';

chai.use(chaihttp);
chai.should();

describe('#offices', () => {
    // CREATE OFFICE
    context('POST /v1/offices', () => {
        it('should return created office props and 201 status code', (done) => {
            chai.request(app)
                .post('/v1/offices')
                .send({
                    type: 'state',
                    name: 'city mayor',
                    description: 'The city mayor is the head of the city he is in charge of everything happening in the city',
                })
                .end((error, res) => {
                    res.should.have.status(201);
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.eql(1);
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
                    res.body.data[0].name.should.be.a('string');
                    done();
                });
        });
    });

    // GET ONE OFFICE
    // WHEN ID EXISTS
    context('GET /v1/offices/:id', () => {
        it('should return an array of one office and a 200 status code ', (done) => {
            chai.request(app)
                .get('/v1/offices/1')
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data[0].name.should.be.a('string');
                    done();
                });
        });
    });

    // WHEN ID DOES NOT EXIST
    context('GET /v1/offices/:id', () => {
        it('should return an error message and a 400 status code ', (done) => {
            chai.request(app)
                .get('/v1/offices/100')
                .end((error, res) => {
                    res.should.have.status(404);
                    res.body.error.should.be.a('string');
                    done();
                });
        });
    });
});
