/* global process */
var gulp = require('gulp');
var util = require('gulp-util');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var clone = require('gulp-clone');
var es = require('event-stream');

var tsProject = ts.createProject({
	out: 'ngMaterialize.js',
	noExternalResolve: true,
	declarationFiles: true,
	target: 'ES5'
});

var release = !!util.env.release || util.env.r;

gulp.task('compile', function () {
	var tsPipes = gulp.src(['src/ngMaterialize.ts', 'src/**/*.ts'])
		.pipe(ts(tsProject));

	var js = tsPipes.js;
	var dts = tsPipes.dts.pipe(replace('declare ', ''));
	return es.merge([js, dts])
		.pipe(gulp.dest('build'));
});

gulp.task('concat-js', ['compile'], function () {
	return gulp.src(['src/js_before', 'build/ngMaterialize.js', 'src/js_after'])
		.pipe(concat('ngMaterialize.js'))
		.pipe(gulp.dest('build'));
});

gulp.task('concat-dts', ['compile'], function () {
	return gulp.src(['src/dts_before', 'build/ngMaterialize.d.ts', 'src/dts_after'])
		.pipe(concat('ngMaterialize.d.ts'))
		.pipe(gulp.dest('build'));
});

gulp.task('minify', ['concat-js'], function () {
	return gulp.src('build/ngMaterialize.js')
		.pipe(uglify())
		.pipe(rename({ extname: '.min.js' }))
		.pipe(gulp.dest('build'));
});

gulp.task('gzip', ['minify'], function () {
	return gulp.src('build/ngMaterialize.min.js')
		.pipe(gzip({ append: true }))
		.pipe(gulp.dest('build'));
});

gulp.task('build', ['compile', 'concat-js', 'concat-dts', 'minify', 'gzip'], function () {
	if (release) {
		return gulp
			.src('build/*')
			.pipe(gulp.dest('dist'));
	} else {
		util.log(util.colors.yellow.bold("Not in release mode. Won't copy files to production directory"));
	}
});

gulp.task('watch', ['build'], function () {
	gulp.watch('src/*.ts', ['build']);
});

gulp.task('default', ['watch']);