/*这个路由模块实际上可以和app.js文件写到一起，这样就不用导入导出了。
 *但是通常一个网站含有多个网页，可以通过get函数的第一个参数指定的路径来调用不同的相应函数
 *这样可以保持app.js代码的简洁性，代码模块化思想。
 *
 *通常我们路由控制器和实现路由的函数都放在index.js中，在app.js中只有一个总的路由接口
 */

/*
  //加载express模块
  var express = require('express');
  //生成一个路由实例
  var router = express.Router();

  //GET home page.
  //用路由实例来捕获访问主页的GET请求，
  //导出这个路由并在app.js中通过app.use('/',routes)；加载。
  //这样，当访问主页时，就会调用res.render('index', {title:'Express'});
  //渲染views/index.ejs模板并显示到浏览器中。
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
  //导出router实例供其它模块调用
  module.exports = router;
*/

//修改之后的代码如下：
//引入核心模块crypto生成散列值来加密密码

var crypto = require('crypto');
//引入User进行数据库操作
var Controllers = require('../controllers');
var passport = require('passport');
var async = require('async');
module.exports = function(app) {

  app.get('/api/validate',function(req,res){
    var _userId = req.session._userId;

    if (_userId){
      Controllers.User.findUserById(_userId,function(err,user){
        if (err) {
          res.json(401, {
            msg: err
          });
        }else{
          res.json(user);
        };
      });
    }else{
      res.json(401,null);
    }
  });

  app.post('/api/login',function(req,res){
    var email = req.body.email;
    if (email) {
      Controllers.User.findByEmailOrCreate(email,function(err,user){
        if(err) {
          res.json(500,{
            msg:err
          });
        }else{
          req.session._userId = user._id;
          Controllers.User.online(user._id,function(err,user){
            if(err){
              res.json(500, {
                msg: err
              });
            } else {
              res.json(user);
            }
          });
        }
      });
    }else{
      res.json(403);
    }
  });

  app.get('/api/logout',function(req,res){
    var _userId = req.session._userId;
    Controllers.User.offline(_userId,function(err,user){
      if(err){
        res.json(500, {
          msg: err
        });
      } else {
        res.json(200);
        delete req.session._userId;
      };
    });
  });

//-----------------------------------------------------------
//
//                        原来代码
//
//-----------------------------------------------------------
  app.get('/api/blog', function(req, res) {
    var page=req.query.p ? parseInt(req.query.p) : 1;
    _userId=req.session._userId;
    if(_userId) {
      async.series([function(done){
        Controllers.User.findUserById(_userId,function(err,user){
          if (err){
            done(err);
          }else{
            if (!user){
              done("No such user!");
            }else{
              done(null,user.name);
            }
          }
        });
      }],function(err,results){
        Controllers.Post.getTen(results[0],page,function(err,posts,total) {
          if (err) {
            posts = [];
          }
          res.json({
            title: '主页',
            user: results[0],
            posts: posts,
            page: page
          });
        });
      });
    }else {
      res.json(401);
    }
  });
  //<><><><><><><><><><><><><><><><><><><><>
  app.get('/api/login/github',passport.authenticate("github",{
    session:false
  }));
  app.get('/api/login/github/callback',passport.authenticate("github",{
    session:false,
    failureRedirect:'/api/login',
    successFalsh:'登陆成功！'
  }),function(req,res){
    var newUser = new db.User({
      name: req.user.username,
      password: "111111",
      email: ""
    });
    User.get(newUser.name, function (err, user) {
      if (err) {
        return res.json(500)
      }
      if (user) {
        return res.json(user);//返回注册页
      }
      //如果不存在则新增用户
      req.session.user = {name: req.user.username, head: "https://gravatar.com/avatar/"+req.user._json.gravatar_id+"?s=48"};
      newUser.save(function(err,user) {
        if(err) {
          return res.json(401);
        }
        req.session.user = user;//用户信息存入session
        return res.json(user);//注册成功后返回主页
      });
    });
  });
  //似乎不需要这段了
  //app.get('/api/blog/post', checkLogin);
  app.get('/api/blog/post', function(req, res) {
    res.json({
      title: '发表',
      user: req.session.user
   });
  });

  //app.post('/api/blog/post', checkLogin);
  app.post('/api/blog/post', function(req, res) {
    var post = {
          name: req.body.name,
          avatarUrl: req.body.avatarUrl,
          title: req.body.title,
          tags: req.body.tags,
          post: req.body.post
    };
    Controllers.Post.create(post,function(err,post){
      if (err) {
        return res.json(500);
      }
      res.json(200);
    });
  });
  //必要性？
  //app.get('/api/blog/upload', checkLogin);
  app.get('/api/blog/upload', function(req, res) {
    res.json({
      title: '文件上传',
      user: req.session.user
    });
  });

  //app.post('/api/blog/upload', checkLogin);
  app.post('/api/blog/upload', function(req, res) {
    res.json(200);
  });

  //app.get('/api/blog/archive', checkLogin);
  app.get('/api/blog/archive', function(req, res) {
    Post.getArchive(function(err,posts) {
      if (err) {
        return res.json(500);
      }
      res.json({
        title: '存档',
        posts: posts
      });
    });
  });
  //app.get('/api/blog/u/:name', checkLogin);
  app.get('/api/blog/u/:name', function(req, res) {
    var page=req.query.p ? parseInt(req.query.p) : 1;
    //检查用户是否存在

    Controllers.User.findUserByName(req.params.name, function (err,user) {

      //使用passport后，删掉用户认证的部分，
      //这样第三方用户就可以查看自己的博客主页了
      //if (!user) {
      //  req.flash('error','用户不存在！');
      //  return res.redirect('/');
      //}
      //查询并返回该用户的所有文章
      Controllers.Post.getTen(req.params.name,page, function (err, posts, total) {
        if(err) {
          res.json(500);
        }else{
          res.json({
            title: req.params.name,
            posts: posts,
            page: page,
            isFirstPage: (page-1) == 0,
            isLastPage: ((page-1)*10+posts.length) == total
          });
        }
      });
    });
  });
  //不要了吧
  app.get('/api/blog/links', function(req, res) {
    Post.search(req.query.keyword, function (err, posts) {
      res.json({
        title: "友情链接",
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  //整合到一起
  //app.get('/api/blog/search', checkLogin);
  app.get('/api/blog/search', function(req, res) {
    Controllers.Post.getAll(req.query.keyword, function (err, posts) {
      if (err) {
        return res.json(500);
      }
      res.json({
        title: "SEARCH"+req.query.keyword,
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.get('/api/blog/u/:name/:day/:title', function(req, res) {
    Controllers.Post.getOne(req.params.name, req.params.day,req.params.title, function (err, post) {
      if (err) {
        return res.json(500);
      }
      res.json({
        title:'文章',
        post: post
      });
    });
  });

  //app.get('/api/blog/edit/:name/:day/:title', checkLogin);
  app.get('/api/blog/edit/:name/:day/:title', function(req, res) {
    async.series([function(done){
      Controllers.User.findUserById(req.session._userId,function(err,user){
        if(err){
          done(err);
        }else{
          done(null,user);
        }
      });
    }],function(err,results){
      if(err){
        res.json(500);
      }else{
        var currentUser = results[0];
        Controllers.Post.edit(req.params.name, req.params.day,req.params.title, function (err, post) {
          if (err) {
            res.json(500);
          }else{
            res.json({
              title: '编辑',
              post: post
            });
          }
        });
      }
    });
  });
  //app.post('/api/blog/edit/:name/:day/:title', checkLogin);
  app.post('/api/blog/edit/:name/:day/:title', function(req, res) {
    var p = {
          name: req.params.name,
          day: req.params.day,
          title: req.params.title,
          post: req.body.post
        };
    Controllers.Post.update (p,function (err) {
      var url ='/blog/u/'+req.params.name+'/'+req.params.day+'/'+req.params.title;
      if (err) {
        return res.json(500);
      }
      res.json({url:url});
    });
  });
  //app.get('/api/blog/remove/:name/:day/:title', checkLogin);
  app.get('/api/blog/remove/:name/:day/:title', function(req, res) {
    async.series([function(done){
      Controllers.User.findUserById(req.session._userId,function(err,user){
        if(err){
          done(err);
        }else{
          done(null,user);
        }
      });
    }],function(err,results){
      if(err){
        res.json(500);
      }else{
        var currentUser = results[0];
        Controllers.Post.remove(currentUser.name, req.params.day,req.params.title, function (err) {
          if (err) {
            res.json(500);
          }else{
            res.json(200);
          }
        });
      }
    });
  });
  //app.get('/api/blog/reprint/:name/:day/:title', checkLogin);
  app.get('/api/blog/reprint/:name/:day/:title', function(req, res) {
    async.series([function(done){
      Controllers.Post.edit(req.params.name, req.params.day, req.params.title, function (err, post) {
        if (err) {
          done(err);
        }else{
          done(null,post);
        }
      });
    },function(done){
      Controllers.User.findUserById(req.session._userId,function(err,user){
        if(err){
          done(err);
        }else{
          done(null,user);
        }
      });
    }],function(err,results){
      if(err){
        res.json(500);
      }else{
        var post = results[0];
        var currentUser = results[1],
            reprint_from = {
              name: post.name,
              day:post.time.day,
              title:post.title
            },
            reprint_to = {
              name: currentUser.name,
              avatarUrl:currentUser.avatarUrl
            };
        Controllers.Post.reprint(reprint_from,reprint_to,function(err,post) {
          if (err) {
            res.json(500);
          }else{
            var url = '/blog/u/'+post.name+'/'+post.time.day+'/'+post.title;
            res.json({
              url:url,
              post:post
            });
          }
        });
      }
    });
  });
  //app.get('/api/blog/tags', checkLogin);
  app.get('/api/blog/tags/:name', function(req, res) {
    Controllers.Post.getTags(req.params.name,function(err,tags) {
      if (err) {
        req.flash('error',err);
        return res.json(500);
      }
      res.json({
        title: '标签',
        tags: tags,
        user: req.session.user
      });
    });
  });
  //app.get('/api/blog/tags/:tag', checkLogin);
  app.get('/api/blog/tags/:name/:tag', function(req, res) {
    Controllers.Post.getTag(req.params.tag,req.params.name,function(err,posts) {
      if (err) {
        return req.json(500);
      }
      res.json({
        title: '标签：' + req.params.tag,
        posts: posts,
        user: req.params.name
      });
    });
  });

  function checkLogin(req,res,next) {
    if (!req.session.user) {
      req.json('error','未登录！');
    }
    next();
  };

  function checkNotLogin(req,res,next) {
    if (req.session.user) {
      req.json('error','已登录！');
    }
    next();
  };
};
