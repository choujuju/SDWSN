var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = new Schema({
	email:String,
	name:String,
	password: String,
	avatarUrl:String,
	_roomId: ObjectId,
	online: Boolean
},{
	collection: 'users'
});

module.exports = User;