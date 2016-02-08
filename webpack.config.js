var path = require('path'),
    webpack = require('webpack'),
    pkg = require('./package.json');

var banner = [pkg.name + ' - ' + pkg.description,
  '@version v' + pkg.version,
  '@link ' + pkg.homepage,
  '@license ' + pkg.license].join('\n');

var plugins = [
        new webpack.ResolverPlugin([
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        ]),
        new webpack.BannerPlugin(banner)
    ];
    
var PROD = JSON.parse(process.env.PROD_DEV || "0");

if (PROD) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
}

module.exports = {
    entry: './src/duallistbox.jsx',
    output: {
        path: './dist',
        filename: PROD ? 'react-duallistbox.min.js' : 'react-duallistbox.js',
        libraryTarget: 'umd',
        library: 'DualListBox'
    },
    externals: [{
        react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
        }
    }],
    module: {
        loaders: [
            { test: /\.jsx$/, loader: 'babel', exclude: /(node_modules|bower_components)/ }
        ]
    },
    plugins: plugins,
    resolve: {
        root: [path.join(__dirname, 'bower_components'), path.join(__dirname, './src')]
    }
};