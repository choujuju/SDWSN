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
var crypto = require('crypto'),
//引入User进行数据库操作
    Controllers = require('../controllers');
    passport = require('passport');

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
    if(req.session.user) {
      name=req.session.user.name;
    }
    else {
      name=null;
    }
    //改成getAll
    Controllers.Post.getTen(name,page,function(err,posts,total) {
      if (err) {
        posts = [];
      }
      res.json({
        title: '主页',
        user: name,
        posts: posts,
        page: page
      });
    });
  });
  //<><><><><><><><><><><><><><><><><><><><>
  app.get('/api/login/github',passport.authenticate("github",{
    session:false
  }));
  app.get('/api/login/github/callback',passport.authenticate("github",{
    session:false,
    failureRedirect:'/login',
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
  app.get('/api/blog/post', checkLogin);
  app.get('/api/blog/post', function(req, res) {
    res.json({
      title: '发表',
      user: req.session.user
   });
  });

  app.post('/api/blog/post', checkLogin);
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
  app.get('/api/blog/upload', checkLogin);
  app.get('/api/blog/upload', function(req, res) {
    res.json({
      title: '文件上传',
      user: req.session.user
    });
  });

  app.post('/api/blog/upload', checkLogin);
  app.post('/api/blog/upload', function(req, res) {
    res.json(200);
  });

  app.get('/api/blog/archive', checkLogin);
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
  app.get('/api/blog/u/:name', checkLogin);
  app.get('/api/blog/u/:name', function(req, res) {
    var page=req.query.p ? parseInt(req.query.p) : 1;
    //检查用户是否存在

    User.get(req.params.name, function (err,user) {

      //使用passport后，删掉用户认证的部分，
      //这样第三方用户就可以查看自己的博客主页了
      //if (!user) {
      //  req.flash('error','用户不存在！');
      //  return res.redirect('/');
      //}
      //查询并返回该用户的所有文章
      Post.getTen(req.params.name,page, function (err, posts, total) {
        if(err) {
          return res.json(500);
        }
        res.json({
          title: req.params.name,
          posts: posts,
          page: page,
          isFirstPage: (page-1) == 0,
          isLastPage: ((page-1)*10+posts.length) == total
        });
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
  app.get('/api/blog/search', checkLogin);
  app.get('/search', function(req, res) {
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
        post: post
      });
    });
  });

  app.get('/api/blog/edit/:name/:day/:title', checkLogin);
  app.get('/api/blog/edit/:name/:day/:title', function(req, res) {
    var currentUser = req.session.user;
    Controllers.Post.edit(currentUser.name, req.params.day,req.params.title, function (err, post) {
      if (err) {
        return res.json(500);
      }
      res.json({
        title: '编辑',
        post: post
      });
    });
  });
  app.post('/api/blog/edit/:name/:day/:title', checkLogin);
  app.post('/api/blog/edit/:name/:day/:title', function(req, res) {
    var currentUser = req.session.user,
        p = {
          name: currentUser.name,
          day: req.params.day,
          title: req.params.title,
          post: req.body.post
        };
    Post.update(p,function (err) {
      var url = encodeURI('/u/'+req.params.name+'/'+req.params.day+'/'+req.params.title);
      if (err) {
        req.flash('error',err);
        return res.redirect(url);
      }
      req.flash('success','修改成功！');
      res.redirect(url);
    });
  });
  app.get('/api/blog/remove/:name/:day/:title', checkLogin);
  app.get('/api/blog/remove/:name/:day/:title', function(req, res) {
    var currentUser = req.session.user;
    Post.remove(currentUser, req.params.day,req.params.title, function (err) {
      if (err) {
        req.flash('error',err);
        return res.redirect('back');
      }
      req.flash('success','删除成功！');
      res.redirect('/');
    });
  });
  app.get('/api/blog/reprint/:name/:day/:title', checkLogin);
  app.get('/api/blog/reprint/:name/:day/:title', function(req, res) {
    Post.edit(req.params.name, req.params.day, req.params.title, function (err, post) {
      if (err) {
        req.flash('error',err);
        return res.redirect('back');
      }
      var currentUser = req.session.user,
          reprint_from = {name: post.name,day:post.time.day,title:post.title},
          reprint_to = {name: currentUser.name,head:currentUser.head};
      Post.reprint(reprint_from,reprint_to,function(err,post) {
        if (err) {
          req.flash('error',err);
          return res.redirect('back');
        }
        req.flash('success',"转载成功！");
        var url = encodeURI('/u/'+post.name+'/'+post.time.day+'/'+post.title);
        res.redirect(url);
      });
    });
  });
  app.get('/api/blog/tags', checkLogin);
  app.get('/api/blog/tags', function(req, res) {
    Post.getTags(function(err,posts) {
      if (err) {
        req.flash('error',err);
        return res.json(500);
      }
      res.json({
        title: '标签',
        posts: posts,
        user: req.session.user
      });
    });
  });
  app.get('/api/blog/tags/:tag', checkLogin);
  app.get('/api/blog/tags/:tag', function(req, res) {
    Post.getTag(req.params.tag,function(err,posts) {
      if (err) {
        return req.json(500);
      }
      res.json({
        title: '标签：' + req.params.tag,
        posts: posts,
        user: req.session.user
      });
    });
  });

  app.use(function(req,res) {
    res.render("404");
  });

  function checkLogin(req,res,next) {
    if (!req.session.user) {
      req.flash('error','未登录！');
      res.redirect('/login');
    }
    next();
  };

  function checkNotLogin(req,res,next) {
    if (req.session.user) {
      req.flash('error','已登录！');
      res.redirect('back');
    }
    next();
  };
};
