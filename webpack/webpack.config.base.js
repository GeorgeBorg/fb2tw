const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const clientPath = path.resolve(__dirname, '../app');
const entryPath = path.resolve(clientPath, './javascripts');
const outputPath = path.resolve(__dirname, '../build');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
	mode: 'development',
	entry: entryPath,
	devtool: 'eval',
	output: {
		path: outputPath,
		filename: '[name].js',
		publicPath: '/'
	},
	performance: { hints: false },
	resolve: {
		extensions: ['.js', '.jsx', '.scss', '.json', '.css'],
		modules: [
			entryPath,
			path.resolve(clientPath, './stylesheets'),
			clientPath,
			'node_modules'
		]
	},
	module: {
		rules: [
			{
				use: 'babel-loader',
				test: /\.js$/,
				exclude: /node_modules/
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true,
							camelCase: true,
							publicPath: '../',
							localIdentName: devMode
								? '[local]_[hash:base64:5]'
								: '[hash:base64:5]'
						}
					},
					{ loader: 'postcss-loader' },
					{ loader: 'sass-loader' }
				]
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/,
				loaders: [
					'url-loader?limit=10000&name=assets/media/[name].[ext]',
					'img-loader?progressive=true'
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: clientPath + '/templates/index.html',
			favicon: clientPath + '/images/favicon.ico'
		}),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		})
	]
};
