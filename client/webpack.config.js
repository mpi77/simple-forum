var webpack = require("webpack");
var BowerWebpackPlugin = require("bower-webpack-plugin");

module.exports = {
    entry : "./app/app.js",
    output : {
	path : __dirname,
	filename : "./app/dist/js/bundle.js"
    },
    module : {
	loaders : [ {
	    test : /\.css$/,
	    loader : "style!css"
	}, {
	    test : /\.(woff|svg|ttf|eot)([\?]?.*)$/,
	    loader : "file-loader?name=[name].[ext]"
	} ]
    },
    plugins : [ new BowerWebpackPlugin({
	excludes : /.*\.less/
    }), new webpack.ProvidePlugin({
	$ : "jquery",
	jQuery : "jquery"
    }) ]
};