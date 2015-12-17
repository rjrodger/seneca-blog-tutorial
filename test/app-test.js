const Code = require('code');
const Lab = require('lab');
const request = require('supertest')

const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const expect = Code.expect;

const serverPath = '../server';


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
})