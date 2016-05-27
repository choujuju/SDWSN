var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Post = new Schema({
  name:String,
  avatarUrl:String,
  title:String,
  tags:[String],
  post:String,
  time:{
      date: Date,
      year: String,
      month: String,
      day: String,
      minute: String
  },
  comments:[String],
  reprint_info:{
    reprint_from:[{
      name:String,
      day:String,
      title:String
    }],
    reprint_to:[{
      name:String,
      day:String,
      title:String
    }],
  },
  pv:Number
});

module.exports = Post;
