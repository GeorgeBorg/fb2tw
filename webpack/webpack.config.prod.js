const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./webpack.config.base.js');

config.output.filename = 'assets/[name].js';
config.devtool = 'none';
config.mode = 'production';

config.plugins.push(
	new MiniCssExtractPlugin({
		filename: 'assets/[name].css'
	})
);

module.exports = config;
