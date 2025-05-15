export const pathConfig = {
    dist: {
        root: "dist",
        css: {
            path: "dist/assets/css",
            filename: "style.min.css"
        },
        js: {
            path: "dist/assets/js",
            filename: "index.min.js"
        },
        fonts: "dist/assets/fonts",
        images: "dist/assets/images"
    },
    src: {
        root: "src",
        html: "src/*.html",
        scss: ["src/assets/scss/lib/**/*.css", "src/assets/scss/*.scss"],
        js: "src/assets/js/index.js",
        fonts: {
            ttf: "src/assets/fonts/**/*.ttf",
            default: "src/assets/fonts/**/*.{woff,woff2}"
        },
        images: "src/assets/images/**/*"
    },
    watch: {
        html: "src/**/*.html",
        scss: "src/assets/scss/**/*",
        js: "src/assets/js/**/*",
        fonts: "src/assets/fonts/**/*",
        images: "src/assets/images/**/*"
    }
}
