'use strict';

var path = require('path');
var socket = require(path.join(__dirname, '../services/Socket'));

module.exports = function(Task) {
	Task.observe('after save', function(ctx, next) {
		socket.emit('updateTasksList');
		next();
	});

	Task.observe('after delete', function(ctx, next) {
		socket.emit('updateTasksList');
		next();
	});
};
