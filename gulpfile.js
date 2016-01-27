var gulp = require('gulp');
var $ = require('gulp-load-plugins');
var del = require('del');
var browserSync = require('browser-sync');
var pkg = require('./package.json');
var reload = browserSync.reload;
var Server = require('karma').Server;
var moment = require('moment');

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

function _buildTask(watch) {
    var webpack = $.webpackBuild;
    return gulp.src(webpack.config.CONFIG_FILENAME)
        .pipe(watch ? webpack.watch(_after) : webpack.compile(_after))
        .pipe(gulp.dest('dist/'));
}

function _after(err, stats) {
    if (err) {
        $.gutil.beep();
        _logErrors([err]);
    } else if (stats.compilation.errors.length > 0) {
        $.gutil.beep();
        _logErrors(stats.compilation.errors);
    } else {
        $.gutil.log('Scripts recompiled, Time elapsed: ' +
            moment.duration(stats.endTime - stats.startTime).asSeconds() + 's');
    }
}

function _logErrors(errors) {
    for (var i = 0; i < errors.length; i++) {
        $.gutil.log($.gutil.colors.red(errors[i]));
    }
}