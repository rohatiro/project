var _,
	bookshelf,
	BookShelf,
	config,
	knex,
	keys,
	paths,
	models,
	sequence;

_ = require('underscore');
sequence = require('when/sequence');
knex = require('./base').knex;
config = require('../config');
tables = require('../data/schema')();
paths = config();
keys = _.keys(tables);

module.exports = {
	Articles: require('./articles').articles,
	createTable: function(tableName) {
		return knex.schema.createTable(tableName, function(t){
			var column, columnName;
			columnName = _.keys(tables[tableName]);
			_.each(columnName, function(key){
				if (tables[tableName][key].hasOwnProperty('maxlength')) {
				    column = t[tables[tableName][key].type](key, tables[tableName][key].maxlength);
				} else {
				    column = t[tables[tableName][key].type](key);
				}
				if (tables[tableName][key].hasOwnProperty('nullable') && tables[tableName][key].nullable === true) {
				    column.nullable();
				} else {
				    column.notNullable();
				}
				if (tables[tableName][key].hasOwnProperty('primary') && tables[tableName][key].primary === true) {
				    column.primary();
				}
				if (tables[tableName][key].hasOwnProperty('unique') && tables[tableName][key].unique) {
				    column.unique();
				}
				if (tables[tableName][key].hasOwnProperty('unsigned') && tables[tableName][key].unsigned) {
				    column.unsigned();
				}
				if (tables[tableName][key].hasOwnProperty('references') && tables[tableName][key].hasOwnProperty('inTable')) {
				    //check if table exists?
				    column.references(tables[tableName][key].references);
				    column.inTable(tables[tableName][key].inTable);
				}
				if (tables[tableName][key].hasOwnProperty('defaultTo')) {
				    column.defaultTo(tables[tableName][key].defaultTo);
				}
			});
		});
	},
	existTables: function() {
		knex.schema.hasTable('articulos').then(function(exist){
			if(!exist){
				throw new Error('La tabla no existe');
			}
		});
	},
	getTables: function() {
		return knex.raw("select * from sqlite_master where type = 'table'").then(function(response){
			return _.reject(_.pluck(response[0], 'tbl_name'), function(name) {
				return name === 'sqlite_sequence';
			});
		});
	},
	getAddTables: function(oldtables, newtables){
		var self = this;
		var addTables = _.difference(newtables, oldtables);
		if(!_.isEmpty(addTables)){
			return _.map(addTables, function(table){
				return function() {
					return self.createTable(table);
				};
			});
		}
	},
	init: function() {
		var self = this;
		return this.getTables().then(function(db_tables){
			var addTables = self.getAddTables(db_tables, keys);
			if(!_.isEmpty(addTables)){
				console.log('creando tabla');
				return sequence(addTables);
			}
			console.log('base de datos actualizada');
			return;
		});
	}
};