"use strict";

var argv = require('optimist').argv
var port = argv.port || 3000

var app = require('./server')()

app.listen( port, function() {
  console.log('listening on ' + port)
})





