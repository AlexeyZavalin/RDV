'use strict'

var gulp = require('gulp'),
less = require('gulp-less'),
path = require('path'),
livereload = require('gulp-livereload'),
connect = require('gulp-connect'),
wiredep = require('wiredep').stream,
useref = require('gulp-useref'),
gulpif = require('gulp-if'),
uglify = require('gulp-uglify'),
minifyCss = require('gulp-clean-css'),
clean = require('gulp-clean');

gulp.task('clean', function () {
	return gulp.src("dist", {read: false})
	.pipe(clean());
});

gulp.task('build', ['clean'], function () {

	return gulp.src("app/*.html")
	.pipe(useref())
	.pipe(gulpif('js/*.js', uglify()))
	.pipe(gulpif('css/*.css', minifyCss()))
	.pipe(gulp.dest('dist'));
});

gulp.task('bower', function () {
  gulp.src('app/index.html')
    .pipe(wiredep({
      directory : 'app/bower_components/'
    }))
    .pipe(gulp.dest('app/'));
});

gulp.task('connect', function () {
	connect.server({
		root: 'app/',
		port: 8080,
		livereload: true
	});
});

gulp.task('html', function () {
	gulp.src('app/*.html')	
	.pipe(connect.reload())
	
});

gulp.task('less', function () {
	return gulp.src('app/less/*.less')
	.pipe(less({
		paths: [ path.join(__dirname, 'less', 'includes') ]
	}))
	.pipe(gulp.dest('app/css/'));
});

gulp.task('css', function () {
	return gulp.src('app/css/*.css')
	.pipe(connect.reload());
});

gulp.task('watch', function () {
	gulp.watch('app/less/*.less', ['less'])
	gulp.watch('app/css/*.css', ['css'])
	gulp.watch('app/*.html', ['html'])
	gulp.watch('app/js/*.js', ['html'])
	gulp.watch('bower.json', ['bower'])
});

gulp.task('default', ['connect', 'watch']);