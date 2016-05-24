var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Node = new Schema({
	name:String,
	ipAddress: String,
	category:String,
	neighbors:[ObjectId],
	joinAt: {
		type: Date,
		default:Date.now
	},
	degree:{
		type:Number,
		default:0
	}
});
module.exports = Node;
