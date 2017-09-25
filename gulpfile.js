var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var imagemin = require('gulp-imagemin');
var cssnano = require('gulp-cssnano');
var rename = require("gulp-rename");
var mainBowerFiles = require('gulp-main-bower-files');
//var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var notify = require("gulp-notify");
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var inject = require('gulp-inject');
var watchLess = require('gulp-watch-less');
var sass = require('gulp-sass');
var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
var flatten = require('gulp-flatten');
var cache = require('gulp-cache');
var useref = require('gulp-useref');
var wiredep = require('wiredep').stream;
var del = require('del');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Include plugins
var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});

//gulp.task('fonts', () => {
  //return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    //.concat('app/fonts/**/*'))
  /*  .pipe(gulp.dest('app/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});*/
//bower reuired Fonts
gulp.task('fonts', function(){
	return gulp.src('bower_components/**/*.{ttf,woff,woff2,eof,svg}')
    .pipe(flatten())
	.pipe(gulp.dest('app/fonts/'))
	.pipe(gulp.dest('dist/fonts/'));
});

gulp.task('less', () => {
 return gulp.src('app/styles/less/*.less')
  .pipe(sourcemaps.init())
  .pipe(less({
    plugins: [autoprefix],
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('app/styles/css'))
  .pipe(reload({stream: true}));
});


gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('app/scripts'))
    .pipe(reload({stream: true}));
});

// Images
gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});


gulp.task('html', ['less', 'scripts'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

// Clean
gulp.task('clean', function() {
  return del(['dist/styles/css', 'dist/scripts', 'dist/images']);
});

//live reload / browserSync
gulp.task('serve', [/*'wiredep', */'fonts','less','scripts'],  function(){
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['app']
      // routes: {
      //   '/bower_components': 'bower_components'
      // }
    }
  });
  gulp.watch(['app/*.html','app/images/**/*','app/fonts/**/*']).on('change', reload);
  gulp.watch('app/styles/**/*.less', ['less']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  //gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', function() {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});


//wirdep bower component
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;
  gulp.src('app/styles/less/*.less')
    .pipe(wiredep({
      dependencies: true, 
  	  devDependencies: true,
      fileTypes: {
        scss: {
          replace: {
            less: '@import "{{filePath}}";'
          }
        }
      },
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles/css'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      dependencies: true, 
  	  devDependencies: true,
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});


// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('html', 'fonts', 'less', 'scripts', 'images');
});
