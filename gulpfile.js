var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync');
var pkg = require('./package.json');
var reload = browserSync.reload;
var Server = require('karma').Server;
var moment = require('moment');

var DEST = 'dist/';
var APP = 'app/scripts/';
var SRC = 'src/**/*.js';
var TEMP = '.tmp/';

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */'].join('\n');

gulp.task('test', function(done) {
   new Server({
       configFile: __dirname + '/karma.conf.js'
   }, function() {
       done(); 
   }).start();
});

gulp.task('default', function () {

});

gulp.task('script', function () {
    _buildTask(false);
});

gulp.task('jasmine', function () {
    var files = [
        'bower_components/react/react-with-addons.js',
        'bower_components/JSCheck/jscheck.js',
        'tests/helpers/*.js',
        'src/**/*.jsx',
        'tests/*.spec.js'
    ];

    gulp.src(files)
        .pipe($.jasmineBrowser.specRunner())
        .pipe($.jasmineBrowser.server({ port: 3000 }));

    return gulp.watch(files, { }, reload);

});

function addPkg(){
    return gulp.src(TEMP + '*.js')
        .pipe(gulp.dest(APP));
}

function _buildTask(watch) {
    var webpack = $.webpackBuild;
    return gulp.src(webpack.config.CONFIG_FILENAME)
        .pipe(watch ? webpack.watch(_after) : webpack.run(_after));
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