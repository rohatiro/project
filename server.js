var express, server, swig, path, root, approot, publicdir,fs;

//plugins
path = require('path');
express = require('express');
swig = require('swig');
fs = require('fs');

//direcciones
root = path.resolve(__dirname,'.');
publicdir = path.resolve(root, 'public/');
approot = path.resolve(root, 'app/');
views = path.resolve(approot, 'views/');

//configuracion
server = express();
server.engine('html', swig.renderFile);
server.set('view engine', 'html');
server.set('views', views);
server.configure(function () {
	server.use(express.static(publicdir));
	server.use(express.logger());
	server.use(express.cookieParser());
	server.use(express.bodyParser());
});

//rutas
server.get('/', function (req, res) {
	res.render('index');
});

server.get('/db', function (req, res) {
	var database = JSON.parse(fs.readFileSync('./database.json').toString());
	res.send(database);
});

//Inicio del servidor
server.listen(3000);
console.log('El servidor se ha iniciado en el puerto 3000');