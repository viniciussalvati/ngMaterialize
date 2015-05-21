var gulp = require('gulp');
var ts = require('gulp-typescript');

var tsProject = ts.createProject({
	out: 'ngMaterialize.js',
	noExternalResolve: true,
	declarationFiles: true,
	target: 'ES5'
});

gulp.task('compile', function () {
	gulp.src(['typings/**/*.ts', 'src/ngMaterialize.ts', 'src/*.ts'])
		.pipe(ts(tsProject))
		.pipe(gulp.dest('.'));
});

gulp.task('build', ['compile']);

gulp.task('watch', ['build'], function(){
	gulp.watch('src/*.ts', ['build']);
});

gulp.task('default', ['watch']);