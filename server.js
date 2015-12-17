"use strict";

var serveStatic = require('serve-static')
var favicon = require('serve-favicon')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

function appBuilder() {
  var express = require('express')

  var seneca = require('seneca')()


  seneca.use('user')
  seneca.use('auth')

  seneca.use('perm', {
    own: ['post', 'comment'],
    anon: {entity: {post: 'rq', comment: 'crq'}}
  })


  seneca.use('jsonrest-api', {
    prefix: '/api'
  })

  seneca.use('data-editor', {admin: {local: true}})

  seneca.use('blog')


  var app = express()
      //.use(favicon())
      .use(cookieParser())
      .use(express.query())
      .use(bodyParser())
      .use(methodOverride())
      .use(bodyParser.json())

      .use(seneca.export('web'))

      .use(serveStatic(__dirname + '/public'))

  return app;
}

module.exports = appBuilder





