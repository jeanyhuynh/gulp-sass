var gulp = require('gulp');
/// Sass dependencies
var sass = require('gulp-sass'); // Compile Sass into CSS
var autoprefixer = require ("gulp-autoprefixer")// support css auto generate prefix any browser;
var minifyCSS = require('gulp-minify-css'); // Minify the CSS

// Minification dependencies
var concat = require('gulp-concat'); // Join all JS files together to save space
// var babel = require('gulp-babel'); //Use next generation JavaScript
import babel from "gulp-babel"
var sourcemaps = require('gulp-sourcemaps');//Inline source maps are embedded in the source file
var uglify = require('gulp-uglify'); // Minify JavaScript
var imagemin = require('gulp-imagemin'); // Minify images

var size = require('gulp-size'); // Get the size of the project
var browserSync = require('browser-sync'); // Reload the browser on file changes
const reload = browserSync.reload;
const root = "node_modules";

gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass()) // Using gulp-sass
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/assets/css'))
        /* Reload the browser CSS after every change */
        .pipe(reload({stream:true}));
});
// HTML gulp task
gulp.task("html", function() {

    return gulp.src("app/*.html").pipe(gulp.dest("dist"));
});
/* Scripts task */
gulp.task('scripts', function() {
    return gulp.src('app/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/js/'))
        .pipe(browserSync.stream());
});
// Task to minify images into build
gulp.task('images', function() {
   return gulp.src('app/images/*')
        .pipe(imagemin({
            progressive: true,
        }))
        .pipe(gulp.dest('dist/assets/images'));
});
gulp.task("fonts", function() {

    gulp
        .src([root + "/@fortawesome/fontawesome-free/webfonts/*"])
        .pipe(gulp.dest("dist/assets/fonts"));
    gulp
        .src([root + "/@fortawesome/fontawesome-free/css/fontawesome.css"])
        .pipe(gulp.dest("dist/assets/vendor"));
    return gulp;
});
// Task to get the size of the app project
gulp.task('size', function() {
  return  gulp.src('app/**')
        .pipe(size({
            showFiles: true,
        }));
});

/* Reload task */
gulp.task('bs-reload', function () {
   return browserSync.reload();
});
gulp.task('watch',function() {
    browserSync.init({
        server: "./dist",
        port: 6800
    });
    gulp.watch(
        [root + "/bootstrap/scss/bootstrap.scss", "app/scss/**/*.scss"],
        ["sass"]
    );

    gulp.watch('app/images/**/*',['images']);
    gulp.watch("app/js/**/*.js", ['scripts']).on('change', browserSync.reload);
    gulp.watch("app/scss/**/*.scss", ['sass']).on('change', browserSync.reload);
    gulp.watch("app/*.html",['html']).on('change', browserSync.reload);

    // Other watchers
})
gulp.task("default", [
    "html",
    "images",
    "scripts",
    "sass",
    "fonts"
]);

