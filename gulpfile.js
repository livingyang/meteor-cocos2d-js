var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var bust = require('gulp-buster');
var jeditor = require('gulp-json-editor');
var ncp = require('ncp').ncp;

var paths = {
	projectJson: 'meteor/public/project.json',
	busters: ['main.js', 'res/**', 'src/**'],
	
	appCoffee: 'src/app/**/*.coffee',
	mainCoffee: 'src/main.coffee',
	meteorAppJs: 'meteor/public/src/',
	meteorMainJs: 'meteor/public/',

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

gulp.task('build-main', function() {
	var stream = gulp.src(paths.mainCoffee)
	.pipe(coffee())
	.pipe(concat('main.js'))
	if (needUglify) {
		stream.pipe(uglify())
	};
	
	stream.pipe(gulp.dest(paths.meteorMainJs));
});

gulp.task('build-app', function() {
	var stream = gulp.src(paths.appCoffee)
	.pipe(coffee())
	.pipe(concat('app.js'))
	if (needUglify) {
		stream.pipe(uglify())
	};
	
	return stream.pipe(gulp.dest(paths.meteorAppJs));
});

gulp.task('busters', function() {
	var oldCwd = process.cwd();
	process.chdir(paths.public);
	gulp.src(paths.busters)
	.pipe(bust('project.json'))
	.pipe(jeditor(function(json) {
		var projectJson = JSON.parse(fs.readFileSync(paths.projectJson));
		projectJson.busters = json;
		return projectJson;
	}))
	.pipe(gulp.dest('.'));
	process.chdir(oldCwd);
});

gulp.task('watch-src', function () {
	gulp.watch(paths.mainCoffee, ['build-main']);
	gulp.watch(paths.appCoffee, ['build-app']);
})

gulp.task('watch-resource', function () {
	gulp.watch(paths.busters, ['busters'])
})

gulp.task('publish', function () {
	var fileList = ['main.js', 'project.json', 'res', 'src']
	for (var i = 0; i < fileList.length; i++) {
		ncp(paths.public + fileList[i], paths.cocos2d + fileList[i]);
	}
});

gulp.task('debug', ['watch-src', 'watch-resource'], function () {
	needUglify = false;
	gulp.watch(paths.projectJson, ['publish']);
})

gulp.task('release', ['watch-src', 'watch-resource'], function () {
	needUglify = true;
	gulp.watch(paths.projectJson, ['publish']);
})

gulp.task('default', ['debug']);
