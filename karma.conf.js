// Karma configuration
// Generated on Mon Jan 25 2016 18:12:38 GMT-0500 (Eastern Standard Time)
var webpack = require('webpack');
var path = require('path');
var singleRun = true;
var browsers = ['Chrome'];
var logLevel = 'LOG_INFO';
var postLoaders = [
    {
        test: /\.jsx?$/,
        exclude: /(tests|node_modules|bower_components)/,
        loader: 'istanbul-instrumenter'
    }
];

function isDebug(argument) {
    return argument === '--debug';
}
if (process.argv.some(isDebug)) {
    singleRun = false;
    postLoaders = [];
    browsers = ['Chrome'];
    logLevel = 'LOG_DEBUG';
}

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    plugins: [
        'karma-chrome-launcher',
        'karma-phantomjs-launcher',
        'karma-jasmine',
        'karma-sourcemap-loader',
        'karma-webpack',
        'karma-coverage'
    ],

    // list of files / patterns to load in the browser
    files: [
        './tests/helpers/*.js',
        'tests.webpack.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'tests.webpack.js': ['webpack', 'sourcemap']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    coverageReporter: {
        dir: 'coverage/',
        reporters: [
            {type: 'html', subdir: 'report-html'},
            {type: 'text-summary'}
        ]
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config[logLevel],


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['PhantomJS'],
    browsers: browsers,


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: singleRun,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    
    webpack: {
        devtool: 'inline-source-map',
        module: {
            loaders: [
                { test: /\.jsx?$/, loader: 'babel-loader' }
            ],
            postLoaders: postLoaders
        },
		plugins: [
			new webpack.ResolverPlugin([
				new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
			])
		],
		resolve: {
			root: [path.join(__dirname, "./bower_components"), path.join(__dirname, "./src")]
		},
        watch: true
    },
	webpackMiddleware: {
		noInfo: true
	},
    webpackServer: {
        noInfo: true
    }
  })
}
