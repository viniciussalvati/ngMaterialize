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

function handleJsResults(jsPipe) {
	var js = es.merge(gulp.src('src/js_before'), jsPipe, gulp.src('src/js_after'))
		.pipe(concat('ngMaterialize.js'));
	
	var min = js
		.pipe(clone())
		.pipe(rename({ extname: '.min.js' }))
		.pipe(uglify());

	var gz = min
		.pipe(clone())
		.pipe(gzip({ append: true }));

	return es.merge(js, min, gz);
}

function handleDtsResults(dtsPipe) {
	var replacedText = dtsPipe.pipe(replace('declare ', ''));

	return es.merge(gulp.src('src/dts_before'), replacedText, gulp.src('src/dts_after'))
		.pipe(concat('ngMaterialize.d.ts'));
}

gulp.task('compile', function () {
	var tsPipes = gulp.src(['src/ngMaterialize.ts', 'src/**/*.ts'])
		.pipe(ts(tsProject));

	var js = handleJsResults(tsPipes.js);

	var dts = handleDtsResults(tsPipes.dts);

	return es.merge([js, dts])
		.pipe(gulp.dest('build'));
});

gulp.task('build', ['compile'], function () {
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