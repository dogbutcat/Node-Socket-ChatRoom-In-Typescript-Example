var gulp = require('gulp'),
    webpack = require('webpack'),
    del = require('del');

var webpackConfig = require('./webpack.config');

gulp.task('webpack', ['clean','client'], () => {
    // console.log(webpackConfig.serverConfig);
    webpack(webpackConfig.serverConfig, (err, stats) => {
        err ? console.error(err) : null;
    })
})

gulp.task('clean', () => {
    var ret = del.sync(['./build/']);
    console.info(ret);
})

gulp.task('client', () => {
    webpack(webpackConfig.clientConfig, (err, stats) => {
        err ? console.log(err) : null;
    })
})