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
			'bower_components/bootstrap/scss/bootstrap.scss',
			'f/src/scss/main.scss'
		])
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('build.css'))
		.pipe(csso())
		.pipe(gulp.dest('f/min/css'));
});

gulp.task('js', function() {
		return gulp.src([
			'bower_components/jquery/dist/jquery.min.js',
			'bower_components/angular/angular.min.js',
			'f/src/js/app.js',
			'f/src/js/angular/factory/*.js',
			'f/src/js/angular/controllers/*.js'
		])
		.pipe(concat('build.min.js'))
		.pipe(ngmin())
		.pipe(uglify('build.min', {outSourceMap: true}))
		.pipe(gulp.dest('f/min'));
});

gulp.task('watch', function () {
	gulp.watch('f/src/**/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'js', 'watch']);