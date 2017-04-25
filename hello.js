"use strict"

module.exports = function (context, done) {
	console.log("HELLO " + context.data.name);

	done(null, 'Hello, ' + context.data.name + '!');
}