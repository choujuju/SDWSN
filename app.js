var express = require('express');
var http = require('http'); 
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var signedCookieParser = cookieParser('SDWSN');
var session = require('express-session');
var Controllers = require('./controllers');
var async = require('async');
var echarts = require('echarts');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var MongoStore = require('connect-mongo')(session);
var sessionStore = new MongoStore({
  url:'mongodb://localhost/SDWSN'
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret:'SDWSN',
    resave:true,
    saveUninitialized:false,
    cookie:{
      maxAge:60 * 1000* 60
    },
    store: sessionStore
  }));

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
          };
        });
      };
    });
  }else{
    res.json(403);
  };
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

app.use(express.static(path.join(__dirname, '/static')));
app.use(function(err,req,res){
  req.sendFile(path.join(__dirname,'/static/index.html'));
});

var port = process.env.PORT || '3000';
app.set('port', port);

var server = app.listen(app.get('port'),function(){
  console.log('SDWSN is on port '+port+'!');
});

var io = require('socket.io').listen(server);
var messages = [];

io.sockets.on('connection',function(socket){
  console.log('socket is connected');
  socket.on('createMessage',function(message){
    Controllers.Message.create(message,function(err){
      if (err){
        socket.emit('err',{
          msg:err
        });
      }else{
        msg={
          content:message.message,
          creator:message.creator,
          _roomId:message._roomId,
          createAt:new Date
        }
        socket.in(message._roomId).broadcast.emit('messageAdded',message);
        socket.emit('messageAdded',msg);
      }
    });
  });
  var _userId = socket.handshake.headers.session._userId;
  Controllers.User.online(_userId,function(err,user){
    if(err){
      socket.emit('err',{
        msg:err
      });
    }else {
      socket.broadcast.emit('online',user);
      socket.broadcast.emit('messageAdded',{
        content: user.name + '进入了聊天室',
        creator:'SYSTEM',
        createAt: new Date()
      });
    };
  });
  
  socket.on('createRoom',function(room){
    Controllers.Room.create(room,function(err,room){
      if(err){
        socket.emit('err',{
          msg:err
        });
      }else{
        io.sockets.emit('roomAdded',room);
      }
    });
  });
  var graph = {
      nodes:null,
      links:null
  };
  socket.on('getAllRooms',function(data){
    //===========================================
    
    var nodes=[{
      name:'0',
      ipAddress:'10.0.1.1',
      category:'sink',
    },{
      name:'1',
      ipAddress:'10.0.1.2',
      category:'ordinary',
    },{
      name:'2',
      ipAddress:'10.0.1.3',
      category:'ordinary',
    },{
      name:'3',
      ipAddress:'10.0.1.4',
      category:'ordinary',
    },{
      name:'4',
      ipAddress:'10.0.1.5',
      category:'ordinary',
    },{
      name:'5',
      ipAddress:'10.0.1.6',
      category:'ordinary',
    },{
      name:'6',
      ipAddress:'10.0.1.7',
      category:'ordinary',
    },{
      name:'7',
      ipAddress:'10.0.1.8',
      category:'ordinary',
    },{
      name:'8',
      ipAddress:'10.0.1.9',
      category:'ordinary',
    }];

    var links = [{
      name:'0',
      category:'neighborhood',
      source: '0',
      target: '1'
    },{
      name:'1',
      category:'neighborhood',
      source: '0',
      target: '2'
    },{
      name:'2',
      category:'neighborhood',
      source: '0',
      target: '3'
    },{
      name:'3',
      category:'neighborhood',
      source: '2',
      target: '3'
    },{
      name:'4',
      category:'neighborhood',
      source: '5',
      target: '3'
    },{
      name:'5',
      category:'neighborhood',
      source: '4',
      target: '7'
    },{
      name:'6',
      category:'neighborhood',
      source: '6',
      target: '7'
    },{
      name:'7',
      category:'neighborhood',
      source: '1',
      target: '6'
    },{
      name:'8',
      category:'neighborhood',
      source: '8',
      target: '6'
    },{
      name:'9',
      category:'neighborhood',
      source: '4',
      target: '5'
    }];
    
    var sensorDatas = [];
    for (var i = 9; i >= 1; i--) {
      var a = Math.round(Math.pow(Math.random(),2)*40+15);
      var b = Math.round(Math.random()*20+20);
      var c = Math.floor(Math.random()*1.1);
      sensorDatas.push({
        value: a,
        category:'wet',
        ipAddress :'10.0.1.'+i
      });
      sensorDatas.push({
        value: b,
        category:'temperature',
        ipAddress :'10.0.1.'+i
      });
      sensorDatas.push({
        value: c,
        category:'smoke',
        ipAddress :'10.0.1.'+i
      });
    }
    
    //===========================================
    
    (function(graph){
          async.series([
            function(done){
              for (var i = sensorDatas.length - 1; i >= 0; i--) {
                Controllers.SensorData.create(sensorDatas[i],function(data){
                  //console.log('>',data);
                });
              }
              done(null,null);
            },function(done){
              Controllers.Node.read(function(err,nodes){
                if(err){
                  return err;
                }else{
                  //console.log(nodes);
                }
                done(err,nodes);
              });
            },function(done){
              Controllers.Link.read(function(err,links){
                if(err){
                  return err;
                }else{
                  //console.log(links);
                }
                done(err,links);
              });
            },function(done){
              Controllers.SensorData.readAllByCategoryAndNodes(function(err,datas){
                if(err){
                  return err;
                }else{
                  //console.log('read datas',datas);
                }
                done(err,datas);
              });
            }
          ],function(err,results){
            socket.emit('graph',{
              nodes:results[1],
              links:results[2]
            });
            socket.emit('sensorDatas',results[3]);
          });
        })(graph);

    if(data && data._roomId){
      Controllers.Room.getById(data._roomId,function(err,room){
        if(err){
          socket.emit('err',{
            msg:err
          });
        }else{
          socket.emit('roomData.'+data._roomId,room);
        }
      });
    }else{
      Controllers.Room.read(function(err,rooms){
        if(err){
          socket.emit('err',{
            msg:err
          });
        }else{
          socket.emit('roomsData',rooms);
        }
      });
    }
  });
  socket.on('joinRoom',function(join){
    Controllers.User.joinRoom(join,function(err){
      if(err){
        socket.emit('err',{
          msg:err
        });
      }else{
        socket.join(join.room._id);
        socket.emit('joinRoom.'+join.user._id,join);
        socket.in(join.room._id).broadcast.emit('messageAdded',{
          content:join.user._id,
          creator:'SYSTEM',
          createAt:new Date(),
          _id:ObjectId()
        });
        socket.in(join.room._id).broadcast.emit('joinRoom',join);
      }
    });
  });
  //用户跳转到其他页面，服务器用过socket.leave来断开socket
  socket.on('leaveRoomMessage',function(leave){
    Controllers.User.leaveRoom(leave,function(err){
      if(err){
        socket.emit('err',{
          msg:err
        });
      }else{
        socket.in(leave.user._id).broadcast.emit('messageAdded',{
          content:leave.user.name+'离开了聊天室',
          creator:'SYSTEM',
          createAt:new Date(),
          _id: ObjectId()
        });
        socket.leave(leave.room._id);
        io.sockets.emit('leaveRoomBroadcast',leave);
      }
    });
  });
  //用户关闭页面或者断网了，即用户主动断开了socket
  socket.on('disconnect',function(){
    Controllers.User.offline(_userId,function(err,user){
      if(err){
        socket.emit('err',{
          msg:err
        });
      }else{
        if(user._roomId){
          socket.in(user._roomId).broadcast.emit('leaveRoomBroadcast',user);
          socket.in(user._roomId).broadcast.emit('messageAdded',{
            content:user.name+'离开了聊天室',
            creator:'SYSTEM',
            createAt:new Date(),
            _id:ObjectId()
          });
          Controllers.User.leaveRoom({
            user:user
          },function(){});
        }
      }
    });
  });
});

io.set('authorization',function(handshakeData,accept){
  signedCookieParser(handshakeData,{},function(err){
    if (err) {
      accept(err,false);
    }else{
      sessionStore.get(handshakeData.signedCookies['connect.sid'], function(err,session){
        if (err){
          accept(err.message,false);
        }else{
          handshakeData.headers.session = session;
          if(session._userId){
            accept(null,true);
          }else {
            accept('No login');
          };
        };
      });
    };
  });
});

