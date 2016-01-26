var gulp = require('gulp');
var $ = require('gulp-load-plugins');
var del = require('del');
var browserSync = require('browser-sync');
var pkg = require('./package.json');
var reload = browserSync.reload;
var Server = require('karma').Server;

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