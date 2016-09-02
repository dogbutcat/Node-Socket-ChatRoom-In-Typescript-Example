var extend = require('extend'),
    fs = require('fs'),
    webpack = require('webpack');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    mod!=='pug'?nodeModules[mod] = 'commonjs ' + mod:null;
  });

var commonConfig = {
    output: {
        filename: 'app.js',
        publicPath: '/',
        devtoolModuleFilenameTemplate: '../../[resource-path]'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.ts', '.js', '.json']
    },
    module: {
        //noParse: /node_modules\/json-schema\/lib\/validate\.js/,
        loaders: [
            { test: /\.ts$/, loader: 'ts' },
            { test: /\.json$/, loader: 'json' }
        ]
    }
}

var serverConfig = extend(true,{}, commonConfig, {
    entry: './src/server/app.ts',
    output: {
        filename: 'app.js',
        path: './build/server'
    },
    target: 'node',
    plugins:[
        // new webpack.NormalModuleReplacementPlugin(/require(\'socket.io-client\/package\').version/, require('socket.io-client/package').version)
    ],
    externals: nodeModules
})

var clientConfig = extend({}, commonConfig, {
    entry: './src/client/index.ts',
    output: {
        filename: 'index.js',
        path: './src/client/js'
    },
    ts:{
        compilerOptions:{
            target:"es5"
        }
    },
    target: 'web'
})

module.exports = {serverConfig, clientConfig};