const gulp = require('gulp'),
      del = require('del'),
      browserSync = require('browser-sync').create(),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCSS = require('gulp-clean-css'),
      imagemin = require('gulp-imagemin'),
      pug = require('gulp-pug'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      uglify = require('gulp-uglify');

const config = {
   src: './src',
   build: './build',
   assets: '/assets'
};

const path = {
   src: {
      html: config.src + '/pug/pages/*.pug',
      js: config.src + '/js/main.js',
      styles: config.src + '/scss/main.scss',
      img: config.src + '/img/**',
      fonts: config.src + '/fonts/**'
   },
   build: {
      html: config.build,
      js: config.build + config.assets + '/js/',
      styles: config.build + config.assets + '/css/',
      img: config.build + config.assets + '/img/',
      fonts: config.build + config.assets + '/fonts/'
   },
   watch: {
      html: config.src + '/pug/**/*.pug',
      js: config.src + '/js/**/*.js',
      styles: config.src + '/scss/**/*.scss',
      img: config.src + '/img/**',
      fonts: config.src + '/fonts/**'
   },
   clean: config.build,
   serve: config.build
};

// PUG
gulp.task('html:dev', () => {
   return gulp
      .src(path.src.html)
      .pipe(pug({
         pretty: true
      }))
      .pipe(gulp.dest(path.build.html))
      .pipe(browserSync.stream());
});

gulp.task('html:build', () => {
   return gulp
      .src(path.src.html)
      .pipe(pug())
      .pipe(gulp.dest(path.build.html));
});

// Scripts
gulp.task('scripts:dev', () => {
   return gulp
      .src(path.src.js)
      .pipe(gulp.dest(path.build.js))
      .pipe(browserSync.stream());
});

gulp.task('scripts:build', () => {
   return gulp
      .src(path.src.js)
      .pipe(uglify({
         toplevel: true
      }))
      .pipe(gulp.dest(path.build.js))
      .pipe(browserSync.stream());
});

// Styles
gulp.task('styles:dev', () => {
   return gulp
      .src(path.src.styles)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer({
         cascade: false
      }))
      .pipe(rename('style.css'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.build.styles))
      .pipe(browserSync.stream());
});

gulp.task('styles:build', () => {
   return gulp
      .src(path.src.styles)
      .pipe(sass())
      .pipe(autoprefixer({
         cascade: false
      }))
      .pipe(cleanCSS({
         level: 2
      }))
      .pipe(rename('style.css'))
      .pipe(gulp.dest(path.build.styles));
});

// Images
gulp.task('img:dev', ()=> {
   return gulp
      .src(path.src.img)
      .pipe(gulp.dest(path.build.img));
});

gulp.task('img:build', ()=> {
   return gulp
      .src(path.src.img)
      .pipe(imagemin({
         progressive: true
      }))
      .pipe(gulp.dest(path.build.img));
});

// Fonts
gulp.task('fonts', () => {
   return gulp
      .src(path.src.fonts)
      .pipe(gulp.dest(path.build.fonts));
});

// Clean
gulp.task('clean', () => {
   return del(path.clean);
});

// Watch
gulp.task('watch', () => {
   gulp.watch(path.watch.html, gulp.series('html:dev'));
   gulp.watch(path.watch.js, gulp.series('scripts:dev'));
   gulp.watch(path.watch.styles, gulp.series('styles:dev'));
   gulp.watch(path.watch.img, gulp.series('img:dev'));
   gulp.watch(path.watch.fonts, gulp.series('fonts'));
});

// Serve
gulp.task('serve', () => {
   browserSync.init({
      server: {
         baseDir: path.serve
      }
   });
});

// Main tasks

// gulp
gulp.task('default', gulp.series('clean', gulp.parallel('html:dev', 'scripts:dev', 'styles:dev', 'img:dev', 'fonts'), gulp.parallel('watch', 'serve')));

// build
gulp.task('build', gulp.series('clean', gulp.parallel('html:build', 'scripts:build', 'styles:build', 'img:build', 'fonts')));