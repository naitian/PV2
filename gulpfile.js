// 'use strict';
// Hugely borrowed from https://www.chenhuijing.com/blog/gulp-jekyll-github/

const gulp = require('gulp');
const prefix = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const cleancss = require('gulp-clean-css');
const sass = require('gulp-sass');
const cp = require('child_process');
const babel = require('gulp-babel');
const debug = require('gulp-debug');
const image = require('gulp-imagemin');
const newer = require('gulp-newer');

/********************
 * Task Definitions *
 ********************/

const jekyllBuild = () => {
   return cp.spawn('bundle',
        ['exec', 'jekyll', 'build', '--drafts', '--config', '_config_dev.yml', 'JEKYLL_ENV=production'],
        {stdio: 'inherit'});
};

const jekyllIncBuild = () => {
   return cp.spawn('bundle',
        ['exec', 'jekyll', 'build', '--incremental', '--drafts', '--config', '_config_dev.yml', 'JEKYLL_ENV=production'],
        {stdio: 'inherit'});
};

const jekyllProduction = () => {
   return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'});
};

const css = () => {
    return gulp.src('./_assets/css/**/*.scss')
      .pipe(debug())
      .pipe(sass().on('error', sass.logError))
      .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(cleancss())
      .pipe(gulp.dest('./css'));
};

const js = () => {
    return gulp.src('./_assets/js/**/*.js')
      .pipe(debug())
      .pipe(babel({
         presets: ['@babel/env']
      }))
      .pipe(uglify())
      .pipe(gulp.dest('js'));
};

const watch = () => {
   gulp.parallel(['css', 'js', 'image']);
   jekyllBuild();
   gulp.watch('_assets/js/**/*.js', {interval: 500}, gulp.series('js', 'jekyll-rebuild'));
   gulp.watch(['_assets/css/**/*.scss', '_includes/**/*.css'], {interval: 500}, gulp.series('css', 'jekyll-rebuild'));
   gulp.watch(['_assets/img/**/*'], {interval: 500}, gulp.series('image-dev', 'jekyll-rebuild'));
   gulp.watch(['*.html', '*.json', '_layouts/*.html', '_posts/*', '_art/*', '_projects/*', '_includes/*', '_drafts/*', '!_site/*'], {interval: 500}, gulp.series( 'jekyll-inc-rebuild'));
};

const imageTask = () => {
   return gulp.src(['_assets/img/**/*.png', '_assets/img/**/*.jpg', '_assets/img/**/*.gif', '_assets/img/**/*.svg'])
      .pipe(newer('assets'))
      .pipe(debug())
      .pipe(image())
      .pipe(gulp.dest('assets'));
};

const imageDev = () => {
   return gulp.src(['_assets/img/**/*.png', '_assets/img/**/*.jpg', '_assets/img/**/*.gif', '_assets/img/**/*.svg'])
      .pipe(gulp.dest('assets'));
}

/***********************
 * Task Instantiations *
 ***********************/

gulp.task('jekyll-rebuild', jekyllBuild);

gulp.task('jekyll-inc-rebuild', jekyllIncBuild);

gulp.task('jekyll-prod', jekyllProduction);

gulp.task('css', css);

gulp.task('js', js);

gulp.task('image', imageTask);

gulp.task('image-dev', imageDev);

gulp.task('watch', watch);

gulp.task('build', gulp.series([ gulp.parallel([ 'js', 'css', 'image' ]), 'jekyll-prod' ]));
