var db = require('../models')
var async = require('async');
var gravatar = require('gravatar');
var crypto = require('crypto');

exports.findUserById = function(_userId,callback){
  db.User.findOne({
    _id:_userId
  },callback);
};

//------------默认密码111111---------------
//------------默认用户名邮箱----------------
exports.findByEmailOrCreate = function(email,callback){
  db.User.findOne({
    email:email
  },function(err,user){
    if(user){
      callback(null,user);
    }else{
      user = new db.User;
      user.name = email.split('@')[0];
      user.password = '111111'
      user.email = email;
      user.avatarUrl = gravatar.url(email);
      user.save(callback);
    }
  });
};

exports.changeName = function(newName,callback){
  db.User.findOneAndUpdate({
    email:newName.email
  },{
    $set: {
      name:newName.name
    }
  },callback);
};

exports.changePassword = function(newPassword,callback){
  db.User.findOneAndUpdate({
    email:newPassword.email,
    password:newPassword.oldPassword
  },{
    $set: {
      password:newPassword.newPassword
    }
  },callback);
};

exports.online = function(_userId,callback) {
  db.User.findOneAndUpdate({
    _id: _userId
  },{
    $set: {
      online: true
    }
  },callback);
};

exports.offline = function(_userId,callback) {
  db.User.findOneAndUpdate({
     _id: _userId
  },{
    $set: {
      online: false
    }
  },callback);
};

exports.getOnlineUsers = function(callback){
  db.User.find({
    online: true
  },callback);
};

exports.joinRoom = function(join,callback){
  db.User.findOneAndUpdate({
    _id: join.user._id
  },{
    $set: {
      online:true,
      _roomId: join.room._id
    }
  },callback);
};

exports.leaveRoom = function(leave,callback){
  db.User.findOneAndUpdate({
    _id: leave.user._id
  },{
    $set: {
      online:false,
      _roomId: null
    }
  },callback);
};
