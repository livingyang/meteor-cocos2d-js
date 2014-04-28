var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var bust = require('gulp-buster');

var paths = {
	scripts: ['src/main.begin.coffee', 'src/main/**/*.coffee', 'src/main.end.coffee'],
	app: 'meteor/public/app/',
	public: 'meteor/public/'
};

gulp.task('doctor', function() {
	if (!fs.existsSync('cocos2d-js')) {
		gutil.log(gutil.colors.red('cocos2d-js project not found, please run command: ') + 'cocos new -p org.project.name -l js -d cocos2d-js app');
	}
	else {
		gutil.log(gutil.colors.green('cocos2d-js project founded!'));
	}
});

gulp.task('build', function() {
	return gulp.src(paths.scripts)
	.pipe(coffee())
	.pipe(concat('main.js'))
	.pipe(gulp.dest(paths.app));
});

gulp.task('uglify', ['build'], function() {
	return gulp.src(paths.app + 'main.js')
	.pipe(uglify())
	.pipe(gulp.dest(paths.app));
});

gulp.task('release', function () {
	return gulp.src(paths.app + "**")
	.pipe(gulp.dest('cocos2d-js/app/'));
})

gulp.task('busters', function() {
	var oldCwd = process.cwd();
	process.chdir(paths.public);
	gulp.src("app/**")
	.pipe(bust('busters.json'))
	.pipe(gulp.dest('.'));
	process.chdir(oldCwd);
});

gulp.task('default', ['build', 'busters', 'release']);
