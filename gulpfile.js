var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var bust = require('gulp-buster');
var jeditor = require("gulp-json-editor");

var paths = {
	app: 'meteor/public/app/',

	appCoffee: 'src/app/**/*.coffee',
	mainCoffee: 'src/main.coffee',
	meteorAppJs: 'meteor/public/app/src/',
	meteorMainJs: 'meteor/public/app/',

	cocos2dNetwork: 'cocos2d-js/app/frameworks/js-bindings/bindings/manual/network/',
	public: 'meteor/public/',
	cocos2d: 'cocos2d-js/app/'
};

var needUglify = false;

gulp.task('doctor', function() {
	if (!fs.existsSync('cocos2d-js')) {
		gutil.log(gutil.colors.red('cocos2d-js project not found, please run command: ') + 'cocos new -p org.project.name -l js -d cocos2d-js app');
	}
	else {
		gutil.log(gutil.colors.green('cocos2d-js project founded!'));
	}
	
	gutil.log(gutil.colors.yellow('please make sure files in cocos2d-js-modify has copy to cocos2d-js project'));
});

gulp.task('build', function() {
	var streamMain = gulp.src(paths.mainCoffee)
	.pipe(coffee())
	.pipe(concat('main.js'))
	if (needUglify) {
		streamMain.pipe(uglify())
	};
	
	streamMain.pipe(gulp.dest(paths.meteorMainJs));

	var streamApp = gulp.src(paths.appCoffee)
	.pipe(coffee())
	.pipe(concat('app.js'))
	if (needUglify) {
		streamApp.pipe(uglify())
	};
	
	return streamApp.pipe(gulp.dest(paths.meteorAppJs));
});

gulp.task('busters', function() {
	var oldCwd = process.cwd();
	var stream = process.chdir(paths.public);
	gulp.src("app/**")
	.pipe(bust('busters.json'))
	.pipe(gulp.dest('.'));
	process.chdir(oldCwd);
});

gulp.task('watch-src', function () {
	gulp.watch([paths.appCoffee, paths.mainCoffee], ['build']);
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
		json.jsList = ['src/app.js']
		return json;
	}))
	.pipe(gulp.dest(paths.cocos2d));
});

gulp.task('debug', ['watch-src', 'watch-resource'], function () {
	needUglify = false;
	gulp.watch(paths.public + 'busters.json', ['publish']);
})

gulp.task('release', ['watch-src', 'watch-resource'], function () {
	needUglify = true;
	gulp.watch(paths.public + 'busters.json', ['publish']);
})

gulp.task('default', ['debug']);
