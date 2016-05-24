var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Link = new Schema({
	name:String,
	category:String,
	lable:String,
	source: {
		name:String,
		_sourceId:ObjectId,
		ipAddress: String
	},
	target: {
		name:String,
		_targetId:ObjectId,
		ipAddress: String
	},
	weidge: Number
});
module.exports = Link;