const config = require('./webpack.config.base.js');

config.devServer = {
	historyApiFallback: true,
	compress: true,
	overlay: {
		warnings: true,
		errors: true
	},
	stats: 'errors-only',
	port: 3000
};

module.exports = config;
