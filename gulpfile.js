var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var buffer = require('vinyl-buffer');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');
var ngmin = require('gulp-ngmin');
var uglify = require('gulp-uglify');

gulp.task('sass', function () {
	return gulp.src([
			'node_modules/bootstrap/scss/bootstrap.scss',
			'f/src/scss/main.scss'
		])
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('build.css'))
		.pipe(gulp.dest('f/min/css'));
});

gulp.task('js', function() {
		return gulp.src([
			'node_modules/jquery/dist/jquery.min.js',
			'node_modules/angular/angular.min.js',
			'f/src/js/app.js',
			'f/src/js/angular/factory/*.js',
			'f/src/js/angular/controllers/*.js'
		])
		.pipe(concat('build.min.js'))
		.pipe(gulp.dest('f/min'));
});

gulp.task('build-sass', function () {
	return gulp.src([
		'node_modules/bootstrap/scss/bootstrap.scss',
		'f/src/scss/main.scss'
	])
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('build.css'))
		.pipe(csso())
		.pipe(gulp.dest('docs/f/min/css'));
});

gulp.task('build-js', function() {
	return gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/angular/angular.min.js',
		'f/src/js/app.js',
		'f/src/js/angular/factory/*.js',
		'f/src/js/angular/controllers/*.js'
	])
	.pipe(uglify('build.min', {outSourceMap: true}))
	.pipe(ngmin())
	.pipe(concat('build.min.js'))
	.pipe(gulp.dest('docs/f/min'));
});

gulp.task('build-static', function() {
	return gulp.src([
		'index.html'
	]).pipe(gulp.dest('docs'));
});



gulp.task('watch', function () {
	gulp.watch('f/src/**/*.scss', ['sass']);
	gulp.watch('f/src/**/*.js', ['js']);
	gulp.watch('f/src/**/**/*.js', ['js']);
});

gulp.task('default', ['sass', 'js', 'watch']);
gulp.task('build', ['build-static', 'build-sass', 'build-js']);
