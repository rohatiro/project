module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	grunt.initConfig({
		watch : {
			options: {
				nowspawn: true,
				livereload: true
			}
		}
	});
	grunt.registerTask('default', ['watch']);
};