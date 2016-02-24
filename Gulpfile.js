var  	 gulp           = require('gulp'),
	     concat         = require('gulp-concat'),
		   imageDataURI   = require('gulp-image-data-uri'),
		   imagemin		    = require('gulp-imagemin'),
			 pngquant 			= require('imagemin-pngquant'); // $ npm i -D imagemin-pngquant
       svg2png 	  		= require('gulp-svg2png');


 gulp.task('svgmin', function() {
     return gulp.src('./src/assets/svg/**/*')
         .pipe(imagemin({
             progressive: true,
             svgoPlugins: [{removeViewBox: false}]
         }))
         .pipe(gulp.dest('./dist/assets/svg'));
 });

 /**
  * Convert svgs to pngs
  */

 gulp.task('svg2png', ['svgmin'], function () {
     return gulp.src('./src/assets/svg/**/*.svg')
         .pipe(svg2png())
         .pipe(gulp.dest('./temp/assets/png'));
 });


 gulp.task('pngmin', ['svg2png'], function() {
		 return gulp.src('./temp/assets/png/**/*')
				 .pipe(imagemin({
						 progressive: true,
						 use: [pngquant()]
				 }))
				 .pipe(gulp.dest('./dist/assets/png'));
 });

/**
 * Convert images to data-uris and
 * concatenate them into .scss files.
 * The tasks for svg and png are
 * separate because they require a
 * different .hbs template and
 * outputted file.
 */

gulp.task('data-uri-svg', ['pngmin'], function() {
    return gulp.src('./src/assets/svg/**/*.svg')
        .pipe(imageDataURI({
            template: {
                file: './src/templates/data-uri-template-svg.hbs'
            }
        }))
        .pipe(concat('data-uri-svg.scss'))
        .pipe(gulp.dest('./dist/data-uris'));
});

gulp.task('data-uri-png', ['pngmin'], function() {
    return gulp.src('./dist/assets/png/**/*.png')
        .pipe(imageDataURI({
            template: {
                file: './src/templates/data-uri-template-png.hbs'
            }
        }))
        .pipe(concat('data-uri-png.scss'))
        .pipe(gulp.dest('./dist/data-uris'));
});




gulp.task('default', ['data-uri-svg', 'data-uri-png']);
