var bookshelf, Articles, config, paths;

config = require('../config');
bookshelf = require('./base');
paths = config();

Articles = bookshelf.Model.extend({
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

module.exports = {
	articles: Articles
};