const gulp = require('gulp');
const gutil = require('gulp-util');
const changed = require('gulp-changed');
const sass = require('gulp-sass');

const SRC_DIR = 'resources/';
const DIST_DIR = 'public/';

const config = require('config');
const jshint = require('gulp-jshint');

gulp.task('build', ['build:assets','build:css']);

/**
 * Copy all static assets from ./frontend/src/public/* to ./frontend/dist/
 * (includes /images, /fonts, /robots.txt)
 */
gulp.task('build:assets', () => {
  return gulp.src([`${SRC_DIR}/public/**/*`])
    .pipe(changed(`${DIST_DIR}`))
    .pipe(gulp.dest(DIST_DIR + '/public/'));
});

gulp.task('watch:assets', () => {
  gulp.watch(`${SRC_DIR}/public/**/*`, ['build:assets']);
});

gulp.task('sass', function () {
  return gulp.src(`${SRC_DIR}/sass/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(DIST_DIR + '/css/'));
});

gulp.task('sass:watch', function () {
  gulp.watch(`${SRC_DIR}/sass/**/*.scss`, ['sass']);
});

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src(`${SRC_DIR}/js/**/*.js`)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(DIST_DIR + '/js/'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('js:watch', function() {
  gulp.watch(`${SRC_DIR}/js/**/*.js`, ['jshint']);
});
