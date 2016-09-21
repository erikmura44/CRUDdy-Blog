var express = require('express');
var router = express.Router();
var passport = require('../passport');
var query = require('../queries.js');

//----------LOGIN----------//
router.get('/login', function(req,res,next){
  res.render('login', {title: 'CRUDdy-Blog'});
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
})
);

//----------LOGOUT----------//
router.get('/logout', function(req,res){
  req.logout();
  res.redirect('/login');
});

//----------Get Blogs----------//
router.get('/', function(req, res, next) {
  query.getBlogs()
  .then(function(blogData){
    res.render('index', {
      blogs: blogData,
      title: 'CRUDdy-Blog'
    })
  });
});

//----------REGISTER----------//
router.get('/register', function(req,res,next){
  res.render('register', {title: 'CRUDdy-Blog'});
});

router.post('/register', function(req,res,next){
  query.add(
    req.body.username,
    req.body.password,
    req.body.fullName
  )
  .then(function(){
    res.redirect('/login');
  })
  .catch(function(err){
    res.render('error', {message: "This username is taken. Please try again.", link: '/register'});
    return;
  });
});

//----------POST----------//
router.get('/post', function(req,res,next){
  if(!req.isAuthenticated()){
    res.redirect('/login');
    return;
  }
  res.render('post', {
    user: req.user,
    title: 'CRUDdy-Blog'
  });
});

router.post('/post', function(req,res,next){
  if(!req.isAuthenticated()){
    res.redirect('/login');
    return;
  }
  query.findUserInformation(req.user.username)
  .then(function(userInfo){
    query.createPost(
      req.body.title,
      req.body.content,
      req.body.imageURL,
      userInfo.id,
      userInfo.fullName
    )
    .then(function(){
      res.redirect('/');
    });
  });
});

//----------CHAT----------//
router.get('/chat', function(req,res,next){
  if(!req.isAuthenticated()){
    res.redirect('/login');
    return;
  }
  query.findUserInformation(req.user.username)
  .then(function(userInfo){
    res.render('chat', {user_fullName: userInfo.fullName, user_username: userInfo.username});
  });
});

//----------SINGLE BLOG----------//
router.get('/:blogid', function(req,res,next){
  if(!req.isAuthenticated()){
    res.redirect('/login');
    return;
  }
  query.getBlogByID(req.params.blogid)
  .then(function(blogInfo){
    query.getComments(req.params.blogid)
    .then(function(comments){
      res.render('blog',{
        blog_id:req.params.blogid,
        blogInfo:blogInfo,
        comments:comments,
      });
    });
  });
});

//----------CREATE COMMENT----------//
router.post('/:blogid', function(req,res,next){
  if(!req.isAuthenticated()){
    res.redirect('/login');
    return;
  }
  var url = '/' + req.params.blogid;
  if(!req.isAuthenticated()){
    res.redirect('/login');
    return;
  }
  query.findUserInformation(req.user.username)
  .then(function(userInfo){
    query.createComment(userInfo.id,req.params.blogid,req.body.comment,userInfo.fullName)
    .then(
      res.redirect(url)
    );
  });
});

//----------EDIT BLOG----------//
router.get('/:blogid/editPost', function(req,res,next){
  if(!req.isAuthenticated()){
    res.redirect('/login');
    return;
  }
  var url = '/' + req.params.blogid;
  query.findUserInformation(req.user.username)
  .then(function(userInfo){
    query.getBlogByID(req.params.blogid)
    .then(function(blogInfo){
      if(userInfo.id !== blogInfo[0].user_id){
        res.render('error', {message: "This is not your blog post. You do not have access to edit.", link: url});
        return;
      }
      res.render('edit', {blogInfo: blogInfo});
    });
  });
});

router.post('/:blogid/editPost', function(req,res,next){
  if(!req.isAuthenticated()){
    res.redirect('/login');
    return;
  }
  var url = '/' + req.params.blogid;
  query.editBlogPost(req.params.blogid,req.body.title,req.body.content,req.body.image)
  .then(function(){
    res.redirect(url);
  });
});

//----------DELETE BLOG----------//
router.get('/:blogid/deletePost', function(req,res,next){
  if(!req.isAuthenticated()){
    res.redirect('/login');
    return;
  }
  var url = '/' + req.params.blogid;
  query.findUserInformation(req.user.username)
  .then(function(userInfo){
    query.getBlogByID(req.params.blogid)
    .then(function(blogInfo){
      if(userInfo.id !== blogInfo[0].user_id){
        res.render('error', {message: "This is not your blog post. You do not have access to edit.", link: url});
        return;
      }
      query.deleteComments(req.params.blogid)
      .then(function(){
        query.deleteBlogPost(req.params.blogid)
        .then(function(){
          res.redirect('/');
        });
      });
    });
  });
});

//----------EDIT COMMENT----------//
router.get('/:blogid/:commentid/editComment', function(req,res,next){
  if(!req.isAuthenticated()){
    res.redirect('/login');
    return;
  }
  var url = '/' + req.params.blogid;
  query.findUserInformation(req.user.username)
  .then(function(userInfo){
    query.getBlogByID(req.params.blogid)
    .then(function(blogInfo){
      query.getCommentsByID(req.params.commentid)
      .then(function(commentById){
        if(userInfo.id !== commentById[0].user_id){
          res.render('error', {message: "This is not your comment. You do not have access to edit.", link: url});
          return;
        }
        res.render('comment', {blogInfo: blogInfo, commentById: commentById});
      });
    });
  });
});

router.post('/:blogid/:commentid/editComment', function(req,res,next){
  if(!req.isAuthenticated()){
    res.redirect('/login');
    return;
  }
  var url = '/' + req.params.blogid;
  query.editComment(req.params.commentid,req.body.commentEdit)
  .then(function(){
    res.redirect(url);
  });
});

//----------DELETE COMMENT----------//
router.get('/:blogid/:commentid/deleteComment', function(req,res,next){
  if(!req.isAuthenticated()){
    res.redirect('/login');
    return;
  }
  var url = '/' + req.params.blogid;
  query.findUserInformation(req.user.username)
  .then(function(userInfo){
    query.getCommentsByID(req.params.commentid)
    .then(function(commentById){
      if(userInfo.id !== commentById[0].user_id){
        res.render('error', {message: "This is not your comment. You do not have access to delete.", link: url});
        return;
      }
      query.deleteComment(req.params.commentid)
      .then(function(){
        res.redirect(url);
      });
    });
  });
});




module.exports = router;
