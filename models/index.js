var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/SDWSN');
exports.User = mongoose.model('User',require('./user'));
exports.Room = mongoose.model('Room',require('./room'));
exports.Message = mongoose.model('Message',require('./message'));
exports.Node = mongoose.model('Node',require('./node'));
exports.Link = mongoose.model('Link',require('./link'));
exports.SensorData = mongoose.model('SensorData',require('./sensorData'));
exports.Post = mongoose.model('Post',require('./post'));
