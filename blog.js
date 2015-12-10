"use strict";

module.exports = function( options ) {
  var seneca = this
  var name = "blog"


  var postent    = seneca.make$('post')
  var commentent = seneca.make$('comment')


  // TODO:
  // field restrict
  // field validate


  seneca.add({role:'entity',cmd:'remove',name:'post'},function(args,done){
    var seneca = this
    commentent.list$({post:args.q.id},function(err,list){
      if( err ) return done(err);

      list.forEach(function(comment){
        comment.remove$()
      })
    })
    seneca.prior(args,done)
  })


  seneca.add({role:'entity',cmd:'save',name:'comment'},function(args,done){
    var seneca = this
    postent.load$(args.ent.post,function(err,post){
      if( err ) return done(err);
      
      args.ent.owner = post.owner
      seneca.prior(args,done)
    })
  })



  seneca.add({role:'user',cmd:'register'},function(args,done){
    args.perm = {
      own:{post:'*', comment:'*'}
    }
    this.prior(args,done)
  })


  seneca.add({init:name}, function( args, done ){
    seneca.act('role:basic, cmd:define_sys_entity',
               {list:[ 'post', 'comment' ]})

    seneca.act('role:user,cmd:register,name:U1,nick:u1,pass:u1', function (err, result) {

      if(err) console.error('Something Bad happened created the user')
      else console.log('Just created an User u1');

      done()
    })
  })


  return name;
}
