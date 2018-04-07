import * as gulp from 'gulp'
import * as fs from 'fs-extra'
import * as babel from 'gulp-babel'
import * as uglify from 'uglify-es'
import * as ts from 'gulp-typescript'
import * as sourcemaps from 'gulp-sourcemaps'
import * as minify from 'gulp-uglify/composer'

const dest = 'lib'
const src = 'src/**/*.ts'
const babelrc = fs.readJsonSync('.babelrc')
const tsProject = ts.createProject('tsconfig.json')
const mapConfig = { includeContent: false, sourceRoot: './src' }

gulp.task('clean', () => fs.emptyDir(dest))

gulp.task('watch', ['clean', 'dev'], () => (gulp as any).watch(src, ['dev']))

gulp.task('update', ['dev'], () => {
  
})
gulp.task('dev', () => gulp
  .src(src)
  .pipe(sourcemaps.init())
  .pipe(tsProject())
  .pipe(babel(babelrc))
  .pipe(sourcemaps.write('.', mapConfig))
  .pipe(gulp.dest(dest))
)

gulp.task('default', ['clean'], () => gulp
  .src(src)
  .pipe(sourcemaps.init())
  .pipe(tsProject())
  .pipe(babel(babelrc))
  .pipe(minify(uglify, console))
  .pipe(sourcemaps.write('.', mapConfig))
  .pipe(gulp.dest(dest))
)
