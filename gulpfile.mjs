import gulp from "gulp";
import fileinclude from "gulp-file-include";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import server from "gulp-server-livereload";
import clean from "gulp-clean";
import fs from "fs";
import sourceMaps from "gulp-sourcemaps";
import gulpPlumber from "gulp-plumber";
import notify from "gulp-notify";
import webpack from "webpack-stream";
import webpackConfig from "./webpack.config.js";
import named from "vinyl-named";
import imagemin from "gulp-imagemin";
import changed from "gulp-changed";
import autoprefixer from "gulp-autoprefixer";
import GulpCleanCss from "gulp-clean-css";
import htmlclean from "gulp-htmlclean";

const sass = gulpSass(dartSass);

function html() {
    return gulp
        .src("./src/html/*.html")
        .pipe(
            gulpPlumber({
                errorHandler: notify.onError({
                    title: "HTML",
                    message: "Error <%= error.message %>",
                    sound: false,
                }),
            })
        )
        .pipe(
            fileinclude({
                prefix: "@@",
                basepath: "@file",
            })
        )
        .pipe(htmlclean())
        .pipe(gulp.dest("./docs"));
}

function Sass() {
    return gulp
        .src("./src/scss/*.scss")
        .pipe(changed("./docs/css"))
        .pipe(
            gulpPlumber({
                errorHandler: notify.onError({
                    title: "Styles",
                    message: "Error <%= error.message %>",
                    sound: false,
                }),
            })
        )
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(GulpCleanCss())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest("./docs/css"));
}

function images() {
    return gulp
        .src("./src/img/**/*.*", { encoding: false })
        .pipe(changed("./docs/img"))
        .pipe(imagemin())
        .pipe(gulp.dest("./docs/img"));
}

function js() {
    return gulp
        .src("./src/js/*.js")
        .pipe(changed("./docs/js"))
        .pipe(
            gulpPlumber({
                errorHandler: notify.onError({
                    title: "JS",
                    message: "Error <%= error.message %>",
                    sound: false,
                }),
            })
        )
        .pipe(named())
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest("./docs/js"));
}

function startServer() {
    return gulp.src("./docs").pipe(
        server({
            open: true,
            livereload: true,
        })
    );
}

function gulpClean(done) {
    if (fs.existsSync("./docs")) {
        return gulp.src("./docs", { read: false }).pipe(clean({ force: true }));
    } else {
        console.log("Файл не существует");
        done();
    }
}

function watch() {
    gulp.watch("./src/scss/**/*.scss", gulp.series(Sass));
    gulp.watch("./src/**/*.html", gulp.series(html));
    gulp.watch("./src/img/**/*.*", gulp.series(images));
    gulp.watch("./src/js/**/*.js", gulp.series(js));
    gulp.watch("./src/JSON/**/*.json", gulp.series(JSON));
}

function JSON() {
    return gulp.src("./src/JSON/*.json").pipe(gulp.dest("./docs/JSON"));
}

const build = gulp.series(gulpClean, gulp.parallel(html, Sass, images, js, JSON), gulp.parallel(startServer, watch));
export { html, Sass, images, startServer, gulpClean, js, JSON, watch, build as default };
