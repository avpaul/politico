const chai = require('chai');
const chaihttp = require('chai-http');
const app = require('../app');

chai.use(chaihttp);
chai.should();

describe('#deleteParty', () => {
  context('DELETE /v1/parties/:id', () => {
    // WHEN THE ID IS PROVIDED
    it('should return a deleted party message and 204 status', (done) => {
      chai.request(app)
        .delete('/v1/parties/1')
        .end((error, res) => {
          res.should.have.status(204);
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
