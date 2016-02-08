var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync');
var pkg = require('./package.json');
var reload = browserSync.reload;
var Server = require('karma').Server;
var moment = require('moment');
var argv = require('yargs').argv;

var DEST = 'dist/';
var APP = 'app/scripts/';
var SRC = 'src/**/*.js';
var TEMP = '.tmp/';

var banner = ['/*!',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */\n'].join('\n');

gulp.task('test', function(done) {
   new Server({
       configFile: __dirname + '/karma.conf.js'
   }, function() {
       done(); 
   }).start();
});

gulp.task('default', ['minify'], function () {

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
        .pipe($.webpackBuild.run(_after));
})

gulp.task('serve', ['build', 'watch-script'], function () {
    browserSync({
        server: {
            baseDir: ['app', 'dist', 'bower_components', 'tests', 'node_modules'],
            index: 'index.html'
        }
    });

    gulp.watch(['*.html', '**/*.js'], {cwd: 'app'}, reload);
});

gulp.task('build', function () {
    return gulp.src('app/src/script.js')
        .pipe($.babel())
        .pipe(gulp.dest('app/'));
});

gulp.task('script', function () {
    return _buildTask(false);
});

gulp.task("watch-script", function() {
	return _buildTask(true);
});

function _buildTask(watch) {
    var webpack = $.webpackBuild;

    var envs = $.env.set({
        PROD_DEV: 0
    });

    return gulp.src(webpack.config.CONFIG_FILENAME)
        .pipe(envs)
        .pipe(watch ? webpack.watch(_after) : webpack.run(_after))
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