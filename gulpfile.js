var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var bust = require('gulp-buster');
var jeditor = require("gulp-json-editor");

var paths = {
	scripts: ['src/main.begin.coffee', 'src/main/**/*.coffee', 'src/main.end.coffee'],
	app: 'meteor/public/app/',
	public: 'meteor/public/',
	cocos2d: 'cocos2d-js/app/'
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

gulp.task('uglify', function() {
	return gulp.src(paths.scripts)
	.pipe(coffee())
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(gulp.dest(paths.app));
});

gulp.task('busters', function() {
	var oldCwd = process.cwd();
	var stream = process.chdir(paths.public);
	gulp.src("app/**")
	.pipe(bust('busters.json'))
	.pipe(gulp.dest('.'));
	process.chdir(oldCwd);
});

gulp.task('watch-coffee-build', function () {
	gulp.watch(paths.scripts, ['build']);
})

gulp.task('watch-coffee-uglify', function () {
	gulp.watch(paths.scripts, ['uglify']);
})

gulp.task('watch-resource', function () {
	gulp.watch(paths.app + '**', ['busters'])
})

gulp.task('publish', function () {
	// 1 copy resource
	gulp.src(paths.app + "**")
	.pipe(gulp.dest(paths.cocos2d));

	// 2 add busters to project.json
	return gulp.src(paths.cocos2d + 'project.json')
	.pipe(jeditor(function(json) {
		json.busters = JSON.parse(String(fs.readFileSync(paths.public + 'busters.json')));
		return json;
	}))
	.pipe(gulp.dest(paths.cocos2d));
});

gulp.task('debug', ['watch-coffee-build', 'watch-resource'], function () {
	gulp.watch(paths.public + 'busters.json', ['publish']);
})

gulp.task('release', ['watch-coffee-uglify', 'watch-resource'], function () {
	gulp.watch(paths.public + 'busters.json', ['publish']);
})

gulp.task('default', ['debug']);
