"use strict";

module.exports = function( options ) {
  var seneca = this
  var name = "blog"


  var postEnt    = seneca.make$('post')
  var commentEnt = seneca.make$('comment')


  // TODO:
  // field restrict
  // field validate


  seneca.add({role:'entity',cmd:'remove',name:'post'},removePostComments)
    .add({role:'entity',cmd:'save',name:'comment'}, setCommentOwner())
    .add({role:'user',cmd:'register'},addPermisionToRegisteredUser)
    .add({init:name}, blogPluginInit)


  function removePostComments (args, done){
    var seneca = this
    commentEnt.list$({post:args.q.id},function(err,list){
      if( err ) return done(err);

      list.forEach(function(comment){
        comment.remove$()
      })
    })
    seneca.prior(args,done)
  };


  function setCommentOwner(args,done){
    var seneca = this
    postEnt.load$(args.ent.post,function(err,post){
      if( err ) return done(err);

      args.ent.owner = post.owner
      seneca.prior(args,done)
    })
  }

  function addPermisionToRegisteredUser (args,done){
    args.perm = {
      own:{post:'*', comment:'*'}
    }
    this.prior(args,done)
  }

  function blogPluginInit( args, done ){
    seneca.act('role:basic, cmd:define_sys_entity',
      {list:[ 'post', 'comment' ]})

    seneca.act('role:user,cmd:register,name:U1,nick:u1,pass:u1', function (err, result) {

      if(err) console.error('Something Bad happened created the user')
      else console.log('Just created an User u1');

      done()
    })
  }

  return name;
}
