// const fs = require('fs')
const gulp = require('gulp')
const rename = require('gulp-rename')
const less = require('gulp-less')
const cleanCSS = require('gulp-clean-css')
const prefixer = require('gulp-autoprefixer')
const merge = require('merge-stream')

gulp.task('copy_font', () =>
    gulp.src('styles/font/*.*').pipe(gulp.dest('dist/font')),
)

gulp.task('copy_types', () =>
    gulp.src('types/**/*.*').pipe(gulp.dest('dist/types')),
)

gulp.task('copy_ts', () =>
    gulp.src('src/**/*.*').pipe(gulp.dest('dist/src')),
)

gulp.task('build_style', () => {
  return merge(
    gulp
      .src(`styles/index.less`)
      .pipe(less())
      .pipe(
        prefixer({
          borwsers: ['last 1 version', '> 1%', 'not ie <= 8'],
          cascade: true,
          remove: true,
        }),
      )
      .pipe(
        rename({
          basename: 'index',
          extname: '.css',
        }),
      )
      .pipe(gulp.dest(`dist`))
      .pipe(
        rename({
          basename: 'index',
          extname: '.css',
        }),
      )
      .pipe(gulp.dest(`dist`))
      .pipe(cleanCSS())
      .pipe(
        rename({
          basename: 'index',
          suffix: '.min',
          extname: '.css',
        }),
      )
      .pipe(gulp.dest(`dist`)),
  )
})

gulp.task(
  'build',
  gulp.series(
      'copy_ts',
    'copy_types',
    'build_style',
    'copy_font',
  ),
)
