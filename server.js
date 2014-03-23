var express, server, swig, path, root, approot, publicdir,fs,Bookshelf,bookshelf,articulos,knex;

//plugins
path = require('path');
express = require('express');
swig = require('swig');
fs = require('fs');
Bookshelf = require('bookshelf');

//direcciones
root = path.resolve(__dirname,'.');
publicdir = path.resolve(root, 'public/');
approot = path.resolve(root, 'app/');
views = path.resolve(approot, 'views/');

bookshelf = Bookshelf.initialize({
	client: 'sqlite3',
	connection: {
		filename: './database.sqlite3'
	}
});

knex = bookshelf.knex;

knex.schema.hasTable('articulos').then(function(exist){
	if(exist){
		console.log(arguments);
		articulos = bookshelf.Model.extend({
			tableName:'articulos',
			permitedValues: ['nombre','apellido','edad','created'],
			initialize: function(){
				this.on('saving', this.saving, this);
			},
			saving: function(page,attr,options){
				var self;
				self = this;
				this.attributes = this.pick(this.permitedValues);
				this.set('nombre', this.get('nombre').trim());
				this.set('apellido', this.get('apellido').trim());
			}
		});
	} else {
		knex.schema.createTable('articulos', function(table){
			table.increments('id').notNullable().primary();
			table.string('nombre');
			table.string('apellido');
			table.integer('edad');
			table.integer('created')
		}).then(function(){
			articulos = bookshelf.Model.extend({
				tableName:'articulos',
				permitedValues: ['nombre','apellido','edad','created'],
				initialize: function(){
					this.on('saving', this.saving, this);
				},
				saving: function(page,attr,options){
					var self;
					self = this;
					this.attributes = this.pick(this.permitedValues);
					this.set('nombre', this.get('nombre').trim());
					this.set('apellido', this.get('apellido').trim());
				}
			});
		});
	}
});

// articulos = bookshelf.Model.extend({
// 	tableName:'articulos',
// 	permitedValues: ['nombre','apellido','edad','creado'],
// 	initialize: function(){
// 		this.on('saving', this.saving, this);
// 	},
// 	saving: function(page,attr,options){
// 		var self;
// 		self = this;
// 		this.attributes = this.pick(this.permitedValues);
// 		this.set('nombre', this.get('nombre').trim());
// 		this.set('apellido', this.get('apellido').trim());
// 	}
// });


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
	bookshelf.Collection.forge([],{model:articulos}).fetch().then(function(results){
		res.send(results);
	});
});

server.post('/article', function(req, res){
	var obj = req.body, art, objformated;
	objformated = {
		'nombre':obj.nombre,
		'apellido':obj.apellido,
		'edad': parseInt(obj.edad,10),
		'created': new Date().getTime()
	};
	art = new articulos(objformated);
	art.save();
	res.send('Exito');
});

server.get('/primer', function(req, res){
	bookshelf.Collection.forge([],{model:articulos}).fetch().then(function(results){
		res.send(JSON.stringify(results));
	});
});

//Inicio del servidor
server.listen(3000);
console.log('El servidor se ha iniciado en el puerto 3000');