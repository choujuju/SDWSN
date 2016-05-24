var db = require('../models');
var async = require('async');

exports.create = function(sensorData, callback) {
	var data = new db.SensorData();
	data.value = sensorData.value;
	data.creator.ipAddress = sensorData.ipAddress;
	data.category = sensorData.category;
	db.Node.findOne({
		ipAddress:sensorData.ipAddress
	},function(err,node){
		if(err){
			callback(err);
		}else{
			data.creator._nodeId=node._id;
			data.creator.name=node.name;
			data.save(callback);
		}
	});
};

exports.readAllByCategoryAndNodes = function(callback) {
	async.series([function(done){
		db.Node.find({},function(err,nodes){
			var names = [];
			nodes.forEach(function(node){
				names.push(node.name);
			});
			done(err,names);
		});
	},function(done){
		db.SensorData.find({
			category:'wet'
		},function(err,wetDatas){
			done(err,wetDatas);
		});
	},function(done){
		db.SensorData.find({
			category:'temperature'
		},function(err,temperatureDatas){
			done(err,temperatureDatas);
		});
	},function(done){
		db.SensorData.find({
			category:'smoke'
		},function(err,smokeDatas){
			done(err,smokeDatas);
		});
	}],function(err,results){
		var names = results[0];
		var nodesNum = names.length;
		var temperatures = results[2];
		var wets = results[1];
		var smokes = results[3];
		var filtedTemp = [];
		var filtedWet = [];
		var filtedSmoke = [];
		for (var i = nodesNum - 1; i >= 0; i--) {
			var filtedTempByNode = [];
			var filtedWetByNode = [];
			var filtedSmokeByNode = [];
			var f_t = temperatures.filter(function(data){
				return data.creator.name == names[i];
			});
			f_t.forEach(function(f){
				filtedTempByNode.push([
					f.createAt,
					f.value,
					names[i]
				]);
			});
			filtedTemp.push(filtedTempByNode);
			
			var f_w = wets.filter(function(data){
				return data.creator.name == names[i];
			});
			f_w.forEach(function(f){
				filtedWetByNode.push([
					f.createAt,
					f.value,
					names[i]
				]);
			});
			filtedWet.push(filtedWetByNode);

			var f_s = smokes.filter(function(data){
				return data.creator.name == names[i];
			});
			f_s.forEach(function(f){
				filtedSmokeByNode.push([
					f.createAt,
					f.value,
					names[i]
				]);
			});
			filtedSmoke.push(filtedSmokeByNode);
		}
		callback(err,{
			temperature:filtedTemp,
			wet:filtedWet,
			smoke:filtedSmoke,
			names:names
		});
	});
};