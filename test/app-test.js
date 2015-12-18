var Code = require('code');
var Lab = require('lab');
var request = require('supertest')

var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;
var expect = Code.expect;

var serverPath = '../server';


describe('Server', function () {

  it('can be created', function (done) {
    var server = require(serverPath)();
    expect(server).to.exist();
    done()
  }),

    it('can be started and stop', function (done) {
      var server = require(serverPath)();
      var serverListener = server.listen(function (err) {
        expect(err).to.not.exists();

        serverListener.close(done);

      })
    })

})


describe('Routes', function () {
  var app, serverListener
  beforeEach(function (done) {
    app = require(serverPath)();
    serverListener = app.listen(done)
  })

  afterEach(function (done) {
    serverListener.close(done);
  })

  describe('static', function () {

    it('serve index implicitely', function (done) {
      request(app).get('/')
        .set('Accept','text/html')
        .expect(200)
        .expect(function (res) {
        expect(res.text).to.match(/Seneca Blog/);
      })
        .end(done)
    });


    it('serve index explicitely', function (done) {
      request(app).get('/index.html')
        .expect(200)
        .expect(function (res) {
          expect(res.text).to.match(/Seneca Blog/);
        })
        .end(done)
    });


    it('404 when needed', function (done) {
      request(app).get('/404')
        .expect(404)
        .end(done)
    });
  });

  describe('api', function () {

    it('can access post', function (done) {
      request(app).get('/api/posts')
        .expect(200)
        .end(done)
    });

    it('can access comments', function (done) {
      request(app).get('/api/comments')
        .expect(200)
        .end(done)
    });

  });


})
