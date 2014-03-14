var express, server;

express = require('express');
server = express();

server.get('/', function (req, res) {
	res.send('Hola Mundo');
});

server.listen(3000);