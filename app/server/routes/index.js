var appbookshelf,models;

models = require('../models');
appbookshelf = require('../models/base');

module.exports = function(server) {
	server.get('/', function(req, res) {
		res.render('index');
	});
	server.get('/articles', function (req, res) {
		appbookshelf.Collection.forge([],{model:models.Articles}).fetch().then(function(results){
			res.send(results);
		});
	});
	server.post('/articles', function(req, res){
		var obj, art;
		obj = req.body
		obj.edad = parseInt(obj.edad,10);
		obj.created = new Date().getTime();
		art = new models.Articles(obj);
		art.save().then(function(model){
			res.send(model);
		});
	});
	server.del('/articles/:id', function(req, res) {
		models.Articles.forge({id:req.params.id}).fetch().then(function(article){
			article.destroy().then(function(){
				var delobject = article;
				res.send(delobject);
			});
		});
	});
};