var gulp = require('gulp');
// var browserify = require('gulp-browserify');    
// var refresh = require('gulp-livereload');  
// var lr = require('tiny-lr');  
// var server = lr();
// var browserSync = require('browser-sync').create();
var connect = require('gulp-connect');

// gulp.task('scripts', function() {  
//     gulp.src(['js/**/*.js'])
//         .pipe(refresh(server))
// })

// gulp.task('lr-server', function() {  
//     server.listen();
// })

gulp.task('reload', function() {
  connect.reload();
})

gulp.task('serve', function() {
    // browserSync.init({
    //     server: {
    //         baseDir: "./"
    //     }
    // });
    connect.server({
      root: './',
      fallback: './index.html',
      livereload: true,
      port: 1337
    })

 //.on('change', browserSync.reload);

});

gulp.task('watch', function() {
      gulp.watch(['index.html'], ['reload']);
})

gulp.task('default', ['serve', 'watch']);
