var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var args = require('yargs').argv;
var runSequence = require('run-sequence');
var express = require('gulp-express');

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')();

var pkg = require('./package.json');
var dirs = pkg['h5bp-configs'].directories;

gulp.task('clean', function (done) {
    require('del')([
        dirs.dist
    ]).then(function () {
        done();
    });
});

gulp.task('copy', [
    'copy:src',
    'copy:libs',
    'copy:css-libs',
    'copy:license',
    'copy:fonts',
    'copy:about'
]);


gulp.task('copy:libs', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js', 'node_modules/handlebars/dist/handlebars.min.js'])
               .pipe(gulp.dest(dirs.dist + '/frontend/js/vendor'));
});


gulp.task('copy:license', function () {
    return gulp.src('LICENSE.txt')
               .pipe(gulp.dest(dirs.dist));
});


gulp.task('copy:css-libs', function() {
    return gulp.src(['node_modules/font-awesome/css/font-awesome.min.css', 'node_modules/normalize.css/normalize.css'])
        .pipe(gulp.dest(dirs.dist + '/frontend/css/'));
});

gulp.task('copy:fonts', function() {
    return gulp.src(['node_modules/font-awesome/fonts/*'])
        .pipe(gulp.dest(dirs.dist + '/frontend/fonts/'));
});

gulp.task('copy:src', function () {
    return gulp.src([dirs.src + '/**/*'])
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('lint:js', function () {
    return gulp.src([
        'gulpfile.js',
        dirs.src + '/js/*.js',
        dirs.test + '/*.js'
    ]).pipe(plugins.jscs())
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('jshint-stylish'))
      .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('copy:about', function () {
    // Get the environment from the command line
    var build = args.TRAVIS_BUILD_NUMBER || 'localbuild';
    var commit = args.TRAVIS_COMMIT || '';
    var branch = args.TRAVIS_BRANCH || 'master';
    var project = args.TRAVIS_REPO_SLUG || 'projekt1';
    var committer = args.COMMIT_AUTHOR_EMAIL || '';
    var datetime = new Date().toISOString();

    // Read the settings from the right file

    // Replace each placeholder with the correct value for the variable.
    gulp.src('src/js/aboutService.js')
        .pipe(plugins.replace({
            patterns: [
                { match: 'BUILD', replacement: build },
                { match: 'COMMIT', replacement: commit },
                { match: 'BRANCH', replacement: branch },
                { match: 'PROJECT', replacement: project },
                { match: 'COMMITTER', replacement: committer },
                { match: 'DATETIME', replacement: datetime }
            ]
        }))
        .pipe(gulp.dest(dirs.dist + '/frontend/js/'));
});

gulp.task('build', function (done) {
    runSequence('clean', 'copy', function() {
        done();
    });
});

gulp.task('default', ['build']);

gulp.task('reload', ['copy'], function() {
    console.log('Reload');
});

gulp.task('start', ['build'], function() {
    express.run(['app.js'], {cwd: 'dist'});

    var watcher = gulp.watch(['src/**/*'], ['copy', 'reload']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type);
        express.notify(event);
    });

});

gulp.task('deploy', function() {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});

