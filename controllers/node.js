var db = require('../models');
var async = require('async');

exports.create = function(node, callback) {
	var n = new db.Node();
	n.name = node.name;
	n.ipAddress = node.ipAddress;
	n.category = node.category;
	n.degree = 0;
	n.save(callback);
};

exports.read = function(callback) {
	db.Node.find({},function(err,nodes){
		if(err){
			callback(err);
		}else{
			callback(null,nodes);
		}
	});
};

exports.findNodeByName = function(name,callback){
	db.Node.findOne({
		name:name
	},function(err,node){
		if(err){
			callback(err);
		}else{
			callback(null,node);
		}
	});
};

exports.findNodeByIpAddress = function(ipAddress,callback){
	db.Node.findOne({
		ipAddress:ipAddress
	},function(err,node){
		if(err){
			callback(err);
		}else{
			callback(null,node);
		}
	});
};

exports.addNeighbor = function(name,_neighborId,callback) {
	db.Node.findOne({
		name:name
	},function(err,node){
		if(err){
			callback(err);
		}else{
			node.neighbors.push(_neighborId);
			callback(null,node);
		}
	});
};

exports.removeNeighbor = function(name,neighbor_name,callback) {
	db.Node.findOne({
		name:name
	},function(err,node){
		if(err){
			callback(err);
		}else{
			db.Node.findOne({
				name: neighbor_name
			},function(err,neighbor){
				if(err){
					callback(err);
				}else{
					node.neighbors.unshift(neighbor._id);
					callback(null,node);
				}
			});
		}
	});
};