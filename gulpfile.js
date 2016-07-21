
'use strict';

var del = require('del');
var path = require('path');
var merge = require('merge');
var karma = require('karma');
var gulp = require('gulp');
var jade = require('gulp-jade');
var tsc = require('gulp-typescript');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var typedoc = require('gulp-typedoc');


var PATHS = {
  dist: 'dist',
  page: [
    "src/**/*.jade"
  ],
  scripts: [
    "!src/**/*_test.ts",
    "src/**/*.ts"
  ]
};

var tscSource = [].concat.apply([], [
  PATHS.scripts,
]);

var es5Project = tsc.createProject({
  target: "es5",
  declaration: true,        // Generates corresponding .d.ts files
  noExternalResolve: true,  // Do not resolve files that are not in the input
  typescript: require('typescript')
});

var es6Project = tsc.createProject({
  target: "es6",
  declaration: true,        // Generates corresponding .d.ts files
  noExternalResolve: true,  // Do not resolve files that are not in the input
  typescript: require('typescript')
});

function src(){
  return gulp.src.apply(gulp, arguments)
  .pipe(plumber(function (err) {
    console.error(err.message || err);
  }))
}

gulp.task('clean', function(){
  return del([PATHS.dist]);
});

function dest(){
  var target = PATHS.dist;
  if (arguments.length) {
    var join = path.join;
    target = join(target, path.join.apply(path, arguments));
  }
  return gulp.dest(target);
}

//
// TS COMPILATION TASKS
//

gulp.task('compile:es5', function(){
  var tscResult = src(tscSource)
    .pipe(sourcemaps.init())
    .pipe(tsc(es5Project));

  return merge([
    tscResult.dts.pipe(dest("typedefs")),
    tscResult.js
      .pipe(concat('bychance.js'))
      .pipe(sourcemaps.write('.',{includeContent:false, sourceRoot:'../src'}))
      .pipe(dest())
  ]);
});

gulp.task('compile:es6', function(){
  var tscResult = src(tscSource)
    .pipe(sourcemaps.init())
    .pipe(tsc(es6Project));

  return merge([
    tscResult.dts.pipe(dest("es6/typedefs")),
    tscResult.js
      .pipe(concat('es6/typedefs.js'))
      .pipe(sourcemaps.write('.',{includeContent:false, sourceRoot:'../../src'}))
      .pipe(dest())
  ]);
});

gulp.task('compile', ['compile:es5', 'compile:es6']);

//
// DOCS & PAGES TASKS
//

gulp.task('docs', function(){
  return gulp.src(tscSource).pipe(typedoc({
    target: "ES5",
    out: "dist/docs/",
    mode: "file",
    name: "Bychance",
    entryPoint: "Bychance",
    excludeExternals: true
  }));
});

gulp.task('page', function(){
  return src(PATHS.page)
    .pipe(jade({
      pretty: true
    }))
    .pipe(dest())
});


//
// WATCHER TASKS
//

gulp.task('watch', ['compile', 'page'], function() {
  gulp.watch(tscSource, ['compile']);
  gulp.watch(PATHS.page, ['page']);
});

gulp.task('test', function (done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('watch:test', ['watch'], function (done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('build', ['compile', 'docs']);
gulp.task('default', ['build']);
