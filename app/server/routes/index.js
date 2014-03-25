var appbookshelf,models;

models = require('../models');
appbookshelf = require('../models/base');

module.exports = function(server) {
	server.get('/', function(req, res) {
		res.render('index');
	});
	server.get('/db', function (req, res) {
		appbookshelf.Collection.forge([],{model:models.Articles}).fetch().then(function(results){
			res.send(results);
		});
	});
	server.post('/article', function(req, res){
		var obj, art, objformated;
		obj = req.body
		obj.edad = parseInt(obj.edad,10);
		obj.created = new Date().getTime();
		art = new models.Articles(obj);
		art.save();
		res.send('Exito');
	});
};