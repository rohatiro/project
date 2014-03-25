var bookshelf, Bookshelf, knex, paths, config;

Bookshelf = require('bookshelf');
config = require('../config/');

bookshelf = Bookshelf.initialize(config().database);
bookshelf.client = config().database.client;

module.exports = bookshelf;