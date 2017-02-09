'use strict';

var path = require('path');
var socket = require(path.join(__dirname, '../services/Socket'));

var validateRequest = function(data){
	if(data && data.description){
		if(data.description.toLowerCase().indexOf('зрада') !== -1){
			return false;
		}
	}
	return true;
};

module.exports = function(Task) {
	Task.observe('before save', function(ctx, next) {
		if(!validateRequest(ctx.instance)){
			var error = new Error();
			error.status = 500;
			next(error);
		} else {
			next();	
		}
	});

	Task.observe('after save', function(ctx, next) {
		socket.emit('updateTasksList');
		next();	
	});

	Task.observe('after delete', function(ctx, next) {
		socket.emit('updateTasksList');
		next();
	});
};
