var path = require('path'),
    webpack = require('webpack');

module.exports = {
    entry: './src/duallistbox.jsx',
    output: {
        filename: 'dist/react-duallistbox.js'
    },
    module: {
        loader: [
            { test: /\.jsx?$/, loader: 'jsx-loader' }
        ]
    },
    plugins: [
        new webpack.ResolverPlugin([
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        ])
    ],
    resolve: {
        root: [path.join(__dirname, 'bower_components'), path.join(__dirname, './src')]
    }
};