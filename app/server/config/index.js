var path;

path = require('path');

module.exports = function () {
	var root, app, client, server, assets, views, content, database;

	root = path.resolve(__dirname, '../../../');
	app = path.resolve(root, 'app/');
	client = path.resolve(app, 'client/');
	server = path.resolve(app, 'server/');
	assets = path.resolve(client, 'assets/');
	views = path.resolve(server, 'views/');
	content = path.resolve(root, 'content/');

	return {
		root: root,
		app: app,
		client: client,
		server: server,
		assets: assets,
		views: views,
		content: content,
		database: {
			client: 'sqlite3',
			connection: {
				filename: path.resolve(content, 'data/database.sqlite3')
			}
		},
		port: 3000
	};
};