var db = require('../models');
var async = require('async');

exports.create = function (link,callback){
	var l = new db.Link();
	l.name = link.name;
	l.category = link.category;
	l.source.name = link.source;
	l.target.name = link.target;
	async.series([
		function(done){
			db.Node.findOne({
				name:link.source
			},function(err,node){
				if(err){
					console.log(err);
					callback(err);
				}else{
					l.source._sourceId = node._id;
					l.source.ipAddress = node.ipAddress;
				}
				done(null,node);
			});
		},function(done){
			db.Node.update({
				name:link.source
			},{
				$inc:{
					degree:1
				}
			},{},function(err,doc){
				if (err) {
					callback(err);
				}
				done(null);
			});
		},function(done){
			db.Node.findOne({
				name:link.target
			},function(err,node){
				if(err){
					callback(err);
				}else{
					l.target._targetId = node._id;
					l.target.ipAddress = node.ipAddress;
				}
				done(null,node);
			});
		},function(done){
			db.Node.update({
				name:link.target
			},{
				$inc:{
					degree:1
				}
			},{},function(err,doc){
				if (err) {
					callback(err);
				}
				done(null);
			});
		}
	],function(err,callback){
		l.save(callback);
	});
};

exports.read = function(callback) {
	db.Link.find({},function(err,links){
		if(err){
			callback(err);
		}else{
			callback(null,links);
		}
	});
};