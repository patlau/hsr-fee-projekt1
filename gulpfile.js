var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var replace = require('gulp-replace-task');
var args = require('yargs').argv;

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')();

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

var pkg = require('./package.json');
var dirs = pkg['h5bp-configs'].directories;

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('archive:create_archive_dir', function () {
    fs.mkdirSync(path.resolve(dirs.archive), '0755');
});

gulp.task('archive:zip', function (done) {

    var archiveName = path.resolve(dirs.archive, pkg.name + '_v' + pkg.version + '.zip');
    var archiver = require('archiver')('zip');
    var files = require('glob').sync('**/*.*', {
        'cwd': dirs.dist,
        'dot': true // include hidden files
    });
    var output = fs.createWriteStream(archiveName);

    archiver.on('error', function (error) {
        done();
        throw error;
    });

    output.on('close', done);

    files.forEach(function (file) {

        var filePath = path.resolve(dirs.dist, file);

        // `archiver.bulk` does not maintain the file
        // permissions, so we need to add files individually
        archiver.append(fs.createReadStream(filePath), {
            'name': file,
            'mode': fs.statSync(filePath).mode
        });

    });

    archiver.pipe(output);
    archiver.finalize();

});

gulp.task('clean', function (done) {
    require('del')([
        dirs.archive,
        dirs.dist
    ]).then(function () {
        done();
    });
});

gulp.task('copy', [
    'copy:index.html',
    'copy:jquery',
    'copy:license',
    'copy:main.css',
    'copy:misc',
    'copy:normalize',
    'copy:handlebars',
    'copy:font-awesome.css',
    'copy:font-awsome.fonts',
    'copy:about'
]);

gulp.task('copy:.htaccess', function () {
    return gulp.src('node_modules/apache-server-configs/dist/.htaccess')
               .pipe(plugins.replace(/# ErrorDocument/g, 'ErrorDocument'))
               .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:index.html', function () {
    return gulp.src(dirs.src + '/index.html')
               .pipe(plugins.replace(/{{JQUERY_VERSION}}/g, pkg.devDependencies.jquery))
               .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:jquery', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js'])
               .pipe(plugins.rename('jquery-' + pkg.devDependencies.jquery + '.min.js'))
               .pipe(gulp.dest(dirs.dist + '/js/vendor'));
});

gulp.task('copy:handlebars', function () {
    return gulp.src(['node_modules/handlebars/dist/handlebars.min.js'])
        .pipe(gulp.dest(dirs.dist + '/js/vendor'));
});

gulp.task('copy:license', function () {
    return gulp.src('LICENSE.txt')
               .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:main.css', function () {

    var banner = '/*! HTML5 Boilerplate v' + pkg.version +
                    ' | ' + pkg.license.type + ' License' +
                    ' | ' + pkg.homepage + ' */\n\n';

    return gulp.src(dirs.src + '/css/main.css')
               .pipe(plugins.header(banner))
               .pipe(plugins.autoprefixer({
                   browsers: ['last 2 versions', 'ie >= 8', '> 1%'],
                   cascade: false
               }))
               .pipe(gulp.dest(dirs.dist + '/css'));
});

gulp.task('copy:font-awesome.css', function() {
    return gulp.src(['node_modules/font-awesome/css/font-awesome.min.css'])
        .pipe(gulp.dest(dirs.dist + '/css/'));
});

gulp.task('copy:font-awsome.fonts', function() {
    return gulp.src(['node_modules/font-awesome/fonts/*'])
        .pipe(gulp.dest(dirs.dist + '/fonts/'));
});

gulp.task('copy:misc', function () {
    return gulp.src([

        // Copy all files
        dirs.src + '/**/*',

        // Exclude the following files
        // (other tasks will handle the copying of these files)
        '!' + dirs.src + '/css/main.css',
        '!' + dirs.src + '/index.html',
        '!' + dirs.src + '/js/about.js'

    ], {

        // Include hidden files by default
        dot: true

    }).pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:normalize', function () {
    return gulp.src('node_modules/normalize.css/normalize.css')
               .pipe(gulp.dest(dirs.dist + '/css'));
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
    var committer = args.COMMIT_AUTHOR_EMAIL || 'plauper@yahoo.com';
    var datetime = new Date().toISOString();

    // Read the settings from the right file

    // Replace each placeholder with the correct value for the variable.
    gulp.src('src/js/about.js')
        .pipe(replace({
            patterns: [
                { match: 'BUILD', replacement: build },
                { match: 'COMMIT', replacement: commit },
                { match: 'BRANCH', replacement: branch },
                { match: 'PROJECT', replacement: project },
                { match: 'COMMITTER', replacement: committer },
                { match: 'DATETIME', replacement: datetime }
            ]
        }))
        .pipe(gulp.dest('dist/js/'));
});


// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('archive', function (done) {
    runSequence(
        'build',
        'archive:create_archive_dir',
        'archive:zip',
    done);
});

gulp.task('build', function (done) {
    runSequence(
        ['clean', 'lint:js'],
        'copy',
    done);
});

gulp.task('default', ['build']);

// ---
// Watch
// ---

// Spin up livereload server and listen for file changes
gulp.task('listen', function () {
    plugins.livereload.listen();
});

// Compile files and generate docs when something changes
gulp.task('watch', function() {
    gulp.watch(dirs.src + '/**/*.*', ['default']);
});

gulp.task('deploy', function() {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});
