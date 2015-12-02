var webpack        = require('webpack');
var path           = require('path');
var SaveAssetsJson = require('assets-webpack-plugin');
var node_modules   = path.resolve(__dirname, 'node_modules');

function makeConfig(isProd) {
    var plugins = [
        new webpack.optimize.CommonsChunkPlugin(
            'common',
            isProd ? 'common.[hash].js' : 'common.js'),

        new webpack.NoErrorsPlugin()
   ];

   // Production optimizations
   if(isProd) {
       plugins = plugins.concat(
           new webpack.DefinePlugin({
               'process.env': {
                   // This has effect on the react lib size
                   'NODE_ENV': JSON.stringify('production')
               }
           }),
           new webpack.optimize.DedupePlugin(),
           new webpack.optimize.OccurenceOrderPlugin(true),
           new webpack.optimize.UglifyJsPlugin(),
           new SaveAssetsJson({
               path: path.resolve('../static/')
           })
       );
   }

    var config = {
        entry: {
            'app': './src/js/app.js',
        },
        output: {
            filename: isProd ? '[name].[hash].js' : '[name].js',
            path: 'dist/js/'
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: [node_modules],
                    loaders: ['babel', 'eslint']
                }
            ]
        },
        devtool: 'eval',
        plugins: plugins
    };

    // Enable source maps in dev mode
    if(!isProd){
        config.devtool = 'source-map';
    }

    return config;
};

module.exports = makeConfig;
