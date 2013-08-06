
$(function(){
  var user


  var contentmap = {}
  $('.content').each(function(index,content){
    contentmap[ $(content).attr('id') ] = $(content)
  })


  var templates = {
    post:    $('#list li'),
    comment: $('#comment_list li'),
  }

  var api = {
    save: function( name, data, success, failure ) {
      $.ajax('/api/'+name+(data.id?'/'+data.id:''),{
        type:'post',
        data:data,
        success:success,
        failure:failure
      })
    },
    load: function( name, id, success, failure ) {
      $.ajax('/api/'+name+'/'+id,{
        type:'get',
        success:success,
        failure:failure
      })
    },
    list: function( name, success, failure ) {
      $.ajax('/api/'+name,{
        type:'get',
        success:success,
        failure:failure
      })
    },
    remove: function( name, id, success, failure ) {
      $.ajax('/api/'+name+'/'+id,{
        type:'delete',
        success:success,
        failure:failure
      })
    }
  }

  
  var current_list = []
  var current_post
  var current_comments = []


  function show() {
    _.each(contentmap,function(content){
      content.addClass('hide')
    })
    _.each( arguments, function(contentname) {
      contentmap[contentname].removeClass('hide')
    })
  }


  function failalert() {
    alert('Server error - please try again.')
  }




  $('#edit_form').submit(function(event){
    event.preventDefault()
    api.save('post', {
      id:$('#edit_id').val(),
      title:$('#edit_title').val(),
      text:$('#edit_text').val()
    }, function( post ){ render_view( post )}, failalert ) 
  })


  $('#comment_form').submit(function(event){
    event.preventDefault()
    api.save('comment', {
      post: current_post.id,
      commenter:$('#comment_commenter').val(),
      body:$('#comment_body').val()
    }, function( comment ){ 
      current_comments.push(comment)
      render_view()
    }, failalert )
  })




  $('#nav_new').click( function() {
    render_edit()
  })

  $('#nav_list').click( function() {
    api.list('post',function(list){
      render_list( list )
    })
  })

  $('#nav_login').click( function() {
    show('login')
  })

  $('#nav_logout').click( function() {
    window.location.href = '/auth/logout'
  })


  function render_edit( post ) {
    post = post || {id:'',title:'',text:''}

    $('#edit_id').val(post.id),
    $('#edit_title').val(post.title),
    $('#edit_text').val(post.text)

    $('#edit_back').click( function(){render_list()} )

    load_comments( post )
    show('edit','comment_list')
  }


  function render_view( post ) {
    post = post || current_post
    current_post = post

    $('#view_title').text(post.title),
    $('#view_text').text(post.text)

    $('#view_back').click( function(){render_list()} )
    $('#view_edit').click( function(){
      render_edit(post)
    })

    $('#comment_commenter').val(''),
    $('#comment_body').val('')

    load_comments( post )
    show('view','comment','comment_list')
  }



  function render_list(list) {
    list = list || current_list
    current_list = list

    $('#list').empty()
    _.each(list,function(post){
      var entry = templates.post.clone()


      entry.find('.title').text(post.title).click(function(){
        render_view(post)
      })

      entry.find('.edit').click(function(){
        render_edit(post)
      })

      entry.find('.delete').click(function(){
        if( confirm( "Are you sure?") ) {
          api.remove('post',post.id,function(){
            list = _.filter(list,function(item){return item.id!=post.id})
            render_list( list )
          })
        }
      })

      $('#list').append( entry )
    })

    show('list')
  }


  function load_comments(post) {
    $('#comment_list').empty()
    if( !post.id ) return;

    api.list('comment?post='+post.id,function(list){
      _.each(list,function(comment){
        var entry = templates.comment.clone()
        entry.find('.commenter').text(comment.commenter)
        entry.find('.body').text(comment.body)

        entry.find('.delete').click(function(){
          if( confirm( "Are you sure?") ) {
            api.remove('comment',comment.id,function(){
              load_comments(post)
            })
          }
        })

        $('#comment_list').append( entry )
      })
    })
  }


  api.list('post',function(list){
    render_list( list )
  })


  $.ajax('/auth/instance',{
    success:function(out){
      if( out.user ) {
        user = out.user

        $('#user_name').text(out.user.name)
        $('#hello').removeClass('hide')
        $('#nav_login').addClass('hide')

        $('.auth').removeClass('hide')
        templates.post.find('.auth').removeClass('hide')        
        templates.comment.find('.auth').removeClass('hide')        
      }
    },
    failure:failalert
  })
})
