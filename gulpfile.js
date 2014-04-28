var fs = require('fs');
var gulp = require('gulp');
var colors = require('colors');
var gutil = require('gulp-util');

gulp.task('doctor', function() {
	if (!fs.existsSync('cocos2d-js')) {
		gutil.log('cocos2d-js project not found, please run command: '.red + 'cocos new -p com.project.name -l js -d cocos2d-js projectname');
	}
	else {
		gutil.log('cocos2d-js project founded!'.green);
	}
});

gulp.task('default', ['doctor']);