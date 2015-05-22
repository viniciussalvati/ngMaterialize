var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var concat = require('gulp-concat');

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
		.pipe(concat('ngMaterialize.js'));
		
	var dts = merge(gulp.src('src/dts_before'), tsPipes.dts, gulp.src('src/dts_after'))
		.pipe(concat('ngMaterialize.d.ts'));
	
	return merge([js, dts])
		.pipe(gulp.dest('dist'));
});

gulp.task('build', ['compile']);

gulp.task('watch', ['build'], function () {
	gulp.watch('src/*.ts', ['build']);
});

gulp.task('default', ['watch']);