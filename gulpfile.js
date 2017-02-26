const gulp = require('gulp'),
      sass = require('gulp-sass'),
      useref = require('gulp-useref'),
      minify = require('gulp-minify'),
      cssmin = require('gulp-cssmin'),
      babel = require('gulp-babel'),
      eslint = require('gulp-eslint'),
      plumber = require('gulp-plumber'),
      notify = require('gulp-notify'),
      include = require("gulp-include"),
      browserSync = require('browser-sync').create();

const errorHandler = function (err) {
  gulp.src('').pipe(notify(err.message));
  console.log(err);
  this.emit('end');
} 

gulp.task('default', ['watch', 'browserSync']);

gulp.task('watch', function () {
  gulp.watch('app/scripts/**/*.js', ['js']); 
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  gulp.watch('app/index.html', ['html']);
})
 


// sass -----------------------------
gulp.task('sass', function(){
  return gulp.src('app/scss/*.scss')
    .pipe(plumber(errorHandler))
    .pipe(sass())
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
}); 

// ----------------------------------

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
})

gulp.task('js', function() {
  return gulp.src('app/scripts/main.js')
  .pipe(plumber(errorHandler))
  .pipe(include())
  .pipe(babel({
        presets: ['es2015']
    }))
  .pipe(eslint({
    'rules':{
        'semi': [1, 'always']
    }
  }))
  .pipe(eslint.format())
  .pipe(minify())
  .pipe(gulp.dest('dist/scripts'))
}); 

gulp.task('html', function() {
  return gulp.src('app/index.html')
  .pipe(gulp.dest('dist'))
})

// media --------------------------
gulp.task('media', ['copy-images','copy-sounds'])

gulp.task('copy-images', function () {
    return gulp.src('app/images/*')
    .pipe(gulp.dest('dist/images'))
})
gulp.task('copy-sounds', function () {
    return gulp.src('app/sounds/*')
    .pipe(gulp.dest('dist/sounds'))
})