var express;

express = require('express');

module.exports = function () {
	var server = express();
	require('./server')(server);
};