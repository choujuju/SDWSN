var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var SensorData = new Schema({
	value: Number,
	category:String,
	creator: {
		name:String,
		_nodeId:ObjectId,
		ipAddress: String
	},
	createAt: {
		type:Date,
		default:Date.now
	}
});

module.exports = SensorData;
