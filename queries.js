var bcrypt = require('bcrypt');
var knex = require('./db/knex.js');

//User Queries
function hashPassword(password){
  return bcrypt.hashSync(password,10);
}

function findUser(username){
  return knex('user').select('username').where('username',username).first();
}

function findUserInformation(username){
  return knex('user').select('id','username','fullName').where('username',username).first();
}

function findHashedPassword(username){
  return knex('user').select('user.password').where('user.username',username).first();
}

function authenticateUser(username, password){
  return findUser(username)
  .then(function(userData){
    if(!userData){
      return false;
    }
    return findHashedPassword(username)
    .then(function(hashedPassword){
      hashedPassword = hashedPassword.password;
      return bcrypt.compareSync(password, hashedPassword);
    });
  });
}

function addUser(username,password,fullName){
  if(!username || !password || !fullName){
    return false;
  }
  return findUser(username)
  .then(function(data){
    if(data){
      return false;
    }
    return knex('user').insert({username: username, password: hashPassword(password),admin:true,fullName:fullName});
  })
  .catch(function(err){
    return err;
  });
}

//Blog//
function getBlogs(){
  return knex('blog').select('id AS blog_id','title','content','imageURL','user_fullName').orderBy('id','desc');
}

function getBlogByID(id){
  return knex('blog').select('id','title','user_fullName','content AS blogContent', 'user_id','imageURL').where('id',id);
}

function getBlogByTitle(title){
  return knex('blog').select('id').where('title',title);
}

function getComments(blog_id){
  return knex('comment').select('comment.id AS comment_id','comment.blog_id','user.fullName AS comment_user','comment.content as comment_content').innerJoin('user','comment.user_id','user.id').where('comment.blog_id',blog_id);
}

function getCommentsByID(comment_id){
  return knex('comment').select('id AS comment_id', 'blog_id','content AS comment_content','user_id').where('id',comment_id);
}

function createPost(title,content,image,user_id,user_fullName){
  return knex('blog').insert({title: title, content:content, imageURL:image, user_id: user_id, user_fullName: user_fullName});
}

function createComment(user_id,blog_id,content,user_fullName){
  return knex('comment').insert({user_id:user_id, blog_id:blog_id, content:content, user_fullName: user_fullName});
}

function editBlogPost(blog_id,title,content,image){
  return knex('blog').update({title:title, content:content, imageURL:image,}).where('id',blog_id);
}

function deleteComments(blog_id){
  return knex('comment').where('blog_id',blog_id).del();
}

function deleteBlogPost(blog_id){
  return knex('blog').where('id',blog_id).del();
}

function editComment(comment_id,content){
  return knex('comment').update({content:content}).where('id',comment_id);
}

function deleteComment(comment_id){
  return knex('comment').where('id',comment_id).del();
}

module.exports = {
  find: findUser,
  findUserInformation: findUserInformation,
  authenticate: authenticateUser,
  add: addUser,
  getBlogs: getBlogs,
  getBlogByID: getBlogByID,
  getBlogByTitle: getBlogByTitle,
  getComments: getComments,
  getCommentsByID: getCommentsByID,
  createPost: createPost,
  createComment: createComment,
  editBlogPost: editBlogPost,
  deleteComments: deleteComments,
  deleteBlogPost: deleteBlogPost,
  editComment: editComment,
  deleteComment: deleteComment
};
