'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task('compressjs', function (cb) {
  pump([
    gulp.src('app/js/*.js'),
    uglify(),
    gulp.dest('app/js/dist')
  ],
    cb
  );
});

gulp.task('compressjs:watch', function () {
  gulp.watch('app/js/*.js', ['compressjs']);
});