var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');

var tsProject = ts.createProject({
	out: 'ngMaterialize.js',
	noExternalResolve: true,
	declarationFiles: true,
	target: 'ES5'
});

gulp.task('compile', function () {
	var tsPipes = gulp.src(['src/ngMaterialize.ts', 'src/**/*.ts'])
		.pipe(ts(tsProject));

	var js = merge(gulp.src('src/js_before'), tsPipes.js, gulp.src('src/js_after'))
		.pipe(concat('ngMaterialize.js'))
		.pipe(gulp.dest('dist'))
		.pipe(uglify())
		.pipe(concat('ngMaterialize.min.js')) // lazy way to rename the output :)
		.pipe(gulp.dest('dist'))
		.pipe(gzip({ append: true }))
		.pipe(gulp.dest('dist'));

	var dts = merge(gulp.src('src/dts_before'), tsPipes.dts, gulp.src('src/dts_after'))
		.pipe(concat('ngMaterialize.d.ts'))
		.pipe(gulp.dest('dist'));

	return merge([js, dts]);
});

gulp.task('build', ['compile']);

gulp.task('watch', ['build'], function () {
	gulp.watch('src/*.ts', ['build']);
});

gulp.task('default', ['watch']);