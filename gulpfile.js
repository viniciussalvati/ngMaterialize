var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');

var tsProject = ts.createProject({
	out: 'ngMaterialize.js',
	noExternalResolve: true,
	declarationFiles: true,
	target: 'ES5'
});

gulp.task('compile', function () {
	var tsPipes = gulp.src(['src/ngMaterialize.ts', 'src/**/*.ts'])
		.pipe(ts(tsProject));
	return merge([
		tsPipes.dts,
		tsPipes.js
	]).pipe(gulp.dest('dist'));
});

gulp.task('build', ['compile']);

gulp.task('watch', ['build'], function () {
	gulp.watch('src/*.ts', ['build']);
});

gulp.task('default', ['watch']);