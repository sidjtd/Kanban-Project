var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var gulp        = require('gulp');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

  browserSync.init({
      proxy: 'localhost:2458'
  });
  gulp.watch("scss/*.scss", ['sass']);
  gulp.watch("scss/**/*.scss", ['sass']);
  gulp.watch("public/*").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("scss/styles.scss")
    .pipe(sass())
    .pipe(gulp.dest("public/css"))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);