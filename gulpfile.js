var gulp = require('gulp');

var $ = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var Server = require('karma').Server;
var moment = require('moment');
var webpack = require('webpack');
var DeepMerge = require('deep-merge');
var path = require('path');

var deepmerge = DeepMerge(function(target, source, key) {
    if(target instanceof Array) {
        return [].concat(target, source);
    }
    return source;
});

var DEST = 'dist/';

var defaultConfig = {
    module: {
        loaders: [
            { test: /\.jsx?$/, loader: 'babel', exclude: /(node_modules|bower_components)/ }
        ]
    }
};

if(process.env.NODE_ENV !== 'production') {
    defaultConfig.devtool = 'source-map';
    defaultConfig.debug = true;
}

function config(overrides, altConfig) {
    return deepmerge(altConfig || defaultConfig, overrides || {});
}

var frontendConfig = config({
    entry: './app/src/script.js',
    output: {
        path: path.join(__dirname, 'app/'),
        filename: 'script.js',
        libraryTarget: 'umd'
    }
})

gulp.task('test', function(done) {
   new Server({
       configFile: __dirname + '/karma.conf.js'
   }, function() {
       done(); 
   }).start();
});

gulp.task('clean-dest', function() {
    return del([DEST + '*']);
});

gulp.task('minify', function() {
    var envs = $.env.set({
        PROD_DEV: 1
    });

    return gulp.src($.webpackBuild.config.CONFIG_FILENAME)
        .pipe(envs)
        .pipe($.webpackBuild.run(_after))
        .pipe(envs.reset);
});

gulp.task('build', function () {
    return webpack(frontendConfig).watch(100, onBuild());
});

function onBuild(done) {
    return function(err, stats) {
        _after(err, stats);
        
        if(done) {
            done();
        }
    }
}

gulp.task('script', function () {
    return _buildTask(false);
});

gulp.task('default', gulp.parallel(['minify', 'script']));

gulp.task("watch-script", function() {
	return _buildTask(true);
});

gulp.task('serve', gulp.series(gulp.parallel(['build', 'watch-script'], function () {
    browserSync({
        server: {
            baseDir: ['app', 'dist', 'bower_components', 'tests'],
            index: 'index.html'
        }
    });

    gulp.watch(['*.html', '**/*.js'], {cwd: 'app'}, reload);
})));

function _buildTask(watch) {
    var envs = $.env.set({
        PROD_DEV: 0
    });

    return gulp.src($.webpackBuild.config.CONFIG_FILENAME)
        .pipe(envs)
        .pipe(watch ? $.webpackBuild.watch(_after) : $.webpackBuild.run(_after))
        .pipe(envs.reset);
}

function _after(err, stats) {
    if (err) {
        $.util.beep();
        _logErrors([err]);
    } else if (stats.compilation.errors.length > 0) {
        $.util.beep();
        _logErrors(stats.compilation.errors);
    } else {
        $.util.log('Scripts recompiled, Time elapsed: ' +
            moment.duration(stats.endTime - stats.startTime).asSeconds() + 's');
    }
}

function _logErrors(errors) {
    for (var i = 0; i < errors.length; i++) {
        $.util.log($.util.colors.red(errors[i]));
    }
}