var gulp = require('gulp');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var browserSync = require('browser-sync').create();
var minify = require('gulp-minify');
var cssmin = require('gulp-cssmin');

 
// define tasks here
gulp.task('default', ['watch', 'browserSync']);

gulp.task('watch', function () {
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  gulp.watch('app/index.html', ['useref']);
  gulp.watch('app/scripts/partials/*.js', ['useref']); 
  // gulp.watch('dist/scripts/main.js', ['compress'])
})

 
gulp.task('compress', function() {
  gulp.src('dist/scripts')
    .pipe(minify({
        ext:{
            src:'dist/main.js',
            min:'.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('dist/scripts'))
});





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

// ----------------------------------


// sass -----------------------------
    
gulp.task('sass', function(){
  return gulp.src('app/scss/*.scss')
    .pipe(sass()) // Using gulp-sass
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



gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});