var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var bust = require('gulp-buster');

var paths = {
	scripts: ['src/app.begin.coffee', 'src/app/**/*.coffee', 'src/app.end.coffee'],
	images: 'client/img/**/*',
	resource: 'client/resource/**'
};

gulp.task('doctor', function() {
	if (!fs.existsSync('cocos2d-js')) {
		gutil.log('cocos2d-js project not found, please run command: '.red + 'cocos new -p com.project.name -l js -d cocos2d-js projectname');
	}
	else {
		gutil.log('cocos2d-js project founded!'.green);
	}
});

gulp.task('build', function() {
	return gulp.src(paths.scripts)
	.pipe(coffee())
	.pipe(concat('app.js'))
	.pipe(gulp.dest('meteor/public'));
});

gulp.task('release', function() {
	return gulp.src(paths.scripts)
	.pipe(coffee())
	.pipe(uglify())
	.pipe(concat('app.js'))
	.pipe(gulp.dest('meteor/public'));
});

gulp.task('default', ['doctor']);