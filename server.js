"use strict";


var argv = require('optimist').argv
var port = argv.port || 3000

var express = require('express')


var seneca = require('seneca')()


seneca.use('user')
seneca.use('auth')

seneca.use( 'perm', {
  own:['post','comment'],
  anon:{ entity:{ post:'rq', comment:'crq' } }
})


seneca.use('jsonrest-api',{
  prefix:'/api'
})

seneca.use('data-editor',{admin:{local:true}})

seneca.use('blog')





var app = express()
//app.use( express.logger() )
app.use( express.favicon() )
app.use( express.cookieParser() )
app.use( express.query() )
app.use( express.bodyParser() )
app.use( express.methodOverride() )
app.use( express.json() )

app.use( seneca.export('web') )

app.use( express.static(__dirname+'/public' ) )  


module.exports = app





