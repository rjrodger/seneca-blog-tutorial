const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const serverPath = '../server'


describe('Server', function () {

  it('can be created', function (done) {
    var server = require(serverPath)();
    expect(server).to.exist();
    done()
  }),

    it('can be started and stop', function (done) {
      var server = require(serverPath)();
      server.listen(function () {
        server.close(done)
      })
    })

})


describe('Main routes are working', function(){

})