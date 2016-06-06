var db = require('../models');
var async = require('async');
var markdown = require('markdown').markdown;

exports.create = function(post,callback){
  var date = new Date();
  var time = {
    date: date,
    year: date.getFullYear(),
    month: date.getFullYear() + "-" + (date.getMonth() + 1),
    day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() <10?'0'+date.getMinutes() : date.getMinutes())
  };
  var p =new db.Post();
  p.name = post.name;
  p.avatarUrl = post.avatarUrl;
  p.title = post.title;
  p.tags = post.tags;
  p.post = post.post;
  p.time = time;
  p.comments = [];
  p.reprint_info = {
    reprint_from:[],
    reprint_to:[]
  };
  p.pv = 0
  p.save(callback);
};

exports.getTen = function(name,page,callback){
  if(name){
    async.series([function(done){
      db.Post.count({
        name:name
      },function(err,total){
        if(err){
          done(err);
        }else{
          done(null,total);
        }
      });
    },function(done){
      var a = db.Post.find({
        name:name
      },null,{
        skip:(page-1)*10,
        limit:10,
        sort:{
          'time':-1
        }
      },function(err,data){
        if(err){
          done(err);
        }else{
          done(null,data);
        }
      });
    }],function(err,results){
      callback(err,results[1] ,results[0]);//成功！返回查询的用户信息
    });
  }else {
  return callback(null,null,0);
  }
};

exports.getOne = function(name, day, title, callback) {
  async.series([function(done){
    db.Post.findOne({
      'name':name,
      'time.day':day,
      'title':title
    },function(err,doc){
      if(err){
        done(err);
      }else{
        if(doc){
          done(null,doc);
        }else{
          done(null,null);
        }
      }
    });
  }],function(err,results){
    if (err) {
      callback(err);
    }else{
      db.Post.update({
        'name':name,
        'time.day':day,
        'title':title
      },{
        $inc:{
          pv:1
        }
      },function(err){
        if (err) {
          callback(err);
        }else{
          if(results[0]){
            //results[0].post = markdown.toHTML(results[0].post);
            callback(null,results[0]);
          }else{
            callback(null,null);
          }
        }
      });
    }
  });
};

exports.edit = function(name, day, title, callback) {
  db.Post.findOne({
    'name': name,
    'time.day':day,
    'title': title
  },function(err,doc){
    if(err){
      callback(err);
    }else{
      callback(null,doc);
    }
  });
};

exports.update = function(post, callback) {
  db.Post.update({
    'name': post.name,
    'time.day':post.day,
    'title': post.title
  },{
    $set:{
      post:post.post
    }
  },function(err,doc){
    if(err){
      callback(err);
    }else{
      callback(null,doc);
    }
  });
};

exports.remove = function(name,day,title,callback) {
  db.Post.remove({
    'name': name,
    'time.day':day,
    'title': title
  },function(err,doc) {
    if (err) {
      return callback(err);
    }else{
      //解析markdown为html
      callback(null,doc);
    }
  });
};

exports.getArchive = function(callback) {
  db.Post.find({},{
    name: 1,
    time: 1,
    title: 1
  },{
    sort:{
      time:-1
    }
  },function(err,docs){
    if(err){
      callback(err);
    }else{
      callback(null,docs);
    }
  });
};

exports.getTags = function(name,callback) {
  db.Post.distinct("tags",{
    name:name
  },function(err,docs) {
    if (err) {
      callback(err);
    }else{
      callback(null,docs);
    }
  });
};

exports.getTag = function(tag,name, callback) {
  db.Post.find({
    tags:tag,
    name:name
  },{
    name:1,
    time:1,
    title:1
  },{
    sort:{
      time:-1
    }
  },function(err,docs){
    if(err){
      callback(err);
    }else{
      callback(null,docs);
    }
  });
};

exports.search = function (keyword,callback) {
  var pattern = new RegExp(keyword, "i");
  db.Post.find({
    title:pattern
  },{
    name:1,
    time:1,
    title:1
  },{
    sort:{
      time:-1
    }
  },function(err,docs){
    if(err){
      callback(err);
    }else{
      callback(null,docs);
    }
  });
};

exports.reprint = function(reprint_from,reprint_to,callback) {
  db.Post.findOne({
    'name':reprint_from.name,
    'time.day': reprint_from.day,
    'title': reprint_from.title
  }, function(err,doc) {
    if (err) {
      callback(err);
    }else{
      var date = new Date();
      var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() <10?'0'+date.getMinutes() : date.getMinutes())
      };
      delete doc._id;

      //doc.name = reprint_to.name;
      doc.avatarUrl = reprint_to.avatarUrl;
      doc.time = time;
      doc.title = (doc.title.search(/[转载]/)>-1)?doc.title:"[转载]"+doc.title;
      doc.reprint_info = {"reprint_from":reprint_from};
      doc.pv = 0;

      db.Post.update({
        'name':reprint_from.name,
        'time.day': reprint_from.day,
        'title': reprint_from.title
      },{
        $push:{
          'reprint_info.reprint_to': {
              name:reprint_to.name,
              day:time.day,
              title:doc.title
          }
        }
      },function(err) {
        if (err) {
          callback(err);
        }else{
          var p =new db.Post();
          p.name = reprint_to.name;
          p.avatarUrl = reprint_to.avatarUrl;
          p.time = doc.time;
          p.post = doc.post;
          p.title = doc.title;
          p.tags = doc.tags;
          p.reprint_info = doc.reprint_info;
          p.pv = doc.pv;
          p.save(callback);
        }
      });
    }
  });
};
