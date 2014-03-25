var config,
	swig,
	paths,
	express,
	routes,
	models;

express = require('express');
swig = require('swig');
config = require('./config');
routes = require('./routes');
models = require('./models');
paths = config();

module.exports = function (server) {
	models.init().then(function(){
		server.engine('html', swig.renderFile);
		server.set('view engine', 'html');
		server.set('views', paths.views);
		
		server.configure(function () {
			server.use(express.static(paths.assets));
			server.use(express.logger());
			server.use(express.cookieParser());
			server.use(express.bodyParser());
		});

		routes(server);

		server.listen(paths.port);
		console.log('Server in port ' + paths.port);
	});
};