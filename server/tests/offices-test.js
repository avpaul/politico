import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../../app';

chai.use(chaihttp);
chai.should();

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
                .send(office)
                .end((error, res) => {
                    res.should.have.status(201);
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.eql(1);
                    res.body.data[0].name.should.eql(office.name);
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
                    res.body.data[0].id.should.eql(1);
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
                    res.body.data[0].name.should.eql(office.name);
                    res.body.data[0].type.should.eql(office.type);
                    res.body.data[0].id.should.eql(1);
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
