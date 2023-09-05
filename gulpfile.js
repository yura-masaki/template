'use strict'

const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const plumber = require('gulp-plumber')
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const notify = require('gulp-notify');
const rename = require("gulp-rename");
const error_handler = {
    errorHandler: notify.onError("Error: <%= error.message %>")
}

const webpackStream = require('webpack-stream')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')

const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');



function scss() {
    return gulp.src('./src/scss/style.scss', {
            sourcemaps: true
        })
        .pipe(plumber(error_handler))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(['last 2 versions', 'ie >= 10', 'Android >= 4', 'iOS >= 8']))
        .pipe(gulp.dest('./public/css/', {
            sourcemaps: './map/'
        }))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(gulp.dest('./public/css/'));
}

function js() {
    return gulp.src('./src/js/*.js')
        .pipe(plumber())
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest('./public/js/'));
}

function imgmin() {
    return gulp.src('./src/img/**/*.{jpg,jpeg,png,gif,svg}')
        .pipe(changed('./public/img'))
        .pipe(imagemin(
            [
                pngquant({
                    quality: [.8, .85],
                    speed: 1
                }),
                mozjpeg({
                    quality: 80
                }),
                imagemin.svgo(),
                imagemin.gifsicle()
            ]
        ))
        .pipe(gulp.dest('./public/img'));
}

function watcher() {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel(scss)).on('change', function (event) {});
    gulp.watch('./src/js/*.js', gulp.parallel(js)).on('change', function (event) {});
}

gulp.task('imgmin', function () {
    return imgmin();
});

exports.default = watcher;