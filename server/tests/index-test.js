import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../../app';

chai.use(chaihttp);
chai.should();

describe('#invalidURL', () => {
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
