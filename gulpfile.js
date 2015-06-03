var gulp = require( 'gulp' ),
    jshint = require( 'gulp-jshint' ),
    sass = require( 'gulp-sass' ),
    sourcemaps = require( 'gulp-sourcemaps' ),
    concat = require( 'gulp-concat' );

gulp.task( 'default', [ 'watch' ] );

gulp.task( 'jshint', function() {
    return gulp.src( 'source/javascript/**/*.js' )
        .pipe( jshint() )
        .pipe( jshint.reporter( 'jshint-stylish' ));
});

gulp.task( 'build-css', function() {
    return gulp.src( 'source/scss/**/*.scss' )
        .pipe( sourcemaps.init() )
        .pipe( sass() )
        .pipe( concat( 'stylesheet.css' ))
        // .pipe( sourcemaps.write() )
        .pipe( gulp.dest( 'public/css' ));
});

gulp.task( 'script-concat', function() {
    return gulp.src( 'source/javascript/**/*.js' )
        .pipe( concat( 'main.js' ))
        .pipe( gulp.dest( 'public/js' ));
});

gulp.task( 'watch', function() {
    gulp.watch( 'source/javascript/**/*.js', [ 'jshint', 'script-concat' ] );
    gulp.watch( 'source/scss/**/*.scss', [ 'build-css' ] );
});
