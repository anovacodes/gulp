import gulp from "gulp"
import webpack from "webpack-stream"
import { deleteAsync } from "del"
import browserSync from "browser-sync"
import babel from "gulp-babel"
import fileinclude from "gulp-file-include"
import htmlmin from "gulp-html-minifier-terser"
import * as dartSass from "sass"
import gulpSass from "gulp-sass"
import concat from "gulp-concat"
import cleanCSS from "gulp-clean-css"
import autoPrefixer from "gulp-autoprefixer"
import ttf2woff from "gulp-ttf2woff"
import ttf2woff2 from "gulp-ttf2woff2"
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from "gulp-imagemin"
import webp from "gulp-webp"
import avif from "gulp-avif"
import { config } from "./webpack.config.js"
import { pathConfig } from "./path.config.js"

export const isDev = process.env.NODE_ENV === "development"

const sass = gulpSass(dartSass)

const cleanDist = async () => await deleteAsync(pathConfig.dist.root)

const liveReload = async () => {
    if (!isDev) {
        return null
    }

    browserSync.init({
        server: {
            baseDir: pathConfig.dist.root
        },
        port: 3000,
        open: false
    })
}

const html = () => {
    if (isDev) {
        return gulp.src(pathConfig.src.html)
            .pipe(
                fileinclude({
                    prefix: "@@",
                    basepath: "@file"
                })
            )
            .pipe(gulp.dest(pathConfig.dist.root))
            .pipe(browserSync.reload({ stream: true }))
    }

    return gulp.src(pathConfig.src.html)
        .pipe(
            fileinclude({
                prefix: "@@",
                basepath: "@file"
            })
        )
        .pipe(
            htmlmin({
                collapseWhitespace: true,
                removeComments: true
            })
        )
        .pipe(gulp.dest(pathConfig.dist.root))
}

const styles = () => {
    if (isDev) {
        return gulp.src(pathConfig.src.scss, { sourcemaps: true })
            .pipe(sass())
            .pipe(concat(pathConfig.dist.css.filename))
            .pipe(gulp.dest(pathConfig.dist.css.path, { sourcemaps: true }))
            .pipe(browserSync.reload({ stream: true }))
    }

    return gulp.src(pathConfig.src.scss)
        .pipe(sass({ outputStyle: "compressed" }))
        .pipe(concat(pathConfig.dist.css.filename))
        .pipe(cleanCSS())
        .pipe(autoPrefixer({ cascade: false }))
        .pipe(gulp.dest(pathConfig.dist.css.path))
}

const scripts = async () => {
    await deleteAsync(pathConfig.dist.js.path)

    if (isDev) {
        return gulp.src(pathConfig.src.js)
            .pipe(webpack(config))
            .pipe(gulp.dest(pathConfig.dist.js.path))
            .pipe(browserSync.reload({ stream: true }))
    }

    return gulp.src(pathConfig.src.js)
        .pipe(webpack(config))
        .pipe(babel())
        .pipe(gulp.dest(pathConfig.dist.js.path))
}

export const fontsTtf2Woff = () => {
    return gulp.src(pathConfig.src.fonts.ttf, {
            encoding: false,
            removeBOM: false
        })
        .pipe(ttf2woff())
        .pipe(gulp.dest(pathConfig.dist.fonts))
}

export const fontsTtf2Woff2 = () => {
    return gulp.src(pathConfig.src.fonts.ttf, {
            encoding: false,
            removeBOM: false
        })
        .pipe(ttf2woff2())
        .pipe(gulp.dest(pathConfig.dist.fonts))
}

const fonts = () => {
    fontsTtf2Woff()
    fontsTtf2Woff2()

    return gulp.src(pathConfig.src.fonts.default)
        .pipe(gulp.dest(pathConfig.dist.fonts))
        .pipe(browserSync.reload({ stream: true }))
}

export const images2Webp = () => {
    return gulp.src(pathConfig.src.images, { encoding: false })
        .pipe(webp())
        .pipe(gulp.dest(pathConfig.dist.images))
}

export const images2Avif = () => {
    return gulp.src(pathConfig.src.images + ".jpg", { encoding: false })
        .pipe(avif({ quality: 60 }))
        .pipe(gulp.dest(pathConfig.dist.images))
}

const images = async () => {
    await deleteAsync(pathConfig.dist.images)

    images2Webp()
    images2Avif()

    if (isDev) {
        return gulp.src(pathConfig.src.images, { encoding: false })
            .pipe(gulp.dest(pathConfig.dist.images))
            .on("end", () => browserSync.reload())
    }

    return gulp.src(pathConfig.src.images, { encoding: false })
        .pipe(
            imagemin([
                gifsicle({ interlaced: true }),
                mozjpeg({ quality: 80, progressive: true }),
                optipng({ optimizationLevel: 5 }),
                svgo({
                    plugins: [
                        { name: "removeViewBox", active: true },
                        { name: "cleanupIDs", active: false }
                    ]
                })
            ], { verbose: true })
        )
        .pipe(gulp.dest(pathConfig.dist.images))
}

const watching = async () => {
    if (!isDev) {
        return null
    }

    gulp.watch(pathConfig.watch.html, html)
    gulp.watch(pathConfig.watch.scss, styles)
    gulp.watch(pathConfig.watch.js, scripts)
    gulp.watch(pathConfig.watch.fonts, fonts)
    gulp.watch(pathConfig.watch.images, images)
}

export const build = gulp.series(
    cleanDist,
    gulp.parallel(html, styles, scripts, fonts, images),
    gulp.parallel(watching, liveReload)
)
