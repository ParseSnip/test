let sinon = require('sinon');
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let assert = require('chai').assert;
let should = require('chai').should();
let expect = require('chai').expect;

 
chai.use(chaiHttp);
describe('MyAPI', function() {
  // beforeEach(function() {
  //   this.xhr = sinon.useFakeXMLHttpRequest();
 
  //   this.requests = [];
  //   this.xhr.onCreate = function(xhr) {
  //     this.requests.push(xhr);
  //   }.bind(this);
  // });
 
  // afterEach(function() {
  //   this.xhr.restore();
  // });
 //above = boiler plate

  //Tests etc. go here

  it('should be true', () => {
      let thing = true;

      assert.equal(true, thing);
  });

  it('should test something', function(done) {
    done();
  });

  it('should get valid JSON response and have Essential Backpack as the first item', (done) => {
    chai.request(app)
        .get('/api/products/search?keywords=Back')//endpoint to test
        .end((err, res) => {
            res.should.have.status(200);
            res.body[0].name.should.be.eq("Essential Backpack")
            done();
        });   
  });

  it('should get valid response with empty response body', (done) => {
    chai.request(app)
        .get('/api/products/search?keywords=dfhfdgdfff')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.eql([]);
            done();
        });   
  });

  it('should get 404 for response that does not exist', (done) => {
    chai.request(app)
        .get('/api/products/abc')
        .end((err, res) => {
            res.should.have.status(404);
            done();
        });   
  });

  it('should get 200 for valid search parameters', (done) => {
    chai.request(app)
        .get('/api/products/search?keys=Back')
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });   
  });
  
  it('should have results equal 1 for valid colour search', (done)=>{
    chai.request(app)
      .get('/api/products/detailSearch?color[op]=eq&color[val]=orange')
      .end((err,res)=>{
        res.body.should.have.lengthOf(1)
        
        done()
      })
  })
});