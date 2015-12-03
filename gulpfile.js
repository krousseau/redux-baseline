var del                     = require('del');
var gulp                    = require('gulp');
var sass                    = require('gulp-sass');
var sourcemaps              = require('gulp-sourcemaps');
var gutil                   = require('gulp-util');
var cssMinify               = require('gulp-minify-css');
var mkdirp                  = require('mkdirp');
var path                    = require('path');
var webpack                 = require('webpack');
var webpackConfigDev        = require('./webpack.config.js');
var webpackConfigProd       = require('./webpack-production.config.js');
var pkg                     = require('./package.json');
var concatCss               = require('gulp-concat-css');
var modifyCssUrls           = require('gulp-modify-css-urls');
var rev                     = require('gulp-rev');
var gulpif                  = require('gulp-if');
var uglify                  = require('gulp-uglify');
var nsp                     = require('gulp-nsp');
var fs                      = require('fs');

gulp.task('build', ['build-dev']);
gulp.task('build-dev', ['webpack:build-dev', 'css-dev']);
gulp.task('build-prod', ['nsp', 'webpack:build-prod', 'css-prod']);
gulp.task('default', ['webpack:build-dev']);
gulp.task('clean', ['clean-all']);

gulp.task('watch', ['build-dev'], function() {
    // Catalyst
    gulp.watch(pkg.paths.source.js, ['build-js-dev']);
    gulp.watch(pkg.paths.source.css, ['css-dev']);
});

gulp.task('webpack:build-prod', ['clean-js'], function(cb) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfigProd);

	// run webpack
	webpack(myConfig, function(err, stats) {
		if(err) {
            throw new gutil.PluginError('webpack:build', err);
        }
        gutil.log('[webpack:build-dev]', stats.toString({
    		colors: true
    	}));
        var jsonStats = stats.toJson();
        if(jsonStats.errors.length > 0) {
            throw new gutil.PluginError('webpack:build', 'webpack build failed');
        }

		cb();
	});
});

// create a single instance of the compiler to allow caching
var devCompiler = webpack(webpackConfigDev);
gulp.task('webpack:build-dev', ['clean-js', 'build-js-dev'], function(cb) {
    cb();
});

gulp.task('nsp', function (cb) {
    nsp({ package: __dirname + '\\package.json' }, cb);
});

gulp.task('build-js-dev', function(cb){
    devCompiler.run(function(err, stats) {
        if(err) {
            gutil.log('webpack build failed');
            throw new gutil.PluginError('webpack:build-dev', err);
        }

        gutil.log('[webpack:build-dev]', stats.toString({
            colors: true
        }));
        var jsonStats = stats.toJson();
        if(jsonStats.errors.length > 0) {
            throw new gutil.PluginError('webpack:build', 'webpack build failed');
        }

        cb();
    });
});

gulp.task('css-dev', ['clean-css'], function () {
  return gulp.src(pkg.paths.source.css)
    .pipe(sourcemaps.init())
    .pipe(sass({
        errLogToConsole: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(pkg.paths.dest.css));
});

gulp.task('css-prod', ['clean-css'], function () {
  return gulp.src(pkg.paths.source.css)
    .pipe(gulpif(/.scss$/, sass({
        errLogToConsole: true
    })))
    .pipe(cssMinify())
    .pipe(rev())
    .pipe(gulp.dest(pkg.paths.dest.css))
    .pipe(rev.manifest('css-manifest.json'))
    .pipe(gulp.dest(pkg.paths.manifest.css));
});

gulp.task('clean-all', function (cb) {
    del([
        pkg.paths.dest.css,
        pkg.paths.dest.js,
        pkg.paths.dest.hashfile
    ],
    {force:true})
    .then(function() {
        // webpack assets json file was not creating the directory so force it here
        mkdirp(pkg.paths.dest.js, function(err) {
            // path was created unless there was error
            if(err){
                throw new gutil.PluginError('mkdirp', 'error creating output directory');
            }
            cb();
        });

        mkdirp(pkg.paths.dest.css, function(err){
            if(err){
                throw new gutil.PluginError('mkdirp', 'error creating output directory');
            }
        });
    });
});

gulp.task('clean-js', function(cb){
    del([
        pkg.paths.dest.js,
        pkg.paths.dest.hashfile
    ],
    {force:true})
    .then(function() {
        // webpack assets json file was not creating the directory so force it here
        mkdirp(pkg.paths.dest.js, function(err) {
            // path was created unless there was error
            if(err){
                throw new gutil.PluginError('mkdirp', 'error creating output directory');
            }
            cb();
        });
    });
});

gulp.task('clean-css', function (cb) {
    del([
        pkg.paths.dest.css,
        pkg.paths.dest.hashfile
    ],
    {force:true})
    .then(function() {
        mkdirp(pkg.paths.dest.css, function(err){
            if(err){
                throw new gutil.PluginError('mkdirp', 'error creating output directory');
            }
            cb();
        });
    });
});